/**
 * The shape every page in this template renders from.
 *
 * `lib/business.ts` is one instance of it (the showcase site). A demo record
 * in the database is another. Components take a `SiteConfig` so the same
 * markup serves both — nothing below is specific to Oakline.
 *
 * Fields required here are the ones a page cannot render without. Everything
 * a generated demo may legitimately not know (reviews, ratings, credentials,
 * pricing) is optional, so we never have to invent it to satisfy a type.
 *
 * Arrays are `readonly` so the `as const` config in business.ts satisfies this.
 */

export type ServiceCard = {
  title: string;
  price: string;
  description: string;
  image: string;
  signs: readonly string[];
  included: readonly string[];
};

export type Service = { title: string; description: string };

export type Project = {
  title: string;
  location?: string;
  image: string;
  beforeImage: string;
  afterImage: string;
  before: string;
  after: string;
};

export type Review = {
  name: string;
  area?: string;
  service?: string;
  date?: string;
  text: string;
  rating: number;
};

export type ReviewSummary = { rating: string; count: string; source: string };

export type ProcessStep = { title: string; text: string };

export type TrustBadge = { label: string; icon: string };

export type Faq = { question: string; answer: string };

export type SiteConfig = {
  /* Identity */
  companyName: string;
  tagline: string;
  description: string;
  city: string;
  stateAbbr: string;
  phone: string;
  email: string;
  logoText: string;
  /** Optional: demos have no logo, the header falls back to initials. */
  logoImage?: string;
  heroImage: string;
  aboutImage: string;

  /* Hero */
  heroHeadline?: string;
  heroSubline?: string;
  heroTrustItems?: readonly string[];
  /** Overrides the badge above the headline. Without it, the review summary is used. */
  heroBadgeText?: string;

  /* About */
  aboutTitle?: string;
  aboutParagraphs?: readonly string[];
  aboutTrustPoints: readonly string[];
  aboutFactStrip?: readonly string[];

  /* Sections */
  trustBadges?: readonly TrustBadge[];
  serviceCards: readonly ServiceCard[];
  services?: readonly Service[];
  projects?: readonly Project[];
  /** Only ever real, pulled reviews. Empty means: show the placeholder. */
  reviews?: readonly Review[];
  /** Null when we have no verified rating to show. */
  reviewSummary?: ReviewSummary | null;
  process?: readonly ProcessStep[];
  serviceAreas: readonly string[];
  responseNote?: string;
  faqs?: readonly Faq[];

  /* Used by the showcase site's sub-pages only. Demos leave these out. */
  primaryColor?: string;
  ctaColor?: string;
  founded?: string;
  story?: readonly string[];
  credentials?: readonly { title: string; text: string }[];
  stats?: readonly { value: string; label: string }[];
  priceGuide?: readonly {
    service: string;
    note: string;
    rows: readonly { size: string; range: string }[];
  }[];
  savingsTips?: readonly { title: string; text: string }[];
  pricingFaqs?: readonly Faq[];
  exampleJobs?: readonly {
    title: string;
    location: string;
    image: string;
    price: string;
    detail: string;
  }[];
  areaDetails?: readonly {
    name: string;
    zips: readonly string[];
    note: string;
    popular: readonly string[];
  }[];
};

/**
 * Where the shared components point their links.
 *
 * A demo is a full copy of the showcase site living under /demo/<slug>, so
 * the two link sets have identical shape — only the prefix differs. A demo
 * must never link a prospect to the showcase site's own pages.
 */
export type SiteLinks = {
  home: string;
  quote: string;
  services: string;
  nav: readonly { label: string; href: string }[];
};

export const defaultLinks: SiteLinks = {
  home: "/",
  quote: "/quote",
  services: "/services",
  nav: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Reviews", href: "/reviews" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "About", href: "/about" }
  ]
};

/** The same nav as `defaultLinks`, rooted at this demo's slug. */
export function demoLinks(slug: string): SiteLinks {
  const base = `/demo/${slug}`;
  return {
    home: base,
    quote: `${base}/quote`,
    services: `${base}/services`,
    nav: defaultLinks.nav.map((item) => ({ label: item.label, href: `${base}${item.href}` }))
  };
}

/** Initials for the header mark when a demo has no logo image. */
export function initials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");
}
