import { NextResponse } from "next/server";
import { business } from "@/lib/business";
import { saveLead } from "@/lib/leads-store";
import { getDemo, isExpired } from "@/lib/db";
import type { SiteConfig } from "@/lib/site-config";
import { prepareAttachments, type ReadyAttachment } from "@/lib/attachments-server";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** What the API takes for a turn: plain text, or text plus pictures. */
type Part = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };
type OutboundMessage = { role: string; content: string | Part[] };

/**
 * A photo the visitor sent with their latest message.
 *
 * Only images go to the model; a PDF is kept for the owner's email but not
 * shown to the assistant, which has nothing useful to say about one.
 */
function toVisionContent(text: string, photos: ReadyAttachment[]): string | Part[] {
  const images = photos.filter((p) => p.type.startsWith("image/"));
  if (images.length === 0) return text;
  return [
    { type: "text", text: text || "Here are photos of the tree." },
    ...images.map(
      (p): Part => ({ type: "image_url", image_url: { url: `data:${p.type};base64,${p.content}` } })
    )
  ];
}

const LEAD_BLOCK_RE = /```lead\s*([\s\S]*?)```/i;

const MODEL = process.env.OPENAI_MODEL || "gpt-5";

/**
 * gpt-5 is a reasoning model: it rejects a custom `temperature` and wants
 * `max_completion_tokens`, whose budget the hidden reasoning tokens also eat.
 * Older chat models take the classic parameters, so build the body per family.
 */
function chatBody(model: string, messages: OutboundMessage[], temperature: number) {
  const reasoning = /^(gpt-5|o\d)/.test(model);
  return reasoning
    ? { model, messages, reasoning_effort: "low", max_completion_tokens: 900 }
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
- Give rough pricing guidance using the prices above when asked, but make clear a final price needs an on-site or photo-based estimate.
- When a visitor sends a photo, say what you can actually see in plain words: roughly how big the tree is against the house or fence, what sits underneath it, how close the roof, driveway or power lines are, and anything that looks dead, split, leaning or storm-damaged. Then ask the one thing the photo cannot answer -- usually how a truck or chipper would reach it, or whether there is a gate wide enough.
- A photo narrows a price, it never sets one. Access, slope, what is buried, and how the debris leaves the property decide as much as the tree does, and none of them show up in a picture. So never put a number on a photo that is not already in the price list above, and never let an estimate sound settled: say what it depends on and offer the free estimate.
- If a photo shows something dangerous -- a tree on a structure, a split trunk, a limb across a power line -- say so plainly and first, before anything else.${isDemo ? ' Where a service is listed as "Free estimate" there is no published price: say the cost depends on size, access and cleanup, and offer a free estimate. Never guess a number.' : ""}
${isDemo ? `- Never claim certifications, licences, insurance, years in business, team size, awards, or prices unless they appear above. If asked about any of those and it is not listed, say you will have the owner confirm it directly.\n` : ""}- Never invent services, prices, or availability that aren't listed above.

HOW TO WRITE
Hard limit: 40 words. One or two sentences, three only if you are asking for their number at the same time. This is a chat bubble on a phone, so a wall of text does not get read.
Lead with the thing they asked for, add one supporting detail at most, then stop. Never list every service or every price.
Write like a person texting from the office. Short sentences that flow into each other, contractions, plain words.
No dashes of any kind, no semicolons, no comma before "and". No bullet points, no numbered lists, no headings, no bold.
Never open with "Great", "Absolutely", "Sure thing", or by repeating their question back. Never say "I understand your concern", "rest assured", or "happy to help".
Ask one question at a time, never two.
Good: "Sounds like a removal. Ballpark is $650 to $1,200 depending on size and access. What's the best number for you and I'll get someone out to look?"
Bad: "Thank you for reaching out! I understand your concern about the tree. We offer several services including removal, trimming, and stump grinding..."

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

  let body: { messages?: ChatMessage[]; slug?: string; attachments?: unknown };
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

  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const { files: photos, error: photoError } = prepareAttachments(body.attachments);
  if (photoError) return NextResponse.json({ error: photoError }, { status: 400 });

  /*
    Only the newest message carries pictures. Re-sending every photo on every
    turn would grow the request without end, and the assistant has already
    said what it saw in the earlier ones.
  */
  const forModel: OutboundMessage[] = messages.map((m, i) =>
    i === messages.length - 1 && m.role === "user" && photos.length > 0
      ? { role: m.role, content: toVisionContent(m.content, photos) }
      : m
  );

  let completion: Response;
  try {
    completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(
        chatBody(MODEL, [{ role: "system", content: buildSystemPrompt(config, Boolean(slug)) }, ...forModel], 0.6)
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
          businessName: config.companyName,
          // Whatever they sent lands on the owner's email with the lead, so
          // the job is quoted from the same pictures the assistant saw.
          attachments: photos
        });
        leadCaptured = true;
      }
    } catch (err) {
      console.error("Failed to parse lead block from AI reply", err);
    }
  }

  return NextResponse.json({ reply, leadCaptured });
}
