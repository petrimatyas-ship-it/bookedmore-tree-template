// npx tsx scripts/site-kit/gather.mts <work-dir>
// Reads <work-dir>/business.json (the business block of the request) and gathers what is public about it:
// the Google listing, reviews and photos (Scrapingdog, DOG_API_KEY) and up to seven pages of their own site,
// with loopfinity's lib/site-gather.ts. Writes gathered.json, saves every photo as photos/g01.jpg (Google)
// and photos/s01.jpg (their site), their logo and icon, and numbered contact sheets sheet-1.jpg... to look at.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT } from "./lib.mjs";

const dir = path.resolve(process.argv[2] ?? "");
const b = JSON.parse(readFileSync(path.join(dir, "business.json"), "utf8"));
const loop = path.resolve(process.env.LOOPFINITY_DIR || path.join(ROOT, "../loopfinity"));
if (!existsSync(path.join(loop, "lib/site-gather.ts"))) throw new Error(`loopfinity is not at ${loop}; set LOOPFINITY_DIR.`);
const { gather } = await import(path.join(loop, "lib/site-gather.ts"));
const dogKey = (process.env.DOG_API_KEY || process.env.SCRAPINGDOG_API_KEY || "").trim();
if (!dogKey) console.warn("DOG_API_KEY is not set: no Google listing, reviews or Google photos.");
const g = await gather(
  { name: b.name ?? "", city: b.city ?? "", address: b.address ?? "", website: b.website ?? "", phone: b.phone ?? "", placeId: b.google_place_id ?? b.placeId ?? "" },
  { dogKey },
);
writeFileSync(path.join(dir, "gathered.json"), JSON.stringify(g, null, 1));

const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");
const out = path.join(dir, "photos");
mkdirSync(out, { recursive: true });
const saved: { name: string; url: string; width: number; height: number }[] = [];
async function save(name: string, url: string, max = 1600) {
  if (!url) return;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { "User-Agent": "Mozilla/5.0 Chrome/140", Accept: "image/*" } });
    if (!r.ok) return;
    const img = sharp(Buffer.from(await r.arrayBuffer())).rotate();
    const meta = await img.metadata();
    if (!meta.width || !meta.height) return;
    const file = path.join(out, name + ".jpg");
    const info = await img.resize(max, max, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 88 }).toFile(file);
    saved.push({ name, url, width: info.width, height: info.height });
  } catch {}
}
const two = (i: number) => String(i + 1).padStart(2, "0");
for (const [i, u] of (g.photos as string[]).entries()) await save("g" + two(i), u);
for (const [i, u] of (g.sitePhotos as string[]).entries()) await save("s" + two(i), u);
await save("logo", g.logo, 800);
await save("icon", g.icon || g.place?.thumbnail || "", 512);
writeFileSync(path.join(dir, "photos.json"), JSON.stringify(saved, null, 1));

// Contact sheets: 12 photos each, labelled, so they can be looked at a sheet at a time.
const pics = saved.filter((s) => /^[gs]\d/.test(s.name));
for (let s = 0; s * 12 < pics.length; s++) {
  const page = pics.slice(s * 12, s * 12 + 12);
  const W = 1200, cw = 300, ch = 260, rows = Math.ceil(page.length / 4);
  const tiles = await Promise.all(
    page.map(async (p, i) => {
      const thumb = await sharp(path.join(out, p.name + ".jpg")).resize(cw - 8, ch - 34, { fit: "contain", background: "#222" }).toBuffer();
      const label = Buffer.from(`<svg width="${cw - 8}" height="30"><rect width="100%" height="100%" fill="#000"/><text x="8" y="21" font-family="sans-serif" font-size="17" fill="#fff">${p.name} · ${p.width}×${p.height}</text></svg>`);
      return [{ input: thumb, left: (i % 4) * cw + 4, top: Math.floor(i / 4) * ch + 4 }, { input: label, left: (i % 4) * cw + 4, top: Math.floor(i / 4) * ch + ch - 30 }];
    }),
  );
  await sharp({ create: { width: W, height: rows * ch, channels: 3, background: "#111" } }).composite(tiles.flat()).jpeg({ quality: 80 }).toFile(path.join(dir, `sheet-${s + 1}.jpg`));
}

const p = g.place;
console.log(JSON.stringify({
  google: p ? { title: p.title, category: p.type, types: p.types, rating: p.rating, reviews: p.reviews, place_id: p.place_id, address: p.address, phone: p.phone, hours: p.operating_hours } : null,
  reviews_read: g.reviews.length,
  photos: { google: g.photos.length, site: g.sitePhotos.length, saved: saved.length, sheets: Math.ceil(pics.length / 12) },
  site_pages: g.pages,
  links: g.links,
  warnings: g.warnings,
}, null, 1));
