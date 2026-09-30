import type { SiteConfig } from "@/lib/site-config";

/**
 * Hand edits to generated demos, keyed by slug.
 *
 * The marketing site generates a demo once and saves it to the database;
 * there is no editor for it. When the owner wants a specific demo changed
 * before sending it, the change goes here and is laid over the saved config
 * on every read. Each field given replaces the generated one whole (a list
 * is replaced, not merged), so write out the full value.
 *
 * This repo is public: put only what could appear on the demo itself here.
 * An entry does nothing once the demo's record has expired from the store.
 */
export const demoOverrides: Record<string, Partial<SiteConfig>> = {
  "ducks-tree-and-stump-service-aurora": {
    // Their logo and photos are copied into public/: hotlinked from their
    // own site they came up broken in the browser.
    logoImage: "/images/demos/ducks-tree-and-stump-service-aurora/logo.png",
    logoWide: true,
    heroImage: "/images/demos/ducks-tree-and-stump-service-aurora/hero.webp",
    heroImageWide: "/images/demos/ducks-tree-and-stump-service-aurora/hero-wide.webp",

    // Wording below is taken from duckstree.com.
    tagline: "Full-service residential and commercial tree service in Aurora, Illinois.",
    description:
      "Duck's Tree & Stump Service, of Aurora, Illinois, is a full-service tree company for residential and commercial tree service and maintenance.",
    heroSubline:
      "Full-service residential and commercial tree care in Aurora. Removal, trimming, stump grinding, storm damage and lot clearing. Free estimates.",
    aboutParagraphs: [
      "Duck's Tree & Stump Service, of Aurora, Illinois, is a full-service tree company. We are skilled and knowledgeable in all aspects of residential and commercial tree service and maintenance.",
      "Trees can add curb appeal, but if not maintained properly they can lead to hazardous conditions affecting your property, loved ones, and other individuals. Tree stumps can bring about other issues. Let us advise you of the best course of action to take to address any issues you may be experiencing.",
      "If you are a victim of storm damage, and require emergency tree removal, we can help. We can assist with any kind of tree service, and can assist with a regular maintenance schedule. Call us any time you need a tree planted, or removed."
    ],
    services: [
      { title: "Tree Removal", description: "Dead, damaged or unwanted trees taken down safely." },
      { title: "Tree Trimming", description: "Trimming to keep trees healthy and clear of the house." },
      { title: "Stump Grinding", description: "Stumps ground down so the yard is usable again." },
      { title: "Storm Damage", description: "Emergency tree removal after a storm." },
      { title: "Lot Clearing", description: "Trees and brush cleared from a lot." },
      { title: "Tree Pruning", description: "Pruning for healthier, safer trees." },
      { title: "Tree Shaping", description: "Shaping for a tidy, even canopy." },
      { title: "Overhanging Limbs", description: "Limbs over roofs, driveways and yards cut back." },
      { title: "Plant Trees", description: "New trees planted." }
    ],

    // Their Google listing photos were hotlinked from duckstree.com and came
    // up broken; these are hosted copies of the photos on their website.
    gallery: [1, 2, 3, 4, 5].map((n) => `/images/demos/ducks-tree-and-stump-service-aurora/work-${n}.webp`),
    galleryTotal: 10,
    galleryCaption: "Photos from our website"
  }
};

export function withOverrides(slug: string, config: SiteConfig): SiteConfig {
  const patch = demoOverrides[slug];
  return patch ? { ...config, ...patch } : config;
}
