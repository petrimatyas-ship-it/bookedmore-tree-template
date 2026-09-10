"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPhoneCall, IconX } from "@tabler/icons-react";
import { HeroPanel, type PanelTab } from "@/components/HeroPanel";
import { business } from "@/lib/business";
import { defaultLinks, initials, type SiteConfig, type SiteLinks } from "@/lib/site-config";

/** Fired by anything on the page that wants the chat/quote sheet open on phone. */
export const OPEN_PANEL_EVENT = "mbn:open-panel";

export function Header({
  config = business,
  links = defaultLinks,
  slug,
  lockHref = ""
}: {
  config?: SiteConfig;
  links?: SiteLinks;
  slug?: string;
  lockHref?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<PanelTab | null>(null);
  const pathname = usePathname();

  /* The chat and quote form live in a sheet on phone, opened from the menu
     or from a button lower on the page. */
  useEffect(() => {
    const onOpen = (e: Event) => {
      setPanel(((e as CustomEvent).detail as PanelTab) || "chat");
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener(OPEN_PANEL_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_PANEL_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const openPanel = (tab: PanelTab) => {
    setPanel(tab);
    setMenuOpen(false);
  };

  /* Hash links belong to the one-page demo, where nothing is "the current page". */
  const isCurrent = (href: string) =>
    href.startsWith("/") && href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-[var(--demo-bar-h,0px)] z-50 border-b border-white/10 bg-forest-900 text-white shadow-sm transition-[top] duration-200 ease-out">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-6 sm:px-5 sm:py-4 lg:px-8">
        {/*
          `min-w-0` and no `min-w-fit`: with the latter, a long name like
          "Dallas Tree Trimming and Removal Service" sets the link's minimum
          width to its full one-line length, shoving the nav and the CTA off
          the right edge and giving the whole page a horizontal scrollbar.
          Allowed to shrink, the name wraps instead.
        */}
        <Link
          href={links.home}
          className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
          aria-label={`${config.companyName} home`}
          onClick={() => setMenuOpen(false)}
        >
          {/*
            A pulled logo gets no frame. Boxing someone's logo in a bordered
            white circle makes it read as a sticker pasted onto the page;
            standing free at a decent size it reads as their brand. The
            circle stays for the initials mark, which needs the shape.
            object-contain because wordmarks are wide and cover would crop
            "Texas Tree Surgeons" down to "eSurge".
          */}
          {config.logoImage ? (
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-white p-1 sm:h-14 sm:w-14 sm:p-1.5">
              <Image
                src={config.logoImage}
                alt={`${config.companyName} logo`}
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </span>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm sm:h-12 sm:w-12">
              <span className="text-sm font-bold text-forest-900 sm:text-base" aria-hidden="true">
                {initials(config.companyName)}
              </span>
            </span>
          )}
          {/*
            Wraps to a second line rather than truncating. A cut-off business
            name ("Ridgeline Tree &...") is the worst thing to show someone on
            their own site, and long names are common in this trade — the
            capped width is what forces the wrap, and a genuinely long name
            also steps down a size so two lines still fit the bar.
          */}
          <span
            className={`truncate font-bold leading-tight tracking-tight sm:line-clamp-2 sm:whitespace-normal sm:max-w-[15rem] lg:max-w-[17rem] ${
              config.companyName.length > 26 ? "text-[15px] sm:text-base lg:text-lg" : "text-base sm:text-lg lg:text-xl"
            }`}
          >
            {config.companyName}
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 text-base font-semibold text-black lg:flex xl:gap-7">
          {links.nav.map((item) => {
            const current = isCurrent(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-2xl px-3.5 py-2 transition ${
                  current
                    ? "bg-black/[0.06] font-bold text-forest-900"
                    : "hover:bg-black/[0.04] hover:text-forest-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="phone-pulse hidden h-11 items-center gap-2 rounded-2xl bg-forest-700 px-5 text-base font-bold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 sm:inline-flex"
            >
              <IconPhoneCall size={18} stroke={2.2} aria-hidden="true" />
              {config.phone}
            </a>
          )}
          <Link
            href={links.quote}
            className="hidden h-10 items-center justify-center rounded-2xl bg-ember-500 px-3.5 text-xs font-bold text-white shadow-lg shadow-ember-600/25 transition hover:bg-ember-600 sm:inline-flex sm:h-11 sm:px-6 sm:text-sm"
          >
            Free Estimate
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-white/25 text-white transition hover:border-white/50 hover:bg-white/10 sm:h-11 sm:w-11 lg:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-white transition duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-white transition duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`overflow-hidden border-t border-white/10 bg-forest-900 transition-[max-height] duration-300 ease-in-out lg:hidden ${
          menuOpen ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.nav.map((item) => {
            const current = isCurrent(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={current ? "page" : undefined}
                className={`rounded-xl px-3.5 py-3 text-base font-semibold text-white transition ${
                  current ? "bg-white/10 font-bold" : "hover:bg-white/[0.06]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => openPanel("chat")}
            className="rounded-xl px-3.5 py-3 text-left text-base font-semibold text-white transition hover:bg-white/[0.06]"
          >
            💬 Ask a question
          </button>
          <button
            type="button"
            onClick={() => openPanel("form")}
            className="rounded-xl bg-ember-500 px-3.5 py-3 text-center text-base font-bold text-white transition hover:bg-ember-600"
          >
            📋 Get a free quote
          </button>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl border-2 border-white/25 px-3.5 py-3 text-center text-base font-semibold text-white transition hover:bg-white/10"
            >
              Call {config.phone}
            </a>
          )}
        </div>
      </nav>

      {/* Phone sheet: the chat/quote panel, full screen below the bar. */}
      {panel && (
        <div className="fixed inset-x-0 bottom-0 top-0 z-[60] flex flex-col bg-forest-900/60 backdrop-blur-sm lg:hidden">
          <div className="flex h-14 shrink-0 items-center justify-end px-3">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setPanel(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-forest-900 shadow"
            >
              <IconX size={20} stroke={2.4} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
            <div className="min-h-0 flex-1">
              <HeroPanel key={panel} config={config} slug={slug} lockHref={lockHref} initialTab={panel} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
