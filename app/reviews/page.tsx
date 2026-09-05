import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { business } from "@/lib/business";

export const metadata = {
  title: `Reviews | ${business.companyName}`,
  description: `${business.reviewSummary.rating}-star rated tree service in ${business.city}. Read reviews from homeowners across the area.`
};

const distribution = [
  { stars: 5, pct: 91 },
  { stars: 4, pct: 7 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 }
];

export default function ReviewsPage() {
  return (
    <PageShell
      eyebrow="Reviews"
      title="What homeowners say after the crew leaves."
      description="The work matters, but so does everything around it: showing up on time, communicating clearly, and leaving the yard spotless. Every review below is from a completed job."
    >
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Summary + distribution */}
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center rounded-[22px] border border-forest-900/10 bg-white p-8 shadow-soft">
              <div className="flex items-center gap-5">
                <div className="text-6xl font-extrabold text-forest-900">{business.reviewSummary.rating}</div>
                <div>
                  <div className="text-lg font-bold tracking-[0.1em] text-ember-500">★★★★★</div>
                  <div className="mt-1 text-sm font-semibold text-forest-900/70">
                    {business.reviewSummary.count} verified {business.reviewSummary.source}
                  </div>
                </div>
              </div>
              <a
                href="/quote"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-ember-500 px-6 text-sm font-bold text-white shadow-xl shadow-ember-600/20 transition hover:bg-ember-600"
              >
                Get My Free Estimate →
              </a>
            </div>
            <div className="rounded-[22px] border border-forest-900/10 bg-white p-8 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-900/60">Rating breakdown</p>
              <div className="mt-4 grid gap-3">
                {distribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-sm font-bold text-forest-900">{row.stars}★</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#f3f1eb]">
                      <div className="h-full rounded-full bg-ember-500" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-right text-sm font-semibold text-forest-900/60">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All reviews */}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {business.reviews.map((review, index) => (
              <Reveal key={review.name} delay={(index % 3) * 80} className="h-full">
              <article className="flex h-full flex-col rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold tracking-[0.18em] text-ember-500">
                    {"★".repeat(review.rating)}
                  </div>
                  <span className="text-xs font-semibold text-forest-900/50">{review.date}</span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-forest-900/72">&quot;{review.text}&quot;</p>
                <div className="mt-5 border-t border-forest-900/8 pt-4">
                  <p className="text-sm font-bold text-forest-900">{review.name}</p>
                  <p className="mt-1 text-xs font-semibold text-forest-900/55">
                    {review.service} · {review.area}
                  </p>
                </div>
              </article>
              </Reveal>
            ))}
          </div>

          {/* Before / after */}
          <h2 className="mt-14 text-2xl font-bold text-forest-900 sm:text-3xl">Before &amp; after</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {business.projects.map((project, index) => (
              <Reveal key={project.title} delay={(index % 2) * 100} className="h-full">
              <article className="flex h-full flex-col rounded-[18px] border border-forest-900/10 bg-white p-6 shadow-soft">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-bold text-forest-900">{project.title}</h3>
                  <span className="shrink-0 rounded-full bg-forest-50 px-3 py-1 text-xs font-bold text-forest-700">
                    {project.location}
                  </span>
                </div>
                <div className="mt-4">
                  <BeforeAfterSlider
                    beforeImage={project.beforeImage}
                    afterImage={project.afterImage}
                    alt={project.title}
                  />
                  <p className="mt-2 text-center text-xs font-semibold text-forest-900/50">
                    Drag the handle to compare
                  </p>
                </div>
                <div className="mt-3 grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-[14px] bg-[#f3f1eb] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-900/60">Before</p>
                    <p className="mt-2 text-sm leading-6 text-forest-900/72">{project.before}</p>
                  </div>
                  <div className="rounded-[14px] bg-forest-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest-700">After</p>
                    <p className="mt-2 text-sm leading-6 text-forest-900/72">{project.after}</p>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
