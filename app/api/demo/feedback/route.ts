import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getFeedback, putFeedback, SLUG_RE, type FeedbackItem } from "@/lib/db";
import { reviewKeyOk } from "@/lib/review";

/**
 * The owner's review notes on a demo page (see public/review.js).
 *
 *   GET  ?slug=&key=                              -> { items }
 *   POST { slug, key, action: "add", item }       -> { item }
 *   POST { slug, key, action: "delete", id }      -> { ok }
 *   POST { slug, key, action: "status", id, status: "open" | "done" } -> { ok }
 *
 * Everything needs the review key; without it the route says nothing.
 */

export const dynamic = "force-dynamic";

const TYPES = new Set(["like", "dislike", "change"]);
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";
  if (!reviewKeyOk(url.searchParams.get("key")) || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  return NextResponse.json({ items: await getFeedback(slug) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const slug = String(body.slug ?? "");
  if (!reviewKeyOk(body.key) || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  const items = await getFeedback(slug);

  if (body.action === "add") {
    const raw = (body.item ?? {}) as Record<string, unknown>;
    const type = String(raw.type);
    if (!TYPES.has(type)) return NextResponse.json({ error: "Bad type." }, { status: 400 });
    const item: FeedbackItem = {
      id: randomUUID().slice(0, 8),
      type: type as FeedbackItem["type"],
      note: clip(raw.note, 1500),
      selector: clip(raw.selector, 600),
      text: clip(raw.text, 300),
      section: clip(raw.section, 120),
      page: clip(raw.page, 200),
      width: typeof raw.width === "number" && Number.isFinite(raw.width) ? Math.round(raw.width) : 0,
      at: new Date().toISOString(),
      status: "open"
    };
    if (items.length >= 300) return NextResponse.json({ error: "Too many notes." }, { status: 400 });
    await putFeedback(slug, [...items, item]);
    return NextResponse.json({ item });
  }

  const id = String(body.id ?? "");
  if (body.action === "delete") {
    await putFeedback(slug, items.filter((i) => i.id !== id));
    return NextResponse.json({ ok: true });
  }
  if (body.action === "status" && (body.status === "open" || body.status === "done")) {
    await putFeedback(slug, items.map((i) => (i.id === id ? { ...i, status: body.status as FeedbackItem["status"] } : i)));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Bad action." }, { status: 400 });
}
