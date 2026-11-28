import { NextResponse } from "next/server";
import { getSite, SLUG_RE } from "@/lib/db";

/**
 * A prospect writing to us from their preview site (lib/offer.ts), by email to
 * the owner inbox, the same one the estimate forms on previews reach:
 *
 *   { kind: "question", slug, name, email, question }        "Ask me a question" on /<slug>/live
 *   { kind: "new-customer", slug, hasDomain, domain, changes, phone, session }
 *                                                            the three questions on /welcome, after Stripe
 *
 * The subject says who: "NEW CUSTOMER · <business>" or "Question · <business>".
 * A filled `website` field is a bot (the forms hide it); it is answered as sent.
 */

const OWNER_EMAIL = process.env.OWNER_EMAIL || "hello@morebookednow.com";
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[a-z]{2,}$/i;

const plainName = (v: unknown) =>
  String(v ?? "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const field = (v: unknown, max: number) => String(v ?? "").replace(/\r/g, "").trim().slice(0, max);

export async function POST(request: Request) {
  let b: Record<string, unknown>;
  try {
    b = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (field(b.website, 200)) return NextResponse.json({ ok: true });

  const kind = b.kind === "new-customer" ? "new-customer" : b.kind === "question" ? "question" : null;
  if (!kind) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const slug = field(b.slug, 90).toLowerCase();
  const site = SLUG_RE.test(slug) ? await getSite(slug) : null;
  const business = site ? plainName(site.data.name) || slug : slug || "(site not known)";
  const siteUrl = site ? `https://demo.morebookednow.com/${slug}` : "";

  let subject: string;
  let lines: (string | false)[];
  let replyTo: string | undefined;
  if (kind === "question") {
    const email = field(b.email, 200);
    const question = field(b.question, 3000);
    if (!EMAIL_RE.test(email) || !question) return NextResponse.json({ error: "An email and a question are needed." }, { status: 400 });
    replyTo = email;
    subject = `Question · ${business}`;
    lines = [`From:     ${field(b.name, 120) || "(no name)"} <${email}>`, `Business: ${business}`, !!siteUrl && `Site:     ${siteUrl}`, "", question];
  } else {
    const phone = field(b.phone, 40);
    if (!phone) return NextResponse.json({ error: "A phone number is needed." }, { status: 400 });
    subject = `NEW CUSTOMER · ${business}`;
    lines = [
      `Business:    ${business}`,
      !!siteUrl && `Site:        ${siteUrl}`,
      `Has domain:  ${field(b.hasDomain, 10) || "(not answered)"}`,
      `Domain:      ${field(b.domain, 200) || "(none given)"}`,
      `Text them:   ${phone}`,
      !!field(b.session, 200) && `Stripe:      ${field(b.session, 200)}`,
      "",
      "Changes they want:",
      field(b.changes, 3000) || "(none)"
    ];
  }
  const text = lines.filter((l): l is string => l !== false).join("\n");

  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM;
  if (!key || !from) {
    console.warn(`[owner-message] No email provider configured; not delivered.\n${subject}\n${text}`);
    return NextResponse.json({ error: "Not delivered." }, { status: 502 });
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to: [OWNER_EMAIL], reply_to: replyTo, subject, text })
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
  } catch (err) {
    console.error("[owner-message] Delivery failed:", err);
    return NextResponse.json({ error: "Not delivered." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
