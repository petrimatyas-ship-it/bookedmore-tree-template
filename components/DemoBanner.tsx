"use client";

import { useEffect, useRef } from "react";
import { demoCopy } from "@/lib/demo-copy";

const STORAGE_KEY = "mbn-demo-banner-dismissed";

/**
 * Dismissal is applied straight to the node rather than held in React state:
 * the banner must render identically on the server for every visitor, and
 * only the browser knows whether this one has already hidden it.
 */
export function DemoBanner({ href }: { href: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") hide(ref.current);
    } catch {
      /* private mode: leave the banner up */
    }
  }, []);

  function dismiss() {
    hide(ref.current);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* nothing to persist to */
    }
  }

  return (
    <div ref={ref} className="bg-forest-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-5 lg:px-8">
        <p className="min-w-0 flex-1 text-[13px] leading-5 text-white/85 sm:text-sm">{demoCopy.banner.text}</p>
        <a
          href={href}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a00] px-4 text-xs font-bold text-white transition hover:bg-[#e86d00] sm:text-sm"
        >
          {demoCopy.banner.cta} <span aria-hidden="true">&nbsp;→</span>
        </a>
        <button
          type="button"
          aria-label={demoCopy.banner.dismiss}
          onClick={dismiss}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function hide(el: HTMLElement | null) {
  if (el) el.style.display = "none";
}
