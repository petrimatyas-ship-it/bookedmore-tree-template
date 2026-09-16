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
 * The page has one appearance, and it has to say so in a way browsers obey.
 *
 * Android Chrome darkens web pages, photos included, and a prospect opening
 * their demo from the email got a near-black page with a near-black hero —
 * the opposite of the first impression the demo exists to make. The first
 * attempt at this said `only light`, the documented opt-out. That stops the
 * *automatic* darkening, but a reader who switched "dark theme for sites"
 * on by hand overrides it, and this one had.
 *
 * So the page declares that it supports dark instead. A browser that sees
 * dark support stops filtering and hands the page
 * `prefers-color-scheme: dark`, which globals.css answers with the same
 * light palette. Claiming beats asking. Set here so it lands before the
 * stylesheet, and again on :root for engines that read CSS and not meta.
 *
 * `themeColor` is the dark green of the bar at the top of the page, so the
 * browser's own chrome continues it instead of picking black.
 */
export const viewport: Viewport = {
  colorScheme: "light dark",
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
