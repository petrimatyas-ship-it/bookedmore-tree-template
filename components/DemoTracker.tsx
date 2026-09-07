"use client";

import { useEffect, useRef } from "react";

/**
 * Records what the business owner actually does with their draft.
 *
 * Without this, a demo goes out and you hear nothing back: every lead looks
 * identical in the inbox whether they read the whole thing twice or never
 * opened it. Knowing who scrolled to the bottom, who tried the assistant and
 * who clicked through to the offer turns follow-up from a guess into a
 * prioritised list.
 *
 * Only the shape of the visit is recorded — page, scroll depth, which
 * buttons — never anything typed. The chat itself is not read.
 */

type Event = { slug: string; event: string; page: string; value?: number };

const SCROLL_MARKS = [25, 50, 75, 100] as const;

export function DemoTracker({ slug }: { slug: string }) {
  const sent = useRef(new Set<string>());

  useEffect(() => {
    const page = window.location.pathname;

    /** Each event once per page load; beacons survive the tab closing. */
    const send = (event: string, value?: number) => {
      const key = `${event}:${value ?? ""}`;
      if (sent.current.has(key)) return;
      sent.current.add(key);
      const body: Event = { slug, event, page, value };
      try {
        const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
        if (!navigator.sendBeacon?.("/api/demo/track", blob)) {
          void fetch("/api/demo/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            keepalive: true
          });
        }
      } catch {
        /* Tracking must never break the page it is measuring. */
      }
    };

    send("view");

    const onScroll = () => {
      const doc = document.documentElement;
      const height = doc.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const pct = Math.round((window.scrollY / height) * 100);
      for (const mark of SCROLL_MARKS) if (pct >= mark) send("scroll", mark);
    };

    // Any click on a CTA marked up for it, plus the assistant's send button.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-demo-cta]");
      if (el) send(`cta:${el.dataset.demoCta}`);
      else if ((e.target as HTMLElement | null)?.closest("form [aria-label='Send message']")) send("assistant");
    };

    // Time on the page, sent once when they leave.
    const opened = Date.now();
    const onHide = () => {
      if (document.visibilityState === "hidden") send("dwell", Math.round((Date.now() - opened) / 1000));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("visibilitychange", onHide);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [slug]);

  return null;
}
