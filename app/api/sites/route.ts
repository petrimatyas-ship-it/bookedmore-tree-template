import { NextResponse } from "next/server";
import { readdirSync } from "fs";
import path from "path";
import { deleteSite, getEngagement, getSite, putSite, SLUG_RE, type StoredSite } from "@/lib/db";
import { isTemplate, renderSite } from "@/lib/detailing-page";
import { sitePaths } from "@/scripts/site-pages.mjs";
import { siteMakerKeyOk } from "@/lib/site-maker-key";

/**
 * Sites the Replymint site maker builds (loopfinity, lib/site-maker.ts).
 *
 *   POST   { slug, template, data } -> { url }   stores or replaces it;
 *          template is "detailing", "pressure-washing", "landscaping", "contractor" or "cleaning" (lib/detailing-page.ts)
 *   GET    ?slug=                               -> { site, visits } (each visit: when, where, device, and
 *                                                  how far it scrolled, how long it stayed, what it tapped)
 *   GET    ?slug=&data=1                        -> the same, with the stored template and data
 *                                                  (a finished site to copy from)
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
  // Every page rendered once before storing, so a site with a gap is refused, not shown broken.
  for (const path of sitePaths(data)) {
    try {
      if (renderSite(template, data, path) === null) return no(`Invalid data: no page at /${path}.`, 400);
    } catch (e) {
      return no(`Invalid data${path ? ` (/${path})` : ""}: ${(e as Error).message}`, 400);
    }
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
  // Page loads grouped into visits, for "has the prospect opened it?", and what
  // each one did: how far down they scrolled, how long they stayed, what they tapped.
  type Visit = { at: string; where?: string; device?: string; page?: string; scrolled?: number; seconds?: number; actions?: string[]; chat?: boolean };
  const visits = new Map<string, Visit>();
  const events = await getEngagement(slug);
  for (const e of events) {
    if (e.event !== "view") continue;
    visits.set(e.visit ?? e.at, { at: e.at, where: e.where, device: e.device, page: e.page });
  }
  for (const e of events) {
    const v = e.visit ? visits.get(e.visit) : undefined;
    if (!v) continue;
    if (e.event === "scroll" && typeof e.value === "number") v.scrolled = Math.max(v.scrolled ?? 0, e.value);
    else if (e.event === "dwell" && typeof e.value === "number") v.seconds = Math.max(v.seconds ?? 0, e.value);
    else if (e.event === "assistant") v.chat = true;
    else if (e.event.startsWith("cta:")) {
      const action = e.event.slice(4);
      if (!(v.actions ??= []).includes(action)) v.actions.push(action);
    }
  }
  return NextResponse.json(
    {
      site: {
        slug,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
        ...(new URL(request.url).searchParams.get("data") === "1" ? { template: site.template ?? "detailing", data: site.data } : {}),
      },
      visits: [...visits.values()],
    },
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
