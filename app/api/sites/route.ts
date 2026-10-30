import { NextResponse } from "next/server";
import { readdirSync } from "fs";
import path from "path";
import { deleteSite, getEngagement, getSite, putSite, SLUG_RE, type StoredSite } from "@/lib/db";
import { isTemplate, renderSite } from "@/lib/detailing-page";
import { siteMakerKeyOk } from "@/lib/site-maker-key";

/**
 * Sites the Replymint site maker builds (loopfinity, lib/site-maker.ts).
 *
 *   POST   { slug, template, data } -> { url }   stores or replaces it;
 *          template is "detailing", "pressure-washing" or "landscaping" (lib/detailing-page.ts)
 *   GET    ?slug=                               -> { site, visits }
 *   DELETE ?slug=                               -> { ok }
 *
 * Every call needs `Authorization: Bearer <SITE_MAKER_KEY>`. A stored site is
 * served at /<slug> by app/[slug]/route.ts with its template (the detailing
 * one is the same the hand-built detailing pages use).
 */

export const dynamic = "force-dynamic";

/** Addresses already taken by the app itself or a hand-built page. */
function taken(slug: string): boolean {
  const fixed = ["about", "api", "demo", "demo-assets", "modern", "pricing", "quote", "reviews", "service-areas", "services", "tree-service", "angel-pro", "images", "review", "robots", "sitemap"];
  if (fixed.includes(slug)) return true;
  try {
    return readdirSync(path.join(process.cwd(), "demo-templates/detailing/businesses")).includes(`${slug}.json`);
  } catch {
    return false;
  }
}

const no = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  if (!siteMakerKeyOk(request.headers.get("authorization"))) return no("Not allowed.", 403);
  let body: { slug?: unknown; template?: unknown; data?: unknown };
  try {
    body = await request.json();
  } catch {
    return no("Invalid JSON.", 400);
  }
  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!SLUG_RE.test(slug)) return no("Invalid slug.", 400);
  if (taken(slug)) return no("That address is taken.", 409);
  const template = body.template;
  if (!isTemplate(template)) return no("Invalid template.", 400);
  const data = body.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== "object" || data.slug !== slug) return no("Invalid data: its slug must match.", 400);
  if (JSON.stringify(data).length > 400_000) return no("Invalid data: too large.", 413);
  // Rendered once before storing, so a site with a gap is refused, not shown broken.
  try {
    renderSite(template, data);
  } catch (e) {
    return no(`Invalid data: ${(e as Error).message}`, 400);
  }
  const now = new Date().toISOString();
  const before = await getSite(slug);
  const site: StoredSite = { slug, template, data, createdAt: before?.createdAt ?? now, updatedAt: now };
  await putSite(site);
  return NextResponse.json({ url: new URL(`/${slug}`, request.url).toString() });
}

export async function GET(request: Request) {
  if (!siteMakerKeyOk(request.headers.get("authorization"))) return no("Not allowed.", 403);
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const site = await getSite(slug);
  if (!site) return no("Not found.", 404);
  // Page loads grouped into visits, for "has the prospect opened it?".
  const visits = new Map<string, { at: string; where?: string; device?: string }>();
  for (const e of await getEngagement(slug)) {
    if (e.event !== "view") continue;
    visits.set(e.visit ?? e.at, { at: e.at, where: e.where, device: e.device });
  }
  return NextResponse.json(
    { site: { slug, createdAt: site.createdAt, updatedAt: site.updatedAt }, visits: [...visits.values()] },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(request: Request) {
  if (!siteMakerKeyOk(request.headers.get("authorization"))) return no("Not allowed.", 403);
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!SLUG_RE.test(slug)) return no("Invalid slug.", 400);
  await deleteSite(slug);
  return NextResponse.json({ ok: true });
}
