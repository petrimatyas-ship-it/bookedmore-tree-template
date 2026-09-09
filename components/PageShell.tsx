import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { business } from "@/lib/business";
import { defaultLinks, type SiteConfig, type SiteLinks } from "@/lib/site-config";

/**
 * The showcase site's sub-page wrapper: chrome, dark title band, body, CTA.
 *
 * Demo pages don't use this — their chrome lives in the demo layout — but
 * they reuse `PageHead` and `CtaBand` below so both render identical markup.
 */
export function PageShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <LocalBusinessSchema />
      <Header />
      <PageHead eyebrow={eyebrow} title={title} description={description} />
      {children}
      <CtaBand />
      <Footer />
      <MobileCtaBar />
    </main>
  );
}

/** The dark band under the header on every sub-page. */
export function PageHead({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-forest-900 px-4 py-10 text-white sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ember-400">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[30px] font-extrabold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-6 text-white/80 sm:text-lg sm:leading-8">{description}</p>
      </div>
    </section>
  );
}

export function CtaBand({
  config = business,
  links = defaultLinks
}: {
  config?: SiteConfig;
  links?: SiteLinks;
}) {
  return (
    <section className="px-4 py-10 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[22px] bg-forest-900 p-8 text-white shadow-soft sm:p-10 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">Ready for a free estimate?</h2>
          <p className="mt-2 max-w-xl text-white/75">
            Tell us about the job and we&apos;ll get back to you with straightforward pricing, no pressure.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={links.quote}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-xl shadow-ember-600/20 transition hover:bg-ember-600"
          >
            Get My Free Estimate →
          </a>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              {config.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
