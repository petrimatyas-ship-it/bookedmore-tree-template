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
            <span className="relative h-10 w-10 shrink-0 sm:h-14 sm:w-14">
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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900 shadow-sm sm:h-12 sm:w-12">
              <span className="text-sm font-bold text-white sm:text-base" aria-hidden="true">
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
            className={`line-clamp-2 max-w-[11rem] font-bold leading-tight tracking-tight sm:max-w-[15rem] lg:max-w-[17rem] ${
              config.companyName.length > 26 ? "text-sm sm:text-base lg:text-lg" : "text-base sm:text-lg lg:text-xl"
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
