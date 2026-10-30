/**
 * Where a detailing page's pictures live.
 *
 * Data files name each picture by file ("tier-gold.webp"). A hand-built page
 * keeps them next to itself in public/<slug>/; a site the Replymint site
 * maker built keeps them in Replymint's file store and sets `assets` to that
 * folder's address. A name that is already a full address ("https://..." or
 * "/shared/...", or a data: picture) is left alone, so a site can mix them.
 *
 * Returns a copy of the data with every picture field made a full path, plus
 * `asset.icon` and `asset.icon96` for the tab icon and the header logo.
 */

const full = (base, v) => (typeof v !== "string" || !v || /^(https?:)?\/\//.test(v) || /^data:image\//.test(v) || v.startsWith("/") ? v : base + v);

export function resolveAssets(data) {
  const d = structuredClone(data);
  const base = typeof d.assets === "string" && d.assets ? (d.assets.endsWith("/") ? d.assets : d.assets + "/") : `/${d.slug}/`;
  d.asset = { icon: full(base, d.icons?.png ?? "icon.png"), icon96: full(base, d.icons?.small ?? "icon-96.webp") };
  // every named picture (heroLogo, about, hero, and the landscaping page's about2)
  for (const k of Object.keys(d.images ?? {})) if (d.images[k]?.file) d.images[k].file = full(base, d.images[k].file);
  for (const s of d.services?.items ?? []) if (s.photo) s.photo = full(base, s.photo);
  for (const k of ["why", "band"]) if (d[k]?.photo?.file) d[k].photo.file = full(base, d[k].photo.file);
  for (const p of d.results?.photos ?? []) {
    p.before = full(base, p.before);
    p.after = full(base, p.after);
  }
  for (const t of d.packages?.tiers ?? []) {
    if (t.image) t.image = full(base, t.image);
    if (t.photo) t.photo = full(base, t.photo);
  }
  for (const v of d.social?.tiktok?.videos ?? []) v.file = full(base, v.file);
  for (const g of d.gallery?.photos ?? []) g.file = full(base, g.file);
  if (d.hero?.side?.car) d.hero.side.car = full(base, d.hero.side.car);
  return d;
}
