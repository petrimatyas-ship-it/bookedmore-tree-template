import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { loadDemo } from "@/lib/demo-loader";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return {};
  return {
    title: `Get a Free Estimate | ${demo.config.companyName}`,
    description: `Request a free tree service estimate from ${demo.config.companyName}.`
  };
}

export default async function DemoQuotePage({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return null;

  const { config } = demo;

  return (
    <section className="px-5 py-16 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-forest-600">Free Estimate</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-forest-900 sm:text-5xl">
            Tell us about the job.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-forest-900/70">
            Send a few details and we&apos;ll follow up with straightforward pricing &mdash; no pressure, no
            surprise costs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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
        <div className="rounded-[22px] border border-forest-900/10 bg-white p-6 shadow-soft sm:p-9">
          <QuoteForm config={config} slug={demo.slug} />
        </div>
      </div>
    </section>
  );
}
