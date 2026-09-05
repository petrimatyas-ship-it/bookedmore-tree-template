import type { Metadata } from "next";
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
