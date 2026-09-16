import { IconArrowUpRight, IconCheck, IconClock, IconPencil } from "@tabler/icons-react";
import type { SiteConfig } from "@/lib/site-config";
import { demoCopy } from "@/lib/demo-copy";
import { daysUntil, ownerRealItems } from "@/components/OwnerClose";

/**
 * The closing pitch, in the second design's clothes.
 *
 * Same argument as the first template's block, same list of what is already
 * real — that logic lives in one place and both designs read it. Only the
 * surface differs: ink, hairlines, the accent on the one button.
 */
export function ModernOwnerClose({
  config,
  href,
  expiresAt
}: {
  config: SiteConfig;
  href: string;
  expiresAt: string;
}) {
  const c = demoCopy.close;
  const real = ownerRealItems(config);
  const daysLeft = daysUntil(expiresAt);

  return (
    <section className="bg-ink px-5 py-16 text-bone sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-signal">{c.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[56px]">
          {c.title}
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-ink-3 lg:grid-cols-2">
          <div className="bg-ink-2 p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone/60">
              <IconCheck size={15} stroke={2.6} className="text-signal" aria-hidden="true" />
              {c.realTitle}
            </h3>
            <ul className="mt-5 grid gap-3.5">
              {real.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-bone/90">
                  <IconCheck size={17} stroke={2.6} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-bone/60">
              <IconPencil size={15} stroke={2.2} className="text-bone/40" aria-hidden="true" />
              {c.draftTitle}
            </h3>
            <ul className="mt-5 grid gap-3.5">
              {c.draft.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-7 text-bone/55">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-bone/30" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-ink-3 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[15px] leading-7 text-bone/70">
              {c.priceLead}{" "}
              <span className="font-display text-3xl font-semibold tracking-[-0.02em] text-bone">{c.price}</span>
            </p>
            <p className="mt-2 text-sm text-bone/50">{c.reassure}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-bone/45">
              <IconClock size={15} stroke={2} aria-hidden="true" />
              {c.expiry(daysLeft)}
            </p>
          </div>
          <a
            href={href}
            data-demo-cta="close"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-[4px] bg-signal px-8 text-base font-bold text-ink transition hover:bg-signal-2"
          >
            {c.cta}
            <IconArrowUpRight size={19} stroke={2.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
