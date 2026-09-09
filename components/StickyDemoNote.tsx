"use client";

import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { demoCopy } from "@/lib/demo-copy";

/**
 * The one thing on the page addressed to the owner rather than their
 * customers, kept in reach the whole way down.
 *
 * The banner at the top scrolls away, and the owner-facing close sits at the
 * very bottom, so between them there was a long stretch of their own site
 * with nothing to act on. This sits above the page, stays put, and is
 * dismissible: a note they cannot get rid of would be the worst version of
 * this idea. The choice is remembered for the session so it stays gone.
 */
const DISMISSED_KEY = "mbn-sticky-note-dismissed";

export function StickyDemoNote({ href }: { href: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* A blocked storage should not keep the note on screen. */
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-[360px] lg:px-0">
      <div className="flex items-center gap-3 rounded-[12px] border border-ember-500/40 bg-forest-900 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold leading-snug text-white/70">{demoCopy.stickyNote.label}</p>
          <a
            href={href}
            className="mt-2 flex h-11 items-center justify-center rounded-[10px] bg-ember-500 px-4 text-[15px] font-bold text-white transition hover:bg-ember-600"
          >
            {demoCopy.stickyNote.cta}
          </a>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={demoCopy.stickyNote.dismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <IconX size={17} stroke={2.2} />
        </button>
      </div>
    </div>
  );
}
