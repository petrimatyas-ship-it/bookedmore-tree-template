import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/manrope";
import { DemoTopBar } from "@/components/DemoTopBar";
import { DemoMessage } from "@/components/DemoMessage";
import { DemoTracker } from "@/components/DemoTracker";
import { ModernNav } from "@/components/modern/Nav";
import { ModernMobileBar } from "@/components/modern/MobileBar";
import { ModernOwnerClose } from "@/components/modern/OwnerClose";
import { ModernFooter } from "@/components/modern/Sections";
import { loadDemo } from "@/lib/demo-loader";
import { isExpired } from "@/lib/db";
import { demoCopy, wantThisHref } from "@/lib/demo-copy";

/** Read from the database on every request; nothing is cached at the edge. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

/** Drafts, same as under /demo: never indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  keywords: []
};

/**
 * The second design, over the same demo record as /demo/[slug].
 *
 * One page only. The sub-pages of the first template are locked behind the
 * offer anyway, so a draft in this design has nothing to lose by being a
 * single scroll: every section is an anchor, and the two things a visitor
 * might do are never off screen. The demo chrome — the bar over the top,
 * the tracker, the owner's close at the foot — is the same as the first
 * design's, in this design's colours.
 */
export default async function ModernLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { slug } = await params;
  const demo = await loadDemo(slug);

  if (!demo) return <DemoMessage {...demoCopy.missing} />;
  if (isExpired(demo)) return <DemoMessage {...demoCopy.expired} />;

  const { config } = demo;
  const href = wantThisHref(demo.slug, demo.leadId);

  return (
    <main className="modern min-h-screen bg-bone font-body text-ink antialiased">
      <DemoTracker slug={demo.slug} />
      <DemoTopBar href={href} tone="ink" />
      <ModernNav config={config} homeHref={`/modern/${demo.slug}`} />
      {children}
      <ModernOwnerClose config={config} href={href} expiresAt={demo.expiresAt} />
      <ModernFooter config={config} />
      <ModernMobileBar config={config} />
    </main>
  );
}
