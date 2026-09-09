import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import {
  AboutUs,
  CtaBand,
  WarningSigns,
  FaqSection,
  HowItWorks,
  QuoteCta,
  Reviews,
  ServiceAreaMap,
  TreeCareServices,
  TrustBar
} from "@/components/Sections";
import { WorkGallery } from "@/components/WorkGallery";
import { loadDemo } from "@/lib/demo-loader";
import { demoCopy, wantThisHref } from "@/lib/demo-copy";
import { demoLinks } from "@/lib/site-config";

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

/**
 * The demo home page. Our layout and copy throughout; the only things pulled
 * from the business are its photos, its Google reviews and the map.
 */
export default async function DemoHome({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  // The layout has already rendered the "not found" / "expired" page.
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);
  const lockHref = wantThisHref(demo.slug, demo.leadId);

  return (
    <>
      <Hero config={config} links={links} />
      <TrustBar config={config} />
      <TreeCareServices config={config} links={links} compact />
      <HowItWorks config={config} />
      <WarningSigns config={config} links={links} />
      <AboutUs config={config} />
      <CtaBand config={config} links={links} />
      <WorkGallery config={config} lockHref={lockHref} />
      <Reviews config={config} />
      <ServiceAreaMap config={config} />
      <FaqSection config={config} />
      <QuoteCta config={config} slug={demo.slug} lockHref={lockHref} />
    </>
  );
}
