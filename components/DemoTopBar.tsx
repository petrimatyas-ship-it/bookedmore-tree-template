"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react";
import { demoCopy, marketingUrl } from "@/lib/demo-copy";

/** Kept in step with the bar's real height, so the header can sit under it. */
const BAR_H = 46;
const VAR = "--demo-bar-h";

/**
 * The one bar addressed to the owner rather than to their customers.
 *
 * It replaces two things that used to fight for the same attention: a banner
 * that scrolled away after a second and a floating note parked over the page.
 * This behaves the way a phone expects — gone while you read down, back the
 * moment you reach for it — so the owner's own site gets the screen, and the
 * two things they might actually want are never more than a flick away.
 *
 * The header is `sticky top-[var(--demo-bar-h)]`, so hiding the bar sets that
 * variable to zero and the header takes the top back rather than leaving a gap.
 */
export function DemoTopBar({ href }: { href: string }) {
  const [shown, setShown] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function read() {
      const y = window.scrollY;
      const last = lastY.current;
      /* Near the top it is always up: that is where they start and where a
         "back to the top" flick lands. Past that, direction decides. */
      if (y <= 8) setShown(true);
      else if (y > last + 4 && y > 80) setShown(false);
      else if (y < last - 4) setShown(true);
      lastY.current = y;
      ticking.current = false;
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(read);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(VAR, shown ? `${BAR_H}px` : "0px");
    return () => {
      document.documentElement.style.removeProperty(VAR);
    };
  }, [shown]);

  const t = demoCopy.topBar;

  return (
    <>
      {/* Holds the bar's place in the flow, so nothing starts underneath it. */}
      <div style={{ height: BAR_H }} aria-hidden="true" />
      <div
        className={`fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-forest-900 text-white transition-transform duration-200 ease-out ${
          shown ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: BAR_H }}
      >
        {/*
          Three columns, so the pair of buttons is centred on the bar itself
          rather than pushed around by however long the label is. Both are the
          same width on a laptop: they are the two things the owner might do,
          and one of them looking like the small one made the choice for them.
        */}
        <div className="mx-auto grid h-full max-w-[1320px] grid-cols-[1fr_auto] items-center gap-2 px-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-5 lg:px-10">
          <p className="hidden min-w-0 truncate text-[13px] text-white/70 sm:block">{t.label}</p>
          <div className="flex items-center justify-center gap-2 sm:gap-5">
            <a
              href={href}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-ember-500 px-4 text-[13px] font-bold text-white transition hover:bg-ember-600 sm:h-9 sm:min-w-[248px] sm:text-sm"
            >
              {t.cta}
              <IconArrowRight size={15} stroke={2.4} />
            </a>
            {/* Our own blue, but a lighter one: the deep shade sat on the dark
               green like a hole punched in the bar. */}
            <a
              href={marketingUrl}
              aria-label={t.backLabel}
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-mbn-blue-300/70 bg-mbn-blue-300/10 px-3.5 text-[12.5px] font-semibold text-mbn-blue-200 transition hover:border-mbn-blue-200 hover:bg-mbn-blue-300/20 hover:text-white sm:h-9 sm:min-w-[248px] sm:text-sm"
            >
              <IconExternalLink size={15} stroke={2.2} />
              {t.back}
            </a>
          </div>
          <span className="hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
