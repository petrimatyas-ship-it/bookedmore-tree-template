import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Sections";
import { DemoTopBar } from "@/components/DemoTopBar";
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
    <main className="min-h-screen bg-night">
      {/*
        One bar, not three. A banner that scrolled away and a note parked over
        the page were both asking for the same attention; this hides as they
        read down and comes back the moment they scroll up. The header sits
        under it via --demo-bar-h, so nothing stacks and no anchor lands
        behind a bar. The "I want this" CTA is still in the band at the foot
        of every page too.
      */}
      <DemoTracker slug={demo.slug} />
      <DemoTopBar href={wantThisHref(demo.slug, demo.leadId)} />
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
    </main>
  );
}
