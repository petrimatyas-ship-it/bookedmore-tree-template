import { NextResponse } from "next/server";
import { leadAddresses, saveLead } from "@/lib/leads-store";
import { getDemo, getSite, isExpired } from "@/lib/db";
import { prepareAttachments } from "@/lib/attachments-server";
import type { Attachment } from "@/lib/attachments";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  service?: string;
  notes?: string;
  slug?: string;
  /** Photos of the tree, base64, straight through to the lead email. */
  attachments?: Attachment[];
};

/** A site's name as plain text (stored data is HTML-escaped). */
const plainName = (v: unknown) =>
  String(v ?? "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const address = (body.address || "").trim();
  const service = (body.service || "").trim();

  const { files, error: fileError } = prepareAttachments(body.attachments);
  if (fileError) return NextResponse.json({ error: fileError }, { status: 400 });

  // A stored site that sends its leads (data.leadsTo): the request goes to the
  // owner inbox and to the business's own addresses. Name and phone are enough.
  const site = typeof body.slug === "string" && body.slug ? await getSite(body.slug) : null;
  const alsoTo = site ? leadAddresses((site.data as { leadsTo?: unknown }).leadsTo) : [];
  if (site && alsoTo.length) {
    if (!name || !phone) return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    const { delivered } = await saveLead({
      name: name.slice(0, 120),
      phone: phone.slice(0, 40),
      email: (body.email || "").trim().slice(0, 200),
      address: address.slice(0, 300),
      service: service.slice(0, 300),
      notes: (body.notes || "").trim().slice(0, 3000),
      source: "quote-form",
      slug: site.slug,
      businessName: plainName(site.data.name),
      attachments: files,
      alsoTo
    });
    return NextResponse.json({ ok: true, delivered });
  }

  if (!name || !phone || !address || !service) {
    return NextResponse.json(
      { error: "Name, phone, address, and service are required." },
      { status: 400 }
    );
  }

  // A submission from a demo page is tagged with its slug so the notification
  // reaches us, not the prospect, and says which draft it came from.
  let slug: string | undefined;
  let businessName: string | undefined;
  if (typeof body.slug === "string" && body.slug) {
    const demo = await getDemo(body.slug);
    if (!demo || isExpired(demo)) {
      return NextResponse.json({ error: "This demo is no longer available." }, { status: 404 });
    }
    slug = demo.slug;
    businessName = demo.config.companyName;
  }

  await saveLead({
    name,
    phone,
    email: (body.email || "").trim(),
    address,
    service,
    notes: (body.notes || "").trim(),
    source: "quote-form",
    slug,
    businessName,
    attachments: files
  });

  return NextResponse.json({ ok: true });
}
