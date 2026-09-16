import type { Metadata, Viewport } from "next";
import "./globals.css";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: `${business.companyName} | Tree Service in ${business.city}, ${business.stateAbbr}`,
  description: business.description,
  keywords: [
    `tree service ${business.city}`,
    `tree removal ${business.city}`,
    `tree trimming ${business.city}`,
    `stump grinding ${business.city}`,
    `emergency tree service ${business.city}`,
    ...business.serviceAreas.map((a) => `tree service ${a}`)
  ]
};

/**
 * The page is light on purpose, and it has to say so.
 *
 * Chrome and Samsung Internet on Android auto-darken any site that has not
 * declared a colour scheme, and they darken the photos with it. A prospect
 * opening their demo from the email on a phone got a near-black page with a
 * near-black hero, which is the opposite of the first impression the demo
 * exists to make. `only light` is the documented opt-out; it is set here in
 * the head so it lands before the stylesheet, and again on :root in
 * globals.css for engines that read the CSS and not the meta tag.
 *
 * `themeColor` is the dark green of the bar at the top of the page, so the
 * browser's own chrome continues it instead of picking black.
 */
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#123119"
};

/**
 * Deliberately bare. Anything business-specific (structured data, the mobile
 * call bar) is rendered per page from that page's config, so a demo at
 * /demo/[slug] never inherits this site's identity.
 */
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
