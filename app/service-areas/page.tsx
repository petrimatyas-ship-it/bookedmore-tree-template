import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { business } from "@/lib/business";
import { allAreas, slugify } from "@/lib/areas";

export const metadata = {
  title: `Service Areas | Tree Service in ${business.city}, ${business.stateAbbr} | ${business.companyName}`,
  description: `Tree removal, trimming, and stump grinding across greater ${business.city}: ${business.serviceAreas.join(", ")}. Local crews, free estimates, same-day emergency dispatch.`
};

export default function ServiceAreasPage() {
  return (
    <PageShell
      eyebrow="Service Areas"
      title={`Tree service across greater ${business.city}.`}
      description="Different parts of town mean different trees and different problems. Find your neighborhood below and see what our crews handle there most."
    >
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Coverage map */}
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="overflow-hidden rounded-[22px] border border-forest-900/10 shadow-soft">
                <iframe
                  title={`Tree service coverage map for ${business.city}, ${business.stateAbbr}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.city}, ${business.stateAbbr}`)}&z=9&output=embed`}
                  className="h-[420px] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="border-t border-forest-900/10 bg-white px-6 py-4">
                  <p className="text-sm leading-6 text-forest-900/70">
                    <span className="font-bold text-forest-900">Coverage:</span> roughly a 45-minute radius around the
                    Loop, from Katy east to Kingwood and The Woodlands down to Pearland.
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="flex flex-col gap-5">
              <Reveal delay={100}>
                <div className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-700">Response times</p>
                  <p className="mt-3 text-base leading-8 text-forest-900/75">{business.responseNote}</p>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <div className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                  <h3 className="text-base font-bold text-forest-900">Not on the list?</h3>
                  <p className="mt-2 text-sm leading-7 text-forest-900/70">
                    We take jobs beyond these areas when the schedule allows, especially removals and storm work. Call
                    and we&apos;ll confirm availability in under a minute.
                  </p>
                  <a
                    href={`tel:${business.phone}`}
                    className="mt-4 inline-flex rounded-full bg-ember-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-ember-600"
                  >
                    Call {business.phone}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Per-neighborhood detail */}
          <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">
            Neighborhood by neighborhood
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {business.areaDetails.map((area, index) => (
              <Reveal key={area.name} delay={(index % 3) * 80} className="h-full">
                <article className="flex h-full flex-col rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-forest-600/25">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-forest-900">{area.name}</h3>
                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                      {area.zips.map((zip) => (
                        <span key={zip} className="rounded-full bg-[#f3f1eb] px-2 py-0.5 text-[11px] font-bold text-forest-900/60">
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-7 text-forest-900/70">{area.note}</p>
                  <div className="mt-4 border-t border-forest-900/8 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-900/50">Most requested here</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {area.popular.map((service) => (
                        <span key={service} className="rounded-full bg-forest-50 px-3 py-1 text-xs font-bold text-forest-700">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* All areas */}
          <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">
            All {allAreas.length} areas we serve
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-forest-900/70">
            Click your neighborhood for local details, common tree issues, and a fast quote.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {allAreas.map((area) => (
              <Link
                key={area.name}
                href={`/tree-service/${slugify(area.name)}`}
                className="group flex items-center justify-between gap-2 rounded-[14px] border border-forest-900/10 bg-white px-4 py-3.5 shadow-soft transition hover:-translate-y-0.5 hover:border-forest-600/30"
              >
                <span className="truncate text-sm font-bold text-forest-900">{area.name}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {area.zip && <span className="text-xs font-semibold text-forest-900/45">{area.zip}</span>}
                  <span className="text-forest-700 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>

          {/* SEO copy block */}
          <div className="mt-14 rounded-[22px] border border-forest-900/10 bg-white p-8 shadow-soft sm:p-10">
            <h2 className="text-2xl font-bold text-forest-900">
              Local tree service in {business.city}, {business.stateAbbr}, from the Loop to the suburbs
            </h2>
            <div className="mt-5 max-w-3xl space-y-5 text-base leading-8 text-forest-900/72">
              <p>
                {business.companyName} provides professional tree removal, tree trimming and pruning, stump grinding,
                emergency storm cleanup, hedge trimming, and lot clearing throughout {business.city} and the
                surrounding communities. Our crews work daily in The Heights, Memorial, River Oaks, Bellaire, and West
                University inside the Loop, and across Katy, Sugar Land, Cypress, Spring, The Woodlands, Kingwood, and
                Pearland.
              </p>
              <p>
                {business.city}&apos;s trees take a beating. Hurricane-season winds, clay soil that shifts with every
                drought, and pine beetles moving through the northern suburbs. That&apos;s why every estimate starts
                with a real assessment of the tree&apos;s condition and risk, not just a price for cutting. Whether
                it&apos;s a live oak crowding a bungalow roofline in the Heights or a storm-leaning pine over a Memorial
                driveway, we quote the safe way to do the job and put it in writing.
              </p>
              <p>
                Every job includes cleanup and haul-away, free written estimates, and proof of insurance before work
                begins. Searching for &quot;tree service near me&quot; in the {business.city} area? Call{" "}
                <a href={`tel:${business.phone}`} className="font-semibold text-forest-700 underline">
                  {business.phone}
                </a>{" "}
                or request a free quote online. We respond the same day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
