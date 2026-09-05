import { promises as fs } from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

export type Lead = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  service?: string;
  notes?: string;
  source: "quote-form" | "ai-chat";
  /** Set when the lead came from a demo page. Tags the notification. */
  slug?: string;
  /** The business the visitor thought they were contacting. */
  businessName?: string;
  submittedAt: string;
};

const OWNER_EMAIL = process.env.OWNER_EMAIL || "hello@morebookednow.com";

/**
 * Leads from a demo page belong to us, not to the prospect: nobody has agreed
 * to anything yet, so they go to the owner inbox tagged with the slug. Leads
 * on the real site go to the business.
 */
export async function saveLead(lead: Omit<Lead, "submittedAt">) {
  const record: Lead = { ...lead, submittedAt: new Date().toISOString() };

  await Promise.all([appendToFile(record), notify(record)]);

  console.log("New lead:", record);
  return record;
}

// Interim local storage so leads aren't lost during development. A serverless
// deploy won't persist this file between requests -- email is the real channel.
async function appendToFile(record: Lead) {
  try {
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(LEADS_FILE, "utf-8"));
    } catch {
      existing = [];
    }
    existing.push(record);
    await fs.writeFile(LEADS_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist lead", err);
  }
}

async function notify(record: Lead) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM;
  const to = record.slug ? OWNER_EMAIL : process.env.LEADS_TO || OWNER_EMAIL;

  const lines = [
    record.slug ? `Demo:     ${record.slug}` : null,
    record.businessName ? `Business: ${record.businessName}` : null,
    `Source:   ${record.source}`,
    "",
    `Name:     ${record.name}`,
    `Phone:    ${record.phone}`,
    `Email:    ${record.email || "(not given)"}`,
    `Address:  ${record.address || "(not given)"}`,
    `Service:  ${record.service || "(not given)"}`,
    "",
    record.notes || ""
  ].filter((line) => line !== null);

  const text = lines.join("\n");

  if (!key || !from) {
    console.warn("[leads] No email provider configured; lead not delivered.\n" + text);
    return;
  }

  const tag = record.slug ? `[demo: ${record.slug}] ` : "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: record.email?.includes("@") ? record.email : undefined,
        subject: `${tag}New lead: ${record.name} - ${record.service || "tree work"}`,
        text
      })
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch (err) {
    console.error("[leads] Delivery failed:", err);
  }
}
