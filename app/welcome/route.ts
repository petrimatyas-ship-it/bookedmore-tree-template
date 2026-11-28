import { welcomePage } from "@/lib/offer";

/** Stripe's success page after "Start now" (lib/offer.ts): three questions that start the work. */
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(welcomePage(), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}
