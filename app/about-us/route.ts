import { ABOUT_URL } from "@/lib/offer";

/** Old address of "who we are": now MoreBookedNow's own about page. */
export function GET() {
  return Response.redirect(ABOUT_URL, 308);
}
