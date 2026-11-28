import { NextResponse } from "next/server";
import { getSite, SLUG_RE } from "@/lib/db";
import { REGISTRARS, delegateEmail, domainGuide, liveHost } from "@/lib/offer";

/**
 * A prospect writing to us from their preview site (lib/offer.ts), by email to
 * the owner inbox, the same one the estimate forms on previews reach:
 *
 *   { kind: "question", slug, name, email, question }        "Ask me a question" on /<slug>/live
 *   { kind: "new-customer", slug, hasDomain, domain, registrar, changes, phone, email, session }
 *                                                            the questions on /welcome, after Stripe; with a domain,
 *                                                            they also get that registrar's one step by email
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
  // with a domain: the registrar's one step (lib/offer.ts), emailed to the new customer too
  let guideMail: { to: string; subject: string; text: string } | null = null;
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
    const email = field(b.email, 200);
    if (EMAIL_RE.test(email)) replyTo = email;
    const hasDomain = field(b.hasDomain, 10) === "yes";
    const domain = field(b.domain, 200);
    const registrar = REGISTRARS.some(([k]) => k === b.registrar) ? String(b.registrar) : "unknown";
    const registrarName = REGISTRARS.find(([k]) => k === registrar)?.[1] ?? "I don't know";
    const host = site ? liveHost(slug) : "";
    subject = `NEW CUSTOMER · ${business}`;
    const guide = hasDomain ? domainGuide(registrar, delegateEmail()) : null;
    if (guide && replyTo) {
      guideMail = {
        to: replyTo,
        subject: `Your domain: one quick step (${guide.title})`,
        text: [
          "Thank you for going live with MoreBookedNow.",
          "",
          `Your site goes live within 48 hours${host ? ` at ${host}` : ""}. To move it over to ${domain || "your domain"}, we need one quick step from you:`,
          "",
          guide.title,
          ...guide.steps.map((s, i) => `${i + 1}. ${s}`),
          "",
          guide.note,
          "",
          "Reply to this email if anything is unclear.",
          "",
          "MoreBookedNow"
        ].join("\n")
      };
    }
    lines = [
      `Business:    ${business}`,
      !!siteUrl && `Site:        ${siteUrl}`,
      !!host && `Go live at:  ${host} (within 48 hours)`,
      `Has domain:  ${hasDomain ? "yes" : field(b.hasDomain, 10) || "(not answered)"}`,
      hasDomain && `Domain:      ${domain || "(none given)"}`,
      hasDomain && `Registrar:   ${registrarName}${guide ? ` (sent them: ${guide.title}${replyTo ? "" : ", but no email to send it to"})` : ""}`,
      `Text them:   ${phone}`,
      `Email:       ${email || "(not given)"}`,
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
    if (guideMail) {
      // the owner has their answers already; a failed guide email is logged, not shown to them as a failure
      const mail = guideMail;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ from, to: [mail.to], reply_to: OWNER_EMAIL, subject: mail.subject, text: mail.text })
      })
        .then(async (g) => {
          if (!g.ok) console.error("[owner-message] Domain guide not sent:", g.status, (await g.text()).slice(0, 200));
        })
        .catch((e) => console.error("[owner-message] Domain guide not sent:", e));
    }
  } catch (err) {
    console.error("[owner-message] Delivery failed:", err);
    return NextResponse.json({ error: "Not delivered." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
