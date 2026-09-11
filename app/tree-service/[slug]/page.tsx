import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { business } from "@/lib/business";
import { allAreas, findArea, getAreaContent, nearbyAreas, slugify } from "@/lib/areas";

export function generateStaticParams() {
  return allAreas.map((area) => ({ slug: slugify(area.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) return {};
  return {
    title: `Tree Service in ${area.name}${area.zip ? ` (${area.zip})` : ""} | ${business.companyName}`,
    description: `Tree removal, trimming, and stump grinding in ${area.name}, ${business.stateAbbr}. Local crews, free written estimates, same-day emergency dispatch. Call ${business.phone}.`
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();

  const { paragraphs, popularServices } = getAreaContent(area);
  const nearby = nearbyAreas(area);

  return (
    <main className="min-h-screen bg-night">
      <LocalBusinessSchema />
      <Header />

      {/* Area hero */}
      <section className="bg-forest-900 px-5 py-12 text-white sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            {" › "}
            <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
            {" › "}
            <span className="text-white/85">{area.name}</span>
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Tree Service in {area.name}, {business.stateAbbr}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
            {area.zip && <span className="rounded-full bg-white/14 px-3.5 py-1.5">ZIP {area.zip}</span>}
            <span className="rounded-full bg-white/14 px-3.5 py-1.5">✓ Free estimates</span>
            <span className="rounded-full bg-white/14 px-3.5 py-1.5">✓ Fully insured</span>
            <span className="rounded-full bg-white/14 px-3.5 py-1.5">✓ 24/7 emergency</span>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#quote"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-xl shadow-ember-600/25 transition hover:bg-ember-600"
            >
              Get a Free Quote
            </a>
            <a
              href={`tel:${business.phone}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              📞 {business.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Content */}
          <div>
            <Reveal>
              <div className="space-y-5 text-base leading-8 text-forest-900/75">
                {paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-10 text-2xl font-bold text-forest-900">
                Most requested in {area.name}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {popularServices.map((service) => (
                  <Link
                    key={service}
                    href="/services"
                    className="rounded-[14px] border border-forest-900/10 bg-white px-4 py-4 text-center text-sm font-bold text-forest-900 shadow-soft transition hover:-translate-y-0.5 hover:border-forest-600/30"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 overflow-hidden rounded-[18px] border border-forest-900/10 shadow-soft">
                <iframe
                  title={`Map of ${area.name}, ${business.stateAbbr}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${area.name}, ${business.city}, ${business.stateAbbr}`)}&z=12&output=embed`}
                  className="h-[300px] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-forest-900">Nearby areas we also serve</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {nearby.map((n) => (
                  <Link
                    key={n.name}
                    href={`/tree-service/${slugify(n.name)}`}
                    className="rounded-full border border-forest-900/12 bg-white px-4 py-2 text-sm font-semibold text-forest-900 transition hover:border-forest-600/40 hover:bg-forest-50"
                  >
                    {n.name} →
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quote form sidebar */}
          <div id="quote" className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[20px] border border-forest-900/10 bg-white shadow-soft">
              <div className="bg-forest-900 px-6 py-5 text-white">
                <p className="text-lg font-bold">Free quote in {area.name}</p>
                <p className="mt-1 text-sm text-white/70">Fast response · No commitment</p>
              </div>
              <div className="p-6">
                <QuoteForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
