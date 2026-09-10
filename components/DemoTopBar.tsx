"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react";
import { demoCopy, marketingUrl } from "@/lib/demo-copy";

/** Kept in step with the bar's real height, so the header can sit under it. */
const BAR_H = 48;
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
        <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
          <p className="hidden min-w-0 flex-1 truncate text-[13px] text-white/70 sm:block">{t.label}</p>
          <a
            href={href}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-ember-500 px-4 text-[13.5px] font-bold text-white transition hover:bg-ember-600 sm:flex-none sm:text-sm"
          >
            {t.cta}
            <IconArrowRight size={16} stroke={2.4} />
          </a>
          <a
            href={marketingUrl}
            aria-label={t.backLabel}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-mbn-blue px-3.5 text-[13px] font-semibold text-white transition hover:bg-mbn-blue-600 sm:text-sm"
          >
            <IconExternalLink size={15} stroke={2.2} />
            {t.back}
          </a>
        </div>
      </div>
    </>
  );
}
