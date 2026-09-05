import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";

/**
 * LocalBusiness structured data for the real site.
 *
 * Deliberately not rendered on demo pages: those are noindex drafts, and a
 * rating or address we have not verified must never be published as schema.
 */
export function LocalBusinessSchema({ config = business }: { config?: SiteConfig }) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.companyName,
    description: config.description,
    ...(config.phone ? { telephone: config.phone } : {}),
    ...(config.email ? { email: config.email } : {}),
    image: config.heroImage,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: config.city,
      addressRegion: config.stateAbbr,
      addressCountry: "US"
    },
    areaServed: config.serviceAreas.map((name) => ({ "@type": "Place", name })),
    openingHours: "Mo-Sa 07:00-19:00"
  };

  if (config.reviewSummary) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: config.reviewSummary.rating,
      reviewCount: config.reviewSummary.count.replace(/\D/g, "") || undefined
    };
  }

  if (config.services?.length) {
    jsonLd.makesOffer = config.services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.description }
    }));
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
