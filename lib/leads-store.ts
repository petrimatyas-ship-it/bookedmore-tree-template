import { promises as fs } from "fs";
import path from "path";
import { humanSize } from "@/lib/attachments";
import type { ReadyAttachment } from "@/lib/attachments-server";

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
  /** Photos of the job, sent on the notification rather than stored. */
  attachments?: ReadyAttachment[];
  /**
   * A stored site's own lead addresses (its data's `leadsTo`): the request goes
   * there as well as to the owner inbox. Set by the server, never by the visitor.
   */
  alsoTo?: string[];
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

  const [, delivered] = await Promise.all([appendToFile(record), notify(record)]);

  console.log("New lead:", { ...record, attachments: record.attachments?.length ?? 0 });
  return { record, delivered };
}

const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[a-z]{2,}$/i;
/** A stored site's `leadsTo`: valid addresses only, at most five. */
export function leadAddresses(v: unknown): string[] {
  const list = Array.isArray(v) ? v : typeof v === "string" ? [v] : [];
  return [...new Set(list.filter((x): x is string => typeof x === "string").map((x) => x.trim().toLowerCase()).filter((x) => EMAIL_RE.test(x)))].slice(0, 5);
}

// Interim local storage so leads aren't lost during development. A serverless
// deploy won't persist this file between requests -- email is the real channel.
async function appendToFile(record: Lead) {
  // The photos travel by email. Writing their base64 here would turn a file
  // meant to be read during development into a wall of noise, so the log
  // keeps their names and sizes and drops the bytes.
  const { attachments, ...rest } = record;
  record = {
    ...rest,
    ...(attachments?.length
      ? { notes: `${rest.notes || ""}\n[${attachments.length} photo(s): ${attachments.map((a) => a.filename).join(", ")}]`.trim() }
      : {})
  } as Lead;

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

async function notify(record: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM;
  const to = [...new Set([record.slug ? OWNER_EMAIL : process.env.LEADS_TO || OWNER_EMAIL, ...(record.alsoTo ?? [])])];

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
    record.attachments?.length
      ? `Photos:   ${record.attachments.length} attached — ${record.attachments
          .map((a) => `${a.filename} (${humanSize(a.bytes)})`)
          .join(", ")}`
      : null,
    "",
    record.notes || ""
  ].filter((line) => line !== null);

  const text = lines.join("\n");

  if (!key || !from) {
    console.warn("[leads] No email provider configured; lead not delivered.\n" + text);
    return false;
  }

  const tag = record.slug ? `[demo: ${record.slug}] ` : "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to,
        reply_to: record.email?.includes("@") ? record.email : undefined,
        subject: `${tag}New lead: ${record.name} - ${record.service || "tree work"}`,
        text,
        ...(record.attachments?.length
          ? {
              attachments: record.attachments.map((a) => ({ filename: a.filename, content: a.content }))
            }
          : {})
      })
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return true;
  } catch (err) {
    console.error("[leads] Delivery failed:", err);
    return false;
  }
}
