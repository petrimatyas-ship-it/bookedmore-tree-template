/**
 * Every string that only appears on a demo page lives here, so wording can be
 * changed in one file without touching layout code.
 */

export const marketingUrl = (
  process.env.NEXT_PUBLIC_MARKETING_URL || "https://morebookednow.com"
).replace(/\/$/, "");

export const demoCopy = {
  banner: {
    text: "This is a quick draft of your site. Your real site gets your photos, reviews and full pages.",
    cta: "I want this",
    dismiss: "Hide this banner"
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
 * Where the banner and the expiry pages send people: the pricing table, with
 * the lead attached so that picking a plan there carries straight into /start
 * and never asks for details this visitor has already given.
 */
export function wantThisHref(slug: string, leadId?: string) {
  const params = new URLSearchParams({ slug });
  if (leadId) params.set("lead", leadId);
  return `${marketingUrl}/pricing?${params.toString()}`;
}

export const demoHref = `${marketingUrl}/demo`;
