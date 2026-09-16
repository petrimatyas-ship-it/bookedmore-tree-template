"use client";

import { useEffect, useState } from "react";
import { IconArrowUpRight, IconMenu2, IconPhone, IconX } from "@tabler/icons-react";
import { initials, type SiteConfig } from "@/lib/site-config";

/** The one-page design's anchors. Every section below the fold is one flick away. */
export const MODERN_NAV = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Areas", href: "#areas" },
  { label: "FAQ", href: "#faq" }
] as const;

/**
 * A glass bar over the page rather than a solid band on top of it.
 *
 * The first design gives the header a dark block of its own. This one lets
 * the canvas run underneath and blurs it, so the bar reads as part of the
 * page instead of a frame around it. It sits under the demo bar via the
 * same CSS variable, so the two never overlap.
 *
 * On a phone the menu is a full sheet with the links set large: a tap
 * target you cannot miss, and the two things worth doing — call, get a
 * quote — pinned at the foot of it.
 */
export function ModernNav({ config, homeHref }: { config: SiteConfig; homeHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const mark = config.logoImage ? (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-ink/10 sm:h-11 sm:w-11">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={config.logoImage} alt="" className="h-full w-full object-contain p-1" referrerPolicy="no-referrer" />
    </span>
  ) : (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-sm font-bold text-bone sm:h-11 sm:w-11">
      {initials(config.companyName)}
    </span>
  );

  return (
    <header className="sticky top-[var(--demo-bar-h,0px)] z-50 border-b border-ink/10 bg-bone/85 backdrop-blur-md transition-[top] duration-200 ease-out">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 sm:h-[72px] sm:px-8 lg:px-10">
        <a href={homeHref} className="flex min-w-0 items-center gap-3" aria-label={`${config.companyName} home`}>
          {mark}
          <span className="truncate font-display text-[17px] font-bold tracking-[-0.02em] text-ink sm:text-lg">
            {config.companyName}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {MODERN_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[14.5px] font-semibold text-ink/70 transition hover:bg-ink/[0.06] hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="hidden h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-[14.5px] font-bold text-ink transition hover:border-ink/40 md:inline-flex"
            >
              <IconPhone size={17} stroke={2.2} aria-hidden="true" />
              {config.phone}
            </a>
          )}
          <a
            href="#quote"
            className="hidden h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14.5px] font-bold text-bone transition hover:bg-ink-2 sm:inline-flex"
          >
            Free estimate
            <IconArrowUpRight size={17} stroke={2.4} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-ink/[0.06] lg:hidden"
          >
            <IconMenu2 size={22} stroke={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-bone lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between px-5 sm:h-[72px] sm:px-8">
            <span className="flex items-center gap-3">
              {mark}
              <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">{config.companyName}</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bone"
            >
              <IconX size={22} stroke={2.2} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-6" aria-label="Sections">
            {MODERN_NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-ink/10 py-4 font-display text-[34px] font-semibold tracking-[-0.03em] text-ink"
              >
                <span className="font-body text-xs font-bold tabular-nums text-ink/35">0{i + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
            <a
              href="#quote"
              onClick={() => setOpen(false)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-signal text-base font-bold text-ink"
            >
              Get a free estimate
              <IconArrowUpRight size={19} stroke={2.4} aria-hidden="true" />
            </a>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-ink/15 text-base font-bold text-ink"
              >
                <IconPhone size={19} stroke={2.2} aria-hidden="true" />
                Call {config.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
