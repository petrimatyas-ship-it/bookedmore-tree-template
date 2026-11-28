import { SLUG_RE } from "@/lib/db";
import { aboutUsPage } from "@/lib/offer";

/** Who we are, linked from "by MoreBookedNow" in every preview's banner (lib/offer.ts). ?site=<slug> links back. */
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const site = new URL(request.url).searchParams.get("site") ?? "";
  return new Response(aboutUsPage(SLUG_RE.test(site) ? site : null), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}
