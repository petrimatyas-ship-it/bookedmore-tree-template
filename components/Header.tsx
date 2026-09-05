"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPhoneCall } from "@tabler/icons-react";
import { business } from "@/lib/business";
import { defaultLinks, initials, type SiteConfig, type SiteLinks } from "@/lib/site-config";

export function Header({
  config = business,
  links = defaultLinks
}: {
  config?: SiteConfig;
  links?: SiteLinks;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  /* Hash links belong to the one-page demo, where nothing is "the current page". */
  const isCurrent = (href: string) =>
    href.startsWith("/") && href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-forest-900/10 bg-white text-forest-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-6 sm:px-5 sm:py-4 lg:px-8">
        <Link
          href={links.home}
          className="flex min-w-0 items-center gap-2 sm:gap-3 lg:min-w-fit"
          aria-label={`${config.companyName} home`}
          onClick={() => setMenuOpen(false)}
        >
          <span
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-forest-900/10 sm:h-12 sm:w-12 ${
              config.logoImage ? "bg-white" : "bg-forest-900"
            }`}
          >
            {config.logoImage ? (
              /*
                object-contain, not cover: a pulled logo is often a wide
                wordmark, and cover crops "Texas Tree Surgeons" to "eSurge".
              */
              <Image
                src={config.logoImage}
                alt={`${config.companyName} logo`}
                fill
                sizes="48px"
                className="object-contain p-0.5"
                priority
              />
            ) : (
              <span className="text-sm font-bold text-white sm:text-base" aria-hidden="true">
                {initials(config.companyName)}
              </span>
            )}
          </span>
          {/*
            Wraps to a second line rather than truncating. A cut-off business
            name ("Ridgeline Tree &...") is the worst thing to show someone on
            their own site, and long names are common in this trade.
          */}
          <span className="line-clamp-2 text-base font-bold leading-tight tracking-tight sm:text-lg lg:text-xl">
            {config.companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-base font-semibold text-black lg:flex">
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

        <div className="flex min-w-fit shrink-0 items-center gap-2 sm:gap-3">
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
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-[#ff7a00] px-3.5 text-xs font-bold text-white shadow-lg shadow-[#ff7a00]/25 transition hover:bg-[#e86d00] sm:h-11 sm:px-6 sm:text-sm"
          >
            Free Estimate
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-forest-900/18 text-forest-900 transition hover:border-forest-600/55 hover:bg-forest-50 sm:h-11 sm:w-11 lg:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-forest-900 transition duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-forest-900 transition duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-forest-900 transition duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`overflow-hidden border-t border-forest-900/10 bg-white transition-[max-height] duration-300 ease-in-out lg:hidden ${
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
                className={`rounded-xl px-3.5 py-3 text-base font-semibold text-forest-900 transition ${
                  current ? "bg-black/[0.06] font-bold" : "hover:bg-black/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl border-2 border-forest-900/18 px-3.5 py-3 text-center text-base font-semibold text-forest-900 transition hover:bg-forest-50"
            >
              Call {config.phone}
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
