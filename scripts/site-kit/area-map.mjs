// node scripts/site-kit/area-map.mjs <work-dir>
// A real map of the service area, like the detailing page's radar but on real streets.
// Reads <work-dir>/map.json:
//   { "base": { "label": "Allen", "lat": 33.09, "lon": -96.62 },
//     "towns": [ { "label": "McKinney", "query": "McKinney, TX" }, ... ],   (lat/lon or a query to look up)
//     "rings": [10, 25] }                                                    (miles; optional)
// Writes <work-dir>/site/area-map.webp (OpenStreetMap tiles, toned down) and <work-dir>/area-map.json,
// the `area.map` block for the landscaping template: the pins, rings and base in the picture's pixels.
// The map needs its credit: "© OpenStreetMap contributors" (the template shows it).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT } from "./lib.mjs";

const dir = path.resolve(process.argv[2] ?? "");
const cfg = JSON.parse(readFileSync(path.join(dir, "map.json"), "utf8"));
const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");
const UA = { "User-Agent": "MoreBookedNow demo site builder (one-off static map)" };
const W = 1000, H = 760, MARGIN = 110;

async function locate(t) {
  if (typeof t.lat === "number" && typeof t.lon === "number") return t;
  const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(t.query ?? t.label)}`, { headers: UA });
  const [hit] = await r.json();
  await new Promise((res) => setTimeout(res, 1100)); // Nominatim: one request a second
  if (!hit) throw new Error(`Could not find ${t.query ?? t.label}`);
  return { ...t, lat: Number(hit.lat), lon: Number(hit.lon) };
}
const world = (lat, lon, z) => {
  const n = 256 * 2 ** z, s = Math.sin((lat * Math.PI) / 180);
  return { x: ((lon + 180) / 360) * n, y: (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n };
};

const base = await locate(cfg.base);
const towns = [];
for (const t of cfg.towns ?? []) towns.push(await locate(t));
const all = [base, ...towns];
// the closest zoom that fits every town with room for its label
let z = 13, box;
for (; z >= 6; z--) {
  const p = all.map((a) => world(a.lat, a.lon, z));
  box = { x0: Math.min(...p.map((q) => q.x)), x1: Math.max(...p.map((q) => q.x)), y0: Math.min(...p.map((q) => q.y)), y1: Math.max(...p.map((q) => q.y)) };
  if (box.x1 - box.x0 <= W - 2 * MARGIN - 120 && box.y1 - box.y0 <= H - 2 * MARGIN) break;
}
const left = Math.round((box.x0 + box.x1) / 2 - W / 2), top = Math.round((box.y0 + box.y1) / 2 - H / 2);
const tiles = [];
for (let tx = Math.floor(left / 256); tx <= Math.floor((left + W) / 256); tx++)
  for (let ty = Math.floor(top / 256); ty <= Math.floor((top + H) / 256); ty++) {
    const r = await fetch(`https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`, { headers: UA });
    if (!r.ok) throw new Error(`tile ${z}/${tx}/${ty}: ${r.status}`);
    tiles.push({ input: Buffer.from(await r.arrayBuffer()), left: tx * 256 - left, top: ty * 256 - top });
  }
const canvasW = Math.ceil((left + W) / 256) * 256 - Math.floor(left / 256) * 256 + 256;
const offX = left - Math.floor(left / 256) * 256, offY = top - Math.floor(top / 256) * 256;
const stitched = await sharp({ create: { width: canvasW, height: canvasW, channels: 3, background: "#f2f2f2" } })
  .composite(tiles.map((t) => ({ ...t, left: t.left + offX, top: t.top + offY })))
  .png()
  .toBuffer();
mkdirSync(path.join(dir, "site"), { recursive: true });
// toned down so the pins read: less colour, a touch lighter
await sharp(stitched).extract({ left: offX, top: offY, width: W, height: H }).modulate({ saturation: 0.35, brightness: 1.04 }).webp({ quality: 78 }).toFile(path.join(dir, "site", "area-map.webp"));

const px = (a) => { const p = world(a.lat, a.lon, z); return { x: Math.round(p.x - left), y: Math.round(p.y - top) }; };
const b = px(base);
const mPerPx = (156543.03392 * Math.cos((base.lat * Math.PI) / 180)) / 2 ** z;
const rings = (cfg.rings ?? []).map((mi) => ({ r: String(Math.round((mi * 1609.34) / mPerPx)), label: `${mi} mi`, ly: String(b.y - Math.round((mi * 1609.34) / mPerPx) - 8) }));
// labels go left of a pin near the right edge
const pin = (a, extra = {}) => { const p = px(a); const right = p.x > W - 190; return { label: a.label, x: String(p.x), y: String(p.y), tx: String(right ? -14 : 14), anchor: right ? "end" : "start", ...extra }; };
const block = {
  file: "area-map.webp", width: String(W), height: String(H),
  alt: `Map of the service area around ${base.label}`,
  base: { ...pin(base), x: String(b.x), y: String(b.y) },
  rings: rings.filter((r) => Number(r.r) < W),
  pins: towns.map((t) => pin(t)),
  credit: "© OpenStreetMap contributors",
};
writeFileSync(path.join(dir, "area-map.json"), JSON.stringify(block, null, 1));
console.log(`zoom ${z}, ${tiles.length} tiles; pins:`, towns.map((t) => `${t.label} ${t.lat.toFixed(3)},${t.lon.toFixed(3)}`).join(" | "));
