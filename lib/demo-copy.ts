/**
 * Every string that only appears on a demo page lives here, so wording can be
 * changed in one file without touching layout code.
 */

export const marketingUrl = (
  process.env.NEXT_PUBLIC_MARKETING_URL || "https://morebookednow.com"
).replace(/\/$/, "");

export const demoCopy = {
  /**
   * The bar over their draft. Two things only, because it is over their site:
   * the way to say yes, and the way back to ours.
   */
  topBar: {
    label: "This is a draft of your site",
    cta: "I want this site",
    back: "morebookednow.com",
    backLabel: "Back to morebookednow.com"
  },

  /**
   * Placed straight after their services, the point at which the owner has
   * just read their own offer written back to them properly. The argument is
   * the gap between the work and how it looks online, not a list of features.
   */
  afterServices: {
    eyebrow: "About this page",
    title: "Everything above was built from what is already public about you.",
    body: "Your Google listing, your reviews, your photos. Nobody sent us a brief and nobody filled in a form. If a stranger can put this together in a few minutes, the version that runs every day and answers at 9pm is not the hard part either.",
    points: [
      "Live in 7 days, or your first month is free",
      "Your own domain, your logo, your photos",
      "The assistant on this page answers around the clock",
      "From $149 a month, no setup fee, cancel any time"
    ],
    cta: "I want this site"
  },

  /** Hero subline angle, chosen by the record's `framing` field. */
  hero: {
    has_site: (city: string) =>
      `Built to turn the people already searching in ${city} into calls and quote requests, instead of losing them to whoever answers first.`,
    no_site: (city: string) =>
      `Right now someone searching for tree work in ${city} cannot find you. This is what they would find instead.`
  },

  reviews: {
    emptyTitle: "Your Google reviews will appear here",
    emptyBody:
      "We did not pull any reviews for this draft. On your real site, your Google reviews load here automatically and update themselves as new ones come in.",
    heading: "What homeowners say."
  },

  projects: {
    eyebrow: "Our Work",
    heading: "Before and after.",
    sub: "Example tree work of the kind you do. Your real site uses photos from your own jobs."
  },

  quote: {
    eyebrow: "Free Estimate",
    heading: "Tell us about the job.",
    sub: "Send a few details and we will follow up with straightforward pricing, no pressure."
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Questions homeowners ask."
  },

  areas: {
    eyebrow: "Service Area",
    heading: (city: string) => `Serving ${city} and the surrounding area.`
  },

  /**
   * Notes from us to the business owner, laid over their own site.
   *
   * Safe to show inline because a demo is only ever seen by one person: the
   * owner it was built for. Private link, noindex, gone in 30 days. Without
   * these they see a nice page; with them they see the machine working.
   */
  notes: {
    reviews:
      "These are your real Google reviews. They load themselves and stay current, so your newest one is always on the page.",
    gallery: "Your own photos, pulled from your listing. The real site uses all of them, not five.",
    assistant:
      "This answers your customers at 9pm while you are on a job, and takes the details of the ones ready to book."
  },

  /**
   * The gate on the pages beyond the home page.
   *
   * The home page stays wide open on purpose. Everything that makes this
   * work is the moment an owner sees their own rating, their own reviews and
   * their own name and thinks "that is actually mine" — blurring that would
   * hide the proof in order to make the pitch. So the proof is free and the
   * depth is what costs: they get the full hit, then hit a wall made of more
   * of the same thing they just saw was real.
   */
  locked: {
    eyebrow: "Part of your full site",
    title: (page: string) => `Your ${page} page is built and waiting.`,
    body: (company: string) =>
      `${company} gets seven pages, not one. This is one of them, written around your services and the areas you work in. Go live and the whole site opens up.`,
    cta: "Unlock my full site",
    secondary: "Back to my home page",
    /** Names used in the title, keyed by the demo route segment. */
    pageNames: {
      services: "services",
      pricing: "pricing",
      reviews: "reviews",
      "service-areas": "service areas",
      about: "about"
    } as Record<string, string>
  },

  /** The blurred tile at the end of the gallery. */
  galleryLock: (more: number) =>
    more > 0
      ? `${more} more of your photos on the real site`
      : "More of your photos on the real site",

  /**
   * The assistant stops after a few replies on a demo. It is the most
   * impressive thing on the page, so it is also the best place to show what
   * having it properly actually means.
   */
  assistantLock: {
    title: "That is your assistant working.",
    body: "On your real site it never stops — every question answered, every night, and the details of anyone ready to book sent straight to your phone.",
    cta: "Get it running on my site"
  },

  /**
   * The last thing on every demo page.
   *
   * Whoever has scrolled this far is the warmest they will ever be, and the
   * page used to hand them a footer written for homeowners. This is the only
   * part of a demo addressed to the owner rather than to their customers.
   */
  close: {
    eyebrow: "Your draft",
    title: "You just scrolled your own website.",
    realTitle: "Already real",
    draftTitle: "Still a draft",
    draft: [
      "The words were written for you, not by you",
      "The crew photos are stand-ins until we have yours",
      "The prices are typical ranges, not your numbers"
    ],
    priceLead: "Everything above, built properly and looked after every month, from",
    price: "$149/mo",
    cta: "Make this my site",
    reassure: "Live in 7 days. Cancel any time. Nothing is charged until it is live.",
    expiry: (days: number) =>
      days <= 1 ? "This draft comes down tomorrow." : `This draft comes down in ${days} days.`
  },

  expired: {
    title: "This demo has expired",
    body: "Draft sites are kept for 30 days. Yours has been taken down, but we still have your details and can put a fresh one up in about a minute.",
    cta: "Request a fresh demo"
  },

  missing: {
    title: "We could not find that demo",
    body: "The link may be mistyped, or the draft may have been taken down. Request a new one and we will build it while you wait.",
    cta: "Build me a demo site"
  }
} as const;

/**
 * Where every "I want this" on a demo goes.
 *
 * /signup, with the demo slug and lead id attached. It used to jump straight
 * to /start, which quietly picked the cheapest plan for them; the owner never
 * saw there was a choice. /signup shows both plans, and its buttons carry
 * the same ids on to /start, so the thread still holds from the draft all
 * the way to the card.
 */
export function wantThisHref(slug: string, leadId?: string) {
  const params = new URLSearchParams({ demo: slug });
  if (leadId) params.set("lead", leadId);
  return `${marketingUrl}/signup?${params.toString()}`;
}

export const demoHref = `${marketingUrl}/demo`;
