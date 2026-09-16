import type { Metadata } from "next";
import {
  ModernAreas,
  ModernFaq,
  ModernHero,
  ModernNumbers,
  ModernOwnerPitch,
  ModernProcess,
  ModernQuote,
  ModernReviews,
  ModernServices,
  ModernWork
} from "@/components/modern/Sections";
import { loadDemo } from "@/lib/demo-loader";
import { demoCopy, wantThisHref } from "@/lib/demo-copy";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  if (!demo) return { title: demoCopy.missing.title };
  const { config } = demo;
  return {
    title: `${config.companyName} | Tree Service in ${[config.city, config.stateAbbr].filter(Boolean).join(", ")}`,
    description: config.description
  };
}

/** The whole site on one page, in the second design. */
export default async function ModernHome({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  // The layout has already rendered the "not found" / "expired" page.
  if (!demo) return null;

  const { config } = demo;
  const lockHref = wantThisHref(demo.slug, demo.leadId);

  return (
    <>
      <ModernHero config={config} />
      <ModernNumbers config={config} />
      <ModernServices config={config} />
      <ModernOwnerPitch config={config} href={lockHref} />
      <ModernProcess config={config} />
      <ModernWork config={config} lockHref={lockHref} />
      <ModernReviews config={config} />
      <ModernAreas config={config} />
      <ModernFaq config={config} />
      <ModernQuote config={config} slug={demo.slug} lockHref={lockHref} />
    </>
  );
}
