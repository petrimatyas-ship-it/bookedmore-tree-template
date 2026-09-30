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
    heroImageWide: "/images/demos/ducks-tree-and-stump-service-aurora/hero-wide.webp"
  }
};

export function withOverrides(slug: string, config: SiteConfig): SiteConfig {
  const patch = demoOverrides[slug];
  return patch ? { ...config, ...patch } : config;
}
