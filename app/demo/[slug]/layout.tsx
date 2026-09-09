import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoMessage } from "@/components/DemoMessage";
import { OwnerClose } from "@/components/OwnerClose";
import { DemoTracker } from "@/components/DemoTracker";
import { loadDemo } from "@/lib/demo-loader";
import { isExpired } from "@/lib/db";
import { demoCopy, wantThisHref } from "@/lib/demo-copy";
import { demoLinks } from "@/lib/site-config";

/** Read from the database on every request; nothing is cached at the edge. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

/**
 * Applies to every page under /demo/. Children override the title; robots is
 * inherited, so a demo page can never be indexed by forgetting to set it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  keywords: []
};

export default async function DemoLayout({
  children,
  params
}: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const demo = await loadDemo(slug);

  if (!demo) return <DemoMessage {...demoCopy.missing} />;
  if (isExpired(demo)) return <DemoMessage {...demoCopy.expired} />;

  const { config } = demo;
  const links = demoLinks(demo.slug);

  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      {/*
        The banner scrolls away rather than sticking. It and the header were
        both `sticky top-0`, which stacked 198px of bars over a 600px viewport
        and made every anchor land behind them. The "I want this" CTA also
        sits in the band at the foot of every page, so nothing is lost.
      */}
      <DemoTracker slug={demo.slug} />
      <DemoBanner href={wantThisHref(demo.slug, demo.leadId)} />
      <Header config={config} links={links} slug={demo.slug} lockHref={wantThisHref(demo.slug, demo.leadId)} />
      {children}
      {/*
        Above this line the page is a website for their customers. Below it
        is the only block addressed to the owner, placed last because whoever
        has scrolled the whole thing is the warmest they will ever be.
      */}
      <OwnerClose
        config={config}
        href={wantThisHref(demo.slug, demo.leadId)}
        expiresAt={demo.expiresAt}
      />
      <Footer config={config} links={links} />
      <MobileCtaBar config={config} links={links} />
    </main>
  );
}
