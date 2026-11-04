import { getSite } from "@/lib/db";
import { isTemplate, renderSite } from "@/lib/detailing-page";

/**
 * demo.morebookednow.com/<slug>/<page> for a full stored site (`pages: true`,
 * scripts/site-pages.mjs): its about, services, service, gallery, reviews,
 * service areas, FAQ and contact pages. Anything else is not found.
 */

export const dynamic = "force-dynamic";

const notFound = () =>
  new Response("<!doctype html><title>Not found</title><p>This page isn't here.</p>", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; rest: string[] }> }) {
  const { slug, rest } = await params;
  const site = await getSite(slug);
  if (!site || !Array.isArray(rest) || rest.length > 2) return notFound();
  const html = renderSite(isTemplate(site.template) ? site.template : "detailing", site.data, rest.join("/"));
  if (html === null) return notFound();
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}
