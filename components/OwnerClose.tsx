import { IconCheck, IconArrowRight, IconPencil, IconClock } from "@tabler/icons-react";
import type { SiteConfig } from "@/lib/site-config";
import { demoCopy } from "@/lib/demo-copy";

/**
 * The closing pitch on a demo, addressed to the business owner.
 *
 * Everything above this on the page is a website for their customers. This
 * is the one block that talks to them, and it sits at the bottom because
 * someone who has scrolled the whole thing is the warmest they will ever be
 * — that moment used to be spent on a footer meant for homeowners.
 *
 * The "already real" column is built from what enrichment actually found,
 * not from a fixed list. Telling someone their reviews are loaded when they
 * are not is exactly the kind of claim that loses the sale.
 */
export function OwnerClose({
  config,
  href,
  expiresAt
}: {
  config: SiteConfig;
  href: string;
  expiresAt: string;
}) {
  const c = demoCopy.close;

  const real: string[] = [];
  if (config.reviewSummary && (config.reviews?.length ?? 0) > 0) {
    real.push(
      `Your ${config.reviewSummary.rating} rating and ${config.reviewSummary.count} Google reviews, loaded and live`
    );
  }
  if ((config.gallery?.length ?? 0) > 0) real.push(`${config.gallery!.length} of your own job photos`);
  if (config.logoImage) real.push("Your logo");
  if (config.phone) real.push(`Your number, ${config.phone}, on every page and every button`);
  if (config.serviceAreas.length > 1) real.push(`The ${config.serviceAreas.length} areas you actually work in`);
  real.push("An assistant that answers as your business, day and night");

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  );

  return (
    <section className="bg-forest-900 px-8 py-16 text-white sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <span className="inline-flex rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {c.eyebrow}
        </span>
        <h2 className="mt-6 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-[42px]">{c.title}</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[10px] border border-white/12 bg-white/[0.06] p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/70">
              <IconCheck size={16} stroke={2.5} className="text-ember-400" aria-hidden="true" />
              {c.realTitle}
            </h3>
            <ul className="mt-4 grid gap-3">
              {real.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-7 text-white/90">
                  <IconCheck size={17} stroke={2.5} className="mt-1 shrink-0 text-ember-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[10px] border border-white/12 bg-white/[0.03] p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-white/70">
              <IconPencil size={16} stroke={2.2} className="text-white/50" aria-hidden="true" />
              {c.draftTitle}
            </h3>
            <ul className="mt-4 grid gap-3">
              {c.draft.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-7 text-white/62">
                  <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-white/35" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/12 pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[15px] leading-7 text-white/75">
              {c.priceLead} <span className="text-xl font-bold text-white">{c.price}</span>
            </p>
            <p className="mt-1.5 text-sm text-white/55">{c.reassure}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={href}
              data-demo-cta="close"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-ember-500 px-8 text-base font-bold text-white shadow-xl shadow-ember-600/25 transition hover:bg-ember-600"
            >
              {c.cta}
              <IconArrowRight size={19} stroke={2.4} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Honest urgency: the expiry is real, so it may as well be visible. */}
        <p className="mt-6 flex items-center gap-2 text-sm text-white/45">
          <IconClock size={15} stroke={2} aria-hidden="true" />
          {c.expiry(daysLeft)}
        </p>
      </div>
    </section>
  );
}
