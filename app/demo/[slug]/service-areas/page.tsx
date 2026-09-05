import type { Metadata } from "next";
import { PageHead, CtaBand } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { loadDemo } from "@/lib/demo-loader";
import { demoLinks } from "@/lib/site-config";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return {};
  const { config } = demo;
  return {
    title: `Service Areas | Tree Service in ${[config.city, config.stateAbbr].filter(Boolean).join(", ")} | ${config.companyName}`,
    description: `Tree removal, trimming, and stump grinding across ${config.city} and the surrounding area.`
  };
}

export default async function DemoServiceAreasPage({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);
  const mapQuery = [config.city, config.stateAbbr].filter(Boolean).join(", ");
  const areas = config.serviceAreas;

  return (
    <>
      <PageHead
        eyebrow="Service Areas"
        title={`Tree service across ${config.city}.`}
        description="Different parts of town mean different trees and different problems. Here is where the crews work most often."
      />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="overflow-hidden rounded-[22px] border border-forest-900/10 shadow-soft">
                <iframe
                  title={`Tree service coverage map for ${mapQuery}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=10&output=embed`}
                  className="h-[420px] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="border-t border-forest-900/10 bg-white px-6 py-4">
                  <p className="text-sm leading-6 text-forest-900/70">
                    <span className="font-bold text-forest-900">Coverage:</span> {config.city} and the surrounding
                    area. Call to confirm anything further out.
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal delay={100}>
                <div className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-700">Response times</p>
                  <p className="mt-3 text-base leading-8 text-forest-900/75">
                    {config.responseNote ?? `Serving ${config.city} and the surrounding area.`}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <div className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                  <h3 className="text-base font-bold text-forest-900">Not on the list?</h3>
                  <p className="mt-2 text-sm leading-7 text-forest-900/70">
                    We take jobs beyond these areas when the schedule allows, especially removals and storm work.
                    {config.phone ? " Call and we'll confirm availability in under a minute." : " Send a request and we'll confirm availability."}
                  </p>
                  {config.phone && (
                    <a
                      href={`tel:${config.phone}`}
                      className="mt-4 inline-flex rounded-full bg-ember-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-ember-600"
                    >
                      Call {config.phone}
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
          </div>

          {areas.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">Areas we serve</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-[14px] border border-forest-900/10 bg-white px-4 py-3.5 shadow-soft"
                  >
                    <span className="text-forest-700" aria-hidden="true">
                      ✓
                    </span>
                    <span className="truncate text-sm font-bold text-forest-900">{area}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-14 rounded-[22px] border border-forest-900/10 bg-white p-8 shadow-soft sm:p-10">
            <h2 className="text-2xl font-bold text-forest-900">
              Local tree service in {config.city}
              {config.stateAbbr ? `, ${config.stateAbbr}` : ""}
            </h2>
            <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-forest-900/72">
              <p>
                {config.companyName} provides{" "}
                {config.serviceCards.map((s) => s.title.toLowerCase()).join(", ")} throughout {config.city} and the
                surrounding communities.
              </p>
              <p>
                Every estimate starts with a real assessment of the tree&apos;s condition and risk, not just a price
                for cutting. We quote the safe way to do the job and put it in writing.
              </p>
              <p>
                Every job includes cleanup and haul-away and a free written estimate. Searching for &quot;tree
                service near me&quot; around {config.city}?{" "}
                {config.phone ? (
                  <>
                    Call{" "}
                    <a href={`tel:${config.phone}`} className="font-semibold text-forest-700 underline">
                      {config.phone}
                    </a>{" "}
                    or request a free quote online.
                  </>
                ) : (
                  <>Request a free quote online.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand config={config} links={links} />
    </>
  );
}
