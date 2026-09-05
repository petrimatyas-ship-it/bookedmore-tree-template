import type { Metadata } from "next";
import { PageHead, CtaBand } from "@/components/PageShell";
import { loadDemo } from "@/lib/demo-loader";
import { demoLinks } from "@/lib/site-config";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return {};
  return {
    title: `About | ${demo.config.companyName}`,
    description: `Who we are: a local ${demo.config.city} tree crew. Safe work, clear communication, clean finishes.`
  };
}

export default async function DemoAboutPage({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);
  const stats = config.stats ?? [];
  const story = config.story ?? [];
  const credentials = config.credentials ?? [];
  const process = config.process ?? [];

  return (
    <>
      <PageHead
        eyebrow="About Us"
        title={
          config.founded
            ? `One truck in ${config.founded}. A full crew today.`
            : `A local crew serving ${config.city}.`
        }
        description={`Most tree companies lose customers between the phone call and the cleanup. ${config.companyName} is built around fixing exactly that.`}
      />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div
              className="h-[340px] rounded-[18px] bg-cover bg-center shadow-soft sm:h-[420px]"
              style={{ backgroundImage: `url(${config.aboutImage})` }}
              aria-label={`${config.companyName} crew`}
            />
            {stats.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[14px] border border-forest-900/10 bg-white p-4 text-center shadow-soft"
                  >
                    <div className="text-2xl font-extrabold text-forest-900">{stat.value}</div>
                    <div className="mt-1 text-xs font-semibold leading-4 text-forest-900/65">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">
              Tree work is dangerous. Hiring us shouldn&apos;t be.
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-forest-900/72">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {config.aboutTrustPoints.map((point) => (
                <span
                  key={point}
                  className="rounded-full border border-forest-900/12 bg-white px-4 py-2 text-sm font-semibold text-forest-900"
                >
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {credentials.length > 0 && (
        <section className="px-5 pb-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">
              Why homeowners pick us over the cheapest bid
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {credentials.map((cred) => (
                <article
                  key={cred.title}
                  className="flex gap-4 rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-900 font-bold text-white"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-forest-900">{cred.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-forest-900/70">{cred.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="px-5 pb-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-forest-900 sm:text-3xl">How a job runs, start to finish</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {process.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-base font-bold leading-snug text-forest-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-forest-900/68">{step.text}</p>
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
