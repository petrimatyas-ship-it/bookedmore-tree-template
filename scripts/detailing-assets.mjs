/**
 * Where a detailing page's pictures live.
 *
 * Data files name each picture by file ("tier-gold.webp"). A hand-built page
 * keeps them next to itself in public/<slug>/; a site the Replymint site
 * maker built keeps them in Replymint's file store and sets `assets` to that
 * folder's address. A name that is already a full address ("https://..." or
 * "/shared/...") is left alone, so a site can mix the two.
 *
 * Returns a copy of the data with every picture field made a full path, plus
 * `asset.icon` and `asset.icon96` for the tab icon and the header logo.
 */

const full = (base, v) => (typeof v !== "string" || !v || /^(https?:)?\/\//.test(v) || v.startsWith("/") ? v : base + v);

export function resolveAssets(data) {
  const d = structuredClone(data);
  const base = typeof d.assets === "string" && d.assets ? (d.assets.endsWith("/") ? d.assets : d.assets + "/") : `/${d.slug}/`;
  d.asset = { icon: full(base, d.icons?.png ?? "icon.png"), icon96: full(base, d.icons?.small ?? "icon-96.webp") };
  for (const k of ["heroLogo", "about", "hero"]) if (d.images?.[k]?.file) d.images[k].file = full(base, d.images[k].file);
  for (const p of d.results?.photos ?? []) {
    p.before = full(base, p.before);
    p.after = full(base, p.after);
  }
  for (const t of d.packages?.tiers ?? []) if (t.image) t.image = full(base, t.image);
  for (const v of d.social?.tiktok?.videos ?? []) v.file = full(base, v.file);
  if (d.hero?.side?.car) d.hero.side.car = full(base, d.hero.side.car);
  return d;
}
