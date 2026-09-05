import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";

export function SimplePage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <Header />
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[18px] bg-white p-10 shadow-soft sm:p-14">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ember-600">{eyebrow}</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight text-forest-900">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-9 text-forest-900/70">{description}</p>
          <div className="mt-10 rounded-[14px] border border-dashed border-forest-900/18 bg-[#f7f6f1] p-8 text-forest-900/64">
            Layout placeholder. We will design this page section by section later.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}