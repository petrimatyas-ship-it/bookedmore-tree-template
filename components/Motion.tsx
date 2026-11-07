"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Items rising into place as they scroll into view, one after another.
 *
 * Opted into by markup rather than by wrapping: a list's own container gets
 * `data-stagger` and each of its direct children comes in on its own; a
 * single block gets `data-reveal` and comes in whole. No wrapper elements, so
 * a grid stays a grid and nothing about the layout changes.
 *
 * Each child is watched separately, not its container. A column of six
 * service cards on a phone is three screens tall, and timing them off the
 * container would play the whole sequence while five of them were still
 * below the fold, so they would already be sitting there when the reader
 * arrived. Watched one at a time, every card arrives as it is reached, and
 * the ones that arrive together — a row of three on a laptop — are staggered
 * among themselves.
 *
 * Nothing is hidden until this has run. The stylesheet only hides items once
 * `<html data-motion>` is set, and that is set here, after whatever is
 * already on screen has been marked as shown. So the first paint is the
 * finished page, a reader without JavaScript gets the finished page, and the
 * only things that ever start invisible are below the fold, where nobody can
 * see them blink. The hero is never touched: it is the largest paint on the
 * page, and fading it in would slow the number PageSpeed reports.
 *
 * Reduced motion: none of this runs, and the page is simply there.
 */

const ROOT = "data-motion";
const SEEN = "data-in";
/** The furthest step in a stagger; the time per step lives in globals.css. Seven
    cards arriving at once should not leave the last one waiting a second. */
const MAX_STEP = 6;

function targets(): Element[] {
  const out: Element[] = [];
  document.querySelectorAll("[data-stagger]").forEach((list) => {
    for (const child of Array.from(list.children)) out.push(child);
  });
  document.querySelectorAll("[data-reveal]").forEach((el) => out.push(el));
  return out;
}

function onScreen(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

export function Motion() {
  const pathname = usePathname();
  // The first scan meets server-rendered content that is already painted, so
  // what is on screen stays put. Later scans, after a client-side navigation,
  // meet content that has never been seen, so even what is on screen rises.
  const firstScan = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    const first = firstScan.current;
    firstScan.current = false;

    const rise = (batch: Element[]) => {
      // Top to bottom, then left to right, so a row reads in order.
      batch
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)
        .forEach(({ el }, i) => {
          (el as HTMLElement).style.setProperty("--i", String(Math.min(i, MAX_STEP)));
          el.setAttribute(SEEN, "rise");
        });
    };

    const io = new IntersectionObserver(
      (entries) => {
        const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        arriving.forEach((el) => io.unobserve(el));
        if (arriving.length) rise(arriving);
      },
      // A little before the item is fully in, so it is moving as it appears.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    const watch = (el: Element) => {
      if (el.hasAttribute(SEEN)) return;
      if (first && onScreen(el)) {
        el.setAttribute(SEEN, "shown");
        return;
      }
      io.observe(el);
    };

    targets().forEach(watch);

    /*
      A list can grow after load — a "show more", a client component that
      fills in. A child added to a staggered list would otherwise match the
      hidden rule and never be observed, which is to say it would never
      appear. New children are watched like the rest.
    */
    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (node instanceof Element && (rec.target as Element).hasAttribute?.("data-stagger")) watch(node);
        });
      }
    });
    document.querySelectorAll("[data-stagger]").forEach((list) => mo.observe(list, { childList: true }));

    // Only now may anything be hidden: what is on screen has been marked.
    root.setAttribute(ROOT, "");

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
