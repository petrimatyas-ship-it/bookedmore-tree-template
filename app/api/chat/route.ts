import { NextResponse } from "next/server";
import { business } from "@/lib/business";
import { saveLead } from "@/lib/leads-store";
import { getDemo, isExpired } from "@/lib/db";
import type { SiteConfig } from "@/lib/site-config";

type ChatMessage = { role: "user" | "assistant"; content: string };

const LEAD_BLOCK_RE = /```lead\s*([\s\S]*?)```/i;

const MODEL = process.env.OPENAI_MODEL || "gpt-5";

/**
 * gpt-5 is a reasoning model: it rejects a custom `temperature` and wants
 * `max_completion_tokens`, whose budget the hidden reasoning tokens also eat.
 * Older chat models take the classic parameters, so build the body per family.
 */
function chatBody(model: string, messages: { role: string; content: string }[], temperature: number) {
  const reasoning = /^(gpt-5|o\d)/.test(model);
  return reasoning
    ? { model, messages, reasoning_effort: "low", max_completion_tokens: 1200 }
    : { model, messages, temperature, max_tokens: 600 };
}

function buildSystemPrompt(config: SiteConfig, isDemo: boolean) {
  const services = config.serviceCards.map((s) => `- ${s.title} (${s.price}): ${s.description}`).join("\n");
  const areas = config.serviceAreas.join(", ");
  const faqs = (config.faqs ?? []).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n");

  return `You are the friendly, knowledgeable virtual assistant for ${config.companyName}, a tree service company. ${config.description}

Service areas: ${areas}
Phone: ${config.phone}
${config.responseNote ? `Availability: ${config.responseNote}\n` : ""}
Services and prices:
${services}
${faqs ? `\nFAQs:\n${faqs}\n` : ""}
How you should behave:
- Have a natural, warm, concise conversation. Do not sound like a form. Ask one question at a time.
- Help the visitor figure out what they need: what's going on with the tree (removal, trimming, storm damage, stump, etc.), roughly how urgent it is, whether it's near a structure or power line, and their property location/ZIP.
- If it sounds urgent (storm damage, a tree on a house, blocking a road, hanging over power lines), treat it as high priority and say so.
- Collect their name, phone number, and property address or area. Do it early: by your third or fourth reply you should have asked for a name and number at least once. Never let a conversation run past that point on job details alone.
- Ask for the number by attaching it to something they get, not as a form field. Good: "What's the best number for you? I'll have someone text you a time window for the estimate." or "Give me your name and number and I'll get you on this week's schedule." Bad: "Can I have your contact information?"
- Once they've told you what they need and roughly where, that is the moment to ask -- pair the request with the next step (a time window, a quote by text, a spot on the schedule) so it reads as helping, not qualifying.
- If they answer a question but skip the number, ask once more the next time you reply, worded differently and tied to a benefit. If they decline twice, stop asking and give them the phone number to call instead.
- Keep answering their questions either way. Never withhold pricing or availability to force them to hand over details.
- Give rough pricing guidance using the prices above when asked, but make clear a final price needs an on-site or photo-based estimate.${isDemo ? ' Where a service is listed as "Free estimate" there is no published price: say the cost depends on size, access and cleanup, and offer a free estimate. Never guess a number.' : ""}
${isDemo ? `- Never claim certifications, licences, insurance, years in business, team size, awards, or prices unless they appear above. If asked about any of those and it is not listed, say you will have the owner confirm it directly.\n` : ""}- Never invent services, prices, or availability that aren't listed above.
- Keep replies short -- a few sentences, not paragraphs.
- Write like a real person texting from the office: plain short sentences, contractions, no em dashes, no bullet lists, never phrases like "I understand your concern" or "rest assured".

Lead capture protocol (very important):
Once you have collected AT LEAST the visitor's name, phone number, and what they need (service type or a clear description of the job), append a fenced block at the very end of your reply, after your normal conversational text, in exactly this format:

\`\`\`lead
{"name": "...", "phone": "...", "address": "...", "service": "...", "notes": "...", "urgent": true}
\`\`\`

Only include this block once per conversation, the first time you have enough information. "address" can be a ZIP, neighborhood, or full address -- whatever they've given. "notes" should summarize the job details. "urgent" is true only for genuinely time-sensitive situations (storm damage, hazard to people/property/power lines). If you don't yet have name + phone + a service description, do NOT include the block.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The assistant isn't configured yet. Please call us instead." }, { status: 500 });
  }

  let body: { messages?: ChatMessage[]; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A demo page sends its slug: the assistant then answers as that business,
  // built from the same record the page renders from.
  let config: SiteConfig = business;
  let slug: string | undefined;
  if (typeof body.slug === "string" && body.slug) {
    const demo = await getDemo(body.slug);
    if (!demo || isExpired(demo)) {
      return NextResponse.json({ error: "This demo is no longer available." }, { status: 404 });
    }
    config = demo.config;
    slug = demo.slug;
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  let completion: Response;
  try {
    completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(
        chatBody(MODEL, [{ role: "system", content: buildSystemPrompt(config, Boolean(slug)) }, ...messages], 0.6)
      )
    });
  } catch (err) {
    console.error("OpenAI request failed", err);
    return NextResponse.json({ error: "Couldn't reach the assistant. Please call us instead." }, { status: 502 });
  }

  if (!completion.ok) {
    const errText = await completion.text().catch(() => "");
    console.error("OpenAI API error", completion.status, errText);
    return NextResponse.json(
      { error: "The assistant is having trouble right now. Please call us instead." },
      { status: 502 }
    );
  }

  const data = await completion.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";

  let reply = raw;
  let leadCaptured = false;

  const match = raw.match(LEAD_BLOCK_RE);
  if (match) {
    reply = raw.replace(LEAD_BLOCK_RE, "").trim();
    try {
      const parsed = JSON.parse(match[1]);
      const name = String(parsed.name || "").trim();
      const phone = String(parsed.phone || "").trim();
      if (name && phone) {
        await saveLead({
          name,
          phone,
          address: String(parsed.address || "").trim(),
          service: String(parsed.service || "").trim(),
          notes: [parsed.urgent ? "URGENT" : "", String(parsed.notes || "").trim()].filter(Boolean).join(" -- "),
          source: "ai-chat",
          slug,
          businessName: config.companyName
        });
        leadCaptured = true;
      }
    } catch (err) {
      console.error("Failed to parse lead block from AI reply", err);
    }
  }

  return NextResponse.json({ reply, leadCaptured });
}
