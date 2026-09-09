import { IconCircleCheckFilled, IconPhoneCall, IconShieldCheck, IconMapPin } from "@tabler/icons-react";
import { business } from "@/lib/business";
import { GoogleG, GoogleStars } from "@/components/GoogleReview";
import { defaultLinks, type SiteConfig, type SiteLinks } from "@/lib/site-config";

const defaultTrustItems = ["Fully insured", "Free estimates", "Cleanup included"];

/**
 * Cream hero with the photo framed as a card instead of a full-bleed
 * background. The words never fight the picture, and a weak or missing
 * photo costs a card, not the whole first screen.
 */
export function Hero({
  config = business,
  links = defaultLinks
}: {
  config?: SiteConfig;
  links?: SiteLinks;
  slug?: string;
  lockHref?: string;
}) {
  const trustItems = (config.heroTrustItems ?? defaultTrustItems).slice(0, 3);
  const headline = config.heroHeadline ?? `${config.city} tree removal and trimming, done right and cleaned up.`;
  const subline =
    config.heroSubline ??
    "Removal, pruning, trimming and stump grinding by a local crew that leaves the yard cleaner than they found it.";
  const summary = config.reviewSummary;
  const place = [config.city, config.stateAbbr].filter(Boolean).join(", ");

  return (
    <section className="relative overflow-hidden bg-night text-forest-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-8 sm:px-10 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-16 lg:py-20">
        <div className="text-center lg:text-left">
          {summary && (
            <div className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white px-3 py-1.5 text-[13px] font-semibold text-forest-900 shadow-[0_6px_20px_rgba(18,49,25,0.08)]">
              <GoogleG size={14} />
              <GoogleStars rating={Number(summary.rating) || 5} size={13} />
              <span>
                {summary.rating} · {summary.count} reviews
              </span>
            </div>
          )}

          <h1 className="mx-auto mt-5 max-w-[22ch] text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:mx-0 lg:text-[56px]">
            {headline}
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-7 text-forest-900/70 sm:text-lg lg:mx-0">{subline}</p>

          <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={links.quote}
              className="estimate-glow inline-flex h-13 items-center justify-center whitespace-nowrap rounded-2xl bg-ember-500 px-7 text-[16px] font-bold text-white shadow-lg shadow-ember-600/25 transition hover:bg-ember-600"
            >
              Get My Free Estimate →
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-2 border-forest-900/15 bg-white px-6 text-[16px] font-bold text-forest-900 transition hover:border-forest-700 hover:bg-forest-50"
              >
                <IconPhoneCall size={18} stroke={2.2} aria-hidden="true" />
                Call {config.phone}
              </a>
            )}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px] font-semibold text-forest-900/80 lg:justify-start">
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <IconCircleCheckFilled size={16} className="text-forest-600" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="aspect-[4/3] w-full rounded-[28px] bg-forest-900/10 bg-cover bg-center shadow-[0_30px_70px_rgba(18,49,25,0.22)] lg:aspect-[5/4]"
            style={{ backgroundImage: `url(${config.heroImage})` }}
            role="img"
            aria-label={`${config.companyName} crew at work in ${config.city}`}
          />
          <div className="absolute -bottom-3 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-forest-900 shadow-[0_10px_30px_rgba(18,49,25,0.18)]">
            <IconShieldCheck size={17} className="text-forest-600" aria-hidden="true" />
            Licensed &amp; insured
          </div>
          <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-forest-900/80 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur">
            <IconMapPin size={14} aria-hidden="true" />
            Serving {place}
          </div>
        </div>
      </div>
    </section>
  );
}
