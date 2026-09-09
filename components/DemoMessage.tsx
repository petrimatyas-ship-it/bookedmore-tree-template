import { demoHref } from "@/lib/demo-copy";

/** Shown instead of a demo when the slug is unknown or the draft has expired. */
export function DemoMessage({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f6f1] px-6 py-20">
      <div className="w-full max-w-lg rounded-[10px] border border-forest-900/10 bg-white p-8 text-center shadow-soft sm:p-12">
        <span className="text-4xl" aria-hidden="true">
          🌳
        </span>
        <h1 className="mt-5 text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-forest-900/70">{body}</p>
        <a
          href={demoHref}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-[#ff7a00] px-6 text-sm font-bold text-white shadow-lg shadow-[#ff7a00]/25 transition hover:bg-[#e86d00]"
        >
          {cta} <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
