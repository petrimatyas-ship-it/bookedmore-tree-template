import { IconLock, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { demoCopy } from "@/lib/demo-copy";

/**
 * Blurs a demo sub-page and puts the offer over it.
 *
 * The gate is on depth, never on proof. The home page is wide open, because
 * the whole thing works on the owner recognising their own rating, reviews,
 * photos and name — hide that and you have hidden the reason to buy. What
 * costs is the rest of the site, so the curiosity they feel here is for more
 * of what they have already seen is real.
 *
 * The content underneath is real, rendered and blurred rather than replaced:
 * they can see the shape of a full page, just not read it. It is inert to
 * the keyboard and to pointers so nothing behind the glass can be clicked,
 * and hidden from screen readers so it is not read out either.
 */
export function DemoLock({
  page,
  companyName,
  href,
  homeHref,
  children
}: {
  /** Route segment, e.g. "services". */
  page: string;
  companyName: string;
  href: string;
  homeHref: string;
  children: React.ReactNode;
}) {
  const c = demoCopy.locked;
  const name = c.pageNames[page] ?? page.replace(/-/g, " ");

  return (
    <div className="relative">
      {/* `inert` takes a real boolean in React 19; an empty string reads as false. */}
      <div
        className="pointer-events-none max-h-[70vh] select-none overflow-hidden blur-[7px]"
        aria-hidden="true"
        inert
      >
        {children}
      </div>

      {/* Fades the blurred page out rather than cutting it off mid-section. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night" />

      <div className="absolute inset-0 flex items-start justify-center px-5 pt-16 sm:pt-24">
        <div className="w-full max-w-lg rounded-[10px] border border-forest-900/10 bg-white/95 p-7 text-center shadow-[0_24px_60px_rgba(18,49,25,0.18)] backdrop-blur-sm sm:p-9">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-700">
            <IconLock size={22} stroke={2} aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-ember-600">{c.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">{c.title(name)}</h2>
          <p className="mt-4 text-[15px] leading-7 text-forest-900/70">{c.body(companyName)}</p>

          <a
            href={href}
            data-demo-cta={`locked-${page}`}
            className="mt-7 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-ember-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-ember-600/20 transition hover:bg-ember-600"
          >
            {c.cta}
            <IconArrowRight size={18} stroke={2.4} aria-hidden="true" />
          </a>
          <a
            href={homeHref}
            className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-forest-700 transition hover:text-forest-900"
          >
            <IconArrowLeft size={15} stroke={2.2} aria-hidden="true" />
            {c.secondary}
          </a>
        </div>
      </div>
    </div>
  );
}
