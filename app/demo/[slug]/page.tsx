import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { AboutUs, HowItWorks, ReviewsMap, TreeCareServices } from "@/components/Sections";
import { loadDemo } from "@/lib/demo-loader";
import { demoCopy } from "@/lib/demo-copy";
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

/** The showcase home page, section for section, rendered from the demo config. */
export default async function DemoHome({ params }: Params) {
  const { slug } = await params;
  const demo = await loadDemo(slug);
  // The layout has already rendered the "not found" / "expired" page.
  if (!demo) return null;

  const { config } = demo;
  const links = demoLinks(demo.slug);

  return (
    <>
      <Hero config={config} links={links} slug={demo.slug} />
      <TreeCareServices config={config} links={links} />
      <AboutUs config={config} />
      <HowItWorks config={config} />
      <ReviewsMap config={config} />
    </>
  );
}
