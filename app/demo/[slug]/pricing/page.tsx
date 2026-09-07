import type { Metadata } from "next";
import {
  IconRulerMeasure,
  IconRoad,
  IconAlertTriangle,
  IconTrash,
  IconStack2,
  IconFlame,
  IconCalendarEvent,
  IconClockExclamation,
  IconHelpCircle
} from "@tabler/icons-react";
import { PageHead, CtaBand } from "@/components/PageShell";
import { PriceCalculator } from "@/components/PriceCalculator";
import { loadDemo } from "@/lib/demo-loader";
import { DemoLock } from "@/components/DemoLock";
import { wantThisHref } from "@/lib/demo-copy";
import { demoLinks } from "@/lib/site-config";

type Params = { params: Promise<{ slug: string }> };

const COST_FACTOR_ICONS = [IconRulerMeasure, IconRoad, IconAlertTriangle, IconTrash];
const SAVINGS_ICONS = [IconStack2, IconFlame, IconCalendarEvent, IconClockExclamation];

const costFactors = [
  {
    title: "Tree size and height",
    text: "Taller, wider trees take more time, more rigging, and more cleanup. Size is the biggest single factor in price."
  },
  {
    title: "Access and location",
    text: "A tree in an open front yard costs less than one squeezed between a fence, a roofline, and power lines. Crane or lift access changes the plan."
  },
  {
    title: "Condition and risk",
    text: "Storm-damaged, dead, or leaning trees need slower, more controlled work to keep your property safe."
  },
  {
    title: "Cleanup and haul-away",
    text: "Chipping, hauling, and log removal are included in our quotes. If you'd rather keep firewood or chips, say so and the price comes down."
  }
];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return {};
  return {
    title: `Pricing | ${demo.config.companyName}`,
    description: `Tree service price ranges in ${demo.config.city} by tree size, and what moves the number.`
  };
}

export default async function DemoPricingPage({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);
  const priceGuide = config.priceGuide ?? [];
  const exampleJobs = config.exampleJobs ?? [];
  const savingsTips = config.savingsTips ?? [];
  const pricingFaqs = config.pricingFaqs ?? [];

  return (
    <DemoLock
      page="pricing"
      companyName={config.companyName}
      href={wantThisHref(demo.slug, demo.leadId)}
      homeHref={links.home}
    >
      <PageHead
        eyebrow="Pricing"
        title="What tree work actually costs."
        description={`Nobody publishes real numbers, so estimates feel like a lottery. Here are honest ranges for ${config.city}, plus what moves the number.`}
      />

      <section className="px-5 pt-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PriceCalculator />
        </div>
      </section>

      {priceGuide.length > 0 && (
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-2xl font-bold text-forest-900 sm:text-3xl">Full price guide</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {priceGuide.map((guide) => (
                <div
                  key={guide.service}
                  className="flex flex-col overflow-hidden rounded-[18px] border border-forest-900/10 bg-white shadow-soft"
                >
                  <div className="border-b border-forest-900/10 bg-forest-900 px-6 py-4">
                    <h3 className="text-base font-bold text-white">{guide.service}</h3>
                  </div>
                  <div className="divide-y divide-forest-900/8">
                    {guide.rows.map((row) => (
                      <div key={row.size} className="flex items-center justify-between gap-4 px-6 py-4">
                        <span className="text-sm leading-6 text-forest-900/72">{row.size}</span>
                        <span className="shrink-0 rounded-full bg-forest-50 px-3 py-1.5 text-sm font-bold text-forest-700">
                          {row.range}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-forest-900/8 bg-[#faf9f5] px-6 py-5">
                    <p className="flex-1 text-sm leading-6 text-forest-900/70">{guide.note}</p>
                    <a
                      href={links.quote}
                      className="mt-4 text-sm font-bold text-ember-600 underline-offset-4 transition hover:text-ember-500 hover:underline"
                    >
                      Get an exact price for your tree →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-forest-900/60">
              Every estimate is free and in writing. The price we quote is the price you pay. No fuel surcharges and
              no surprise cleanup fees.
            </p>
          </div>
        </section>
      )}

      {exampleJobs.length > 0 && (
        <section className="px-5 pb-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">Recent jobs, real prices</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-forest-900/70">
              Examples so you can calibrate what your job might run.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {exampleJobs.map((job) => (
                <article
                  key={job.title}
                  className="flex h-full flex-col overflow-hidden rounded-[18px] border border-forest-900/10 bg-white shadow-soft"
                >
                  <div className="relative h-48 overflow-hidden bg-forest-900/10">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${job.image})` }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900/35 to-transparent" />
                    <span className="absolute bottom-4 right-4 rounded-2xl bg-forest-900/85 px-4 py-2 text-lg font-extrabold text-white backdrop-blur-sm">
                      {job.price}
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-forest-900 shadow-sm">
                      {job.location}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-bold leading-snug text-forest-900">{job.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-forest-900/70">{job.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-4 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">What moves the number</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {costFactors.map((factor, i) => {
              const FactorIcon = COST_FACTOR_ICONS[i % COST_FACTOR_ICONS.length];
              return (
                <article
                  key={factor.title}
                  className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                >
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-forest-900">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                      <FactorIcon size={19} stroke={1.9} aria-hidden="true" />
                    </span>
                    {factor.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-forest-900/70">{factor.text}</p>
                </article>
              );
            })}
          </div>

          {savingsTips.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">Ways to keep the price down</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {savingsTips.map((tip, i) => {
                  const TipIcon = SAVINGS_ICONS[i % SAVINGS_ICONS.length];
                  return (
                    <article
                      key={tip.title}
                      className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                    >
                      <h3 className="flex items-center gap-2.5 text-base font-bold text-forest-900">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember-500/12 text-ember-600">
                          <TipIcon size={19} stroke={1.9} aria-hidden="true" />
                        </span>
                        {tip.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-forest-900/70">{tip.text}</p>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {pricingFaqs.length > 0 && (
            <>
              <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">
                Pricing questions we get a lot
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {pricingFaqs.map((faq) => (
                  <article
                    key={faq.question}
                    className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                  >
                    <h3 className="flex items-start gap-2.5 text-base font-bold leading-snug text-forest-900">
                      <IconHelpCircle
                        size={20}
                        stroke={1.9}
                        className="mt-0.5 shrink-0 text-forest-600"
                        aria-hidden="true"
                      />
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-forest-900/70">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <CtaBand config={config} links={links} />
    </DemoLock>
  );
}
