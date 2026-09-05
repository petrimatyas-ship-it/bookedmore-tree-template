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
    title: `Services | ${config.companyName}`,
    description: `Tree removal, trimming, stump grinding, emergency service, and more across ${config.city}.`
  };
}

export default async function DemoServicesPage({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);
  const hasEmergency = config.serviceCards.some((s) => /emergency/i.test(s.title));

  return (
    <>
      <PageHead
        eyebrow="Services"
        title="Tree work handled start to finish."
        description={`From single-branch trims to full removals, our ${config.city} crews show up with the right equipment and leave the yard clean. Here's what each service actually involves.`}
      />

      {hasEmergency && (
        <section className="px-5 pt-10 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 rounded-[18px] border-2 border-ember-500/40 bg-ember-500/8 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-ember-600">
                Storm damage right now?
              </p>
              <p className="mt-1 text-sm leading-6 text-forest-900/75">
                Tree on the house, hanging limb, or blocked driveway?{" "}
                {config.phone ? "Skip the form and call." : "Send a request and mark it urgent."} Emergency calls are
                dispatched same-day, 24/7.
              </p>
            </div>
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-lg transition hover:bg-ember-600"
              >
                Call {config.phone}
              </a>
            )}
          </div>
        </section>
      )}

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10">
          {config.serviceCards.map((service, index) => (
            <Reveal key={service.title}>
              <article className="grid overflow-hidden rounded-[22px] border border-forest-900/10 bg-white shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
                <div className={`relative min-h-[260px] lg:min-h-[360px] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.image})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/30 to-transparent" />
                  <span className="absolute bottom-5 left-5 rounded-full bg-forest-900/78 px-4 py-2 text-sm font-bold text-white shadow-md backdrop-blur-sm">
                    {service.price}
                  </span>
                </div>
                <div className="flex flex-col p-7 sm:p-9">
                  <h2 className="text-2xl font-bold leading-tight text-forest-900">{service.title}</h2>
                  <p className="mt-3 text-base leading-7 text-forest-900/70">{service.description}</p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember-600">Signs you need it</p>
                      <div className="mt-3 grid gap-2.5">
                        {service.signs.map((sign) => (
                          <span key={sign} className="flex gap-2.5 text-sm leading-6 text-forest-900/72">
                            <span className="font-bold text-ember-500" aria-hidden="true">
                              ›
                            </span>
                            <span>{sign}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-700">
                        What&apos;s included
                      </p>
                      <div className="mt-3 grid gap-2.5">
                        {service.included.map((item) => (
                          <span key={item} className="flex gap-2.5 text-sm leading-6 text-forest-900/72">
                            <span className="font-bold text-forest-700" aria-hidden="true">
                              ✓
                            </span>
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <a
                      href={links.quote}
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white transition hover:bg-ember-600"
                    >
                      Request an Estimate →
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {(config.faqs?.length ?? 0) > 0 && (
        <section className="px-5 pb-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">Common questions</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {config.faqs!.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                >
                  <h3 className="text-base font-bold leading-snug text-forest-900">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-forest-900/70">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand config={config} links={links} />
    </>
  );
}
