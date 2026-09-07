import { IconCircleCheckFilled, IconPhoneCall } from "@tabler/icons-react";
import { business } from "@/lib/business";
import { HeroPanel } from "@/components/HeroPanel";
import { defaultLinks, type SiteConfig, type SiteLinks } from "@/lib/site-config";

const defaultTrustItems = ["Fully Insured", "Free Estimates", "Cleanup Included"];

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
  const headline = config.heroHeadline ?? `${config.city} tree care without the mess or runaround.`;
  const subline =
    config.heroSubline ??
    "Removal, pruning, trimming, and stump grinding handled by a local crew that cleans up when the work is done.";
  const summary = config.reviewSummary;
  const badgeText = config.heroBadgeText ?? (summary ? `${summary.rating}/5 from ${summary.count} ${summary.source}` : null);

  return (
    <section className="relative overflow-hidden bg-forest-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.heroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,49,25,0.72)_0%,rgba(18,49,25,0.55)_38%,rgba(18,49,25,0.3)_66%,rgba(18,49,25,0.18)_100%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-8 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:px-20 lg:py-16">
        <div className="max-w-xl [text-shadow:0_2px_18px_rgba(18,49,25,0.5)]">
          {badgeText && (
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/24 bg-white/18 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-forest-900/16 backdrop-blur-md">
              <span className="text-ember-400" aria-hidden="true">*</span>
              <span>{badgeText}</span>
            </div>
          )}

          <h1 className="max-w-xl text-3xl font-extrabold leading-[1.16] tracking-normal sm:text-4xl lg:text-[42px]">
            {headline}
          </h1>

          <p className="mt-4 max-w-lg text-base font-medium leading-7 text-white/88 sm:text-lg">{subline}</p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <IconCircleCheckFilled size={16} className="text-ember-400" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={links.quote}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#ff7a00] px-6 text-base font-bold text-white shadow-lg shadow-[#ff7a00]/25 transition hover:bg-[#e86d00]"
            >
              Get My Free Estimate →
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="call-ring inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest-700 px-5 text-base font-bold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900"
              >
                <IconPhoneCall size={18} stroke={2.2} aria-hidden="true" />
                {config.phone}
              </a>
            )}
          </div>
        </div>

        <div className="h-[440px] w-full max-w-sm justify-self-center lg:h-[480px] lg:justify-self-end">
          <HeroPanel config={config} slug={slug} lockHref={lockHref} />
        </div>
      </div>
    </section>
  );
}
