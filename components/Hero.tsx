import { IconCircleCheckFilled, IconPhoneCall } from "@tabler/icons-react";
import { business } from "@/lib/business";
import { defaultLinks, type SiteConfig, type SiteLinks } from "@/lib/site-config";

const defaultTrustItems = ["Fully Insured", "Free Estimates", "Cleanup Included"];

/**
 * Keeps white text readable on top of a photograph without darkening the
 * photograph. Two shadows: a tight one for the edge of each letter, a wide
 * soft one to hold the whole line away from a busy background.
 */
const OVER_PHOTO = "[text-shadow:0_1px_2px_rgba(8,24,12,0.55),0_2px_18px_rgba(8,24,12,0.65)]";

export function Hero({
  config = business,
  links = defaultLinks,
  slug,
  lockHref = ""
}: {
  config?: SiteConfig;
  links?: SiteLinks;
  slug?: string;
  /** Passed down to the assistant, for the pitch it makes once it stops answering. */
  lockHref?: string;
}) {
  const trustItems = config.heroTrustItems ?? defaultTrustItems;
  const headline = config.heroHeadline ?? `${config.city} tree removal and trimming, done right and cleaned up.`;
  const subline =
    config.heroSubline ??
    "Removal, pruning, trimming, and stump grinding handled by a local crew that cleans up when the work is done.";
  const summary = config.reviewSummary;
  const badgeText = config.heroBadgeText ?? (summary ? `${summary.rating}/5 from ${summary.count} ${summary.source}` : null);

  /*
    The generated hero is portrait, shaped for a phone held upright, and it is
    the right picture there. Stretched across a laptop it becomes a crop of a
    crop: a chest and a bit of sky. So a wide screen gets a landscape photo
    instead, preferring a real one off their Google listing, then the generated
    16:9 about shot, and only falling back to the portrait if there is nothing
    else. Nothing here touches how the images are generated.
  */
  const wideHero = config.heroImageWide || config.gallery?.[0] || config.aboutImage || config.heroImage;

  return (
    <section className="relative overflow-hidden bg-forest-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${config.heroImage})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${wideHero})` }}
        aria-hidden="true"
      />
      {/*
        A wash dark enough to read white text over, and no darker. It used to
        reach 80% at the foot of the phone layout, which turned a generated
        photograph of their own crew into a green silhouette — the one image
        on the page worth looking at, dimmed to make room for text that
        carries its own shadow anyway. The text shadow below does that work
        locally, so the wash can stay light and the photograph can be seen.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,49,25,0.06)_0%,rgba(18,49,25,0.24)_38%,rgba(18,49,25,0.4)_70%,rgba(18,49,25,0.52)_100%)] lg:bg-[linear-gradient(90deg,rgba(18,49,25,0.6)_0%,rgba(18,49,25,0.4)_38%,rgba(18,49,25,0.16)_66%,rgba(18,49,25,0.06)_100%)]" />

      <div className="relative mx-auto max-w-7xl flex min-h-[92vh] flex-col justify-center px-5 pb-20 pt-16 sm:min-h-0 sm:px-12 sm:py-20 lg:px-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          {badgeText && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-forest-900/70 px-3.5 py-2 text-[13px] font-semibold text-white">
              <span className="text-ember-400" aria-hidden="true">★</span>
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className={`mx-auto max-w-2xl text-[30px] font-extrabold leading-[1.12] sm:text-5xl lg:text-[52px] ${OVER_PHOTO}`}>
            {headline}
          </h1>

          <p className={`mx-auto mt-3 max-w-lg text-base font-medium leading-6 lg:mx-0 text-white sm:text-lg ${OVER_PHOTO}`}>{subline}</p>

          <div className={`mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[14px] font-semibold text-white lg:justify-start ${OVER_PHOTO}`}>
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <IconCircleCheckFilled size={16} className="text-ember-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <a
              href={links.quote}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-base font-bold text-white shadow-lg shadow-ember-600/25 transition hover:bg-ember-600"
            >
              Get My Free Estimate →
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="call-ring inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest-700 px-5 text-base font-bold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900"
              >
                <IconPhoneCall size={18} stroke={2.2} aria-hidden="true" />
                Call {config.phone}
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
