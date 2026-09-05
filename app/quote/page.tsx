import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { QuoteForm } from "@/components/QuoteForm";
import { business } from "@/lib/business";

export const metadata = {
  title: `Get a Free Estimate | ${business.companyName}`,
  description: `Request a free tree service estimate from ${business.companyName}.`
};

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <LocalBusinessSchema />
      <Header />
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
              {business.aboutTrustPoints.map((point) => (
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
            <QuoteForm />
          </div>
        </div>
      </section>
      <Footer />
      <MobileCtaBar />
    </main>
  );
}
