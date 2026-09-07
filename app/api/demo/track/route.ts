import { NextResponse } from "next/server";
import { recordEngagement, SLUG_RE } from "@/lib/db";

/**
 * Receives what the owner did with their draft.
 *
 * Deliberately forgiving: this is fire-and-forget from a beacon that may
 * arrive as the tab closes, and a failure here must never be visible on the
 * page. Everything returns 204 regardless.
 */

const EVENTS = /^(view|scroll|dwell|assistant|cta:[a-z-]{1,24})$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string; event?: string; page?: string; value?: number };
    const slug = String(body.slug ?? "");
    const event = String(body.event ?? "");

    if (!SLUG_RE.test(slug) || !EVENTS.test(event)) return new NextResponse(null, { status: 204 });

    await recordEngagement(slug, {
      event,
      page: String(body.page ?? "").slice(0, 120),
      value: typeof body.value === "number" && Number.isFinite(body.value) ? Math.round(body.value) : undefined,
      at: new Date().toISOString()
    });
  } catch {
    /* Never surface a tracking failure to the visitor. */
  }
  return new NextResponse(null, { status: 204 });
}
