import { getSite } from "@/lib/db";
import { renderDetailing } from "@/lib/detailing-page";

/**
 * demo.morebookednow.com/<slug> for a site the Replymint site maker stored
 * (app/api/sites). The app's own pages and the hand-built pages in public/
 * are matched before this, so it only sees addresses nothing else claims.
 */

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) {
    return new Response("<!doctype html><title>Not found</title><p>This page isn't here.</p>", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
  return new Response(renderDetailing(site.data), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}
