import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads-store";
import { getDemo, isExpired } from "@/lib/db";

type LeadPayload = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  service?: string;
  notes?: string;
  slug?: string;
};

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
    businessName
  });

  return NextResponse.json({ ok: true });
}
