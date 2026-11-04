// node scripts/site-kit/preview.mjs <work-dir>
// Renders <work-dir>/site.json ({ slug, template, data }) with its template, the pictures served from
// <work-dir>/site/, exactly as the demo site would render it, and checks it at 390 and 1440 wide:
// script errors, broken pictures, sideways scroll. Saves top-<w>.png (the first screen) and
// page-<w>-<n>.png (the whole page in screen-sized pieces) in <work-dir>/shots/ to look at.
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT, launch, routeOutside, settle, problems } from "./lib.mjs";
import { render } from "../render-template.mjs";
import { resolveAssets } from "../detailing-assets.mjs";
import { withView, sitePaths } from "../site-pages.mjs";

const dir = path.resolve(process.argv[2] ?? "");
const site = JSON.parse(readFileSync(path.join(dir, "site.json"), "utf8"));
const tpl = readFileSync(path.join(ROOT, `demo-templates/${site.template}/template.html`), "utf8");
const local = resolveAssets({ ...site.data, assets: "/a/" });
// every page of a full site (pages: true), each at its own address
const pageHtml = new Map(sitePaths(site.data).map((p) => [p, render(tpl, withView(local, p))]));
const html = pageHtml.get("");
const types = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".css": "text/css", ".js": "text/javascript" };
const server = createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (u === "/") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(html);
  // a full site's other pages, at /<slug>/<page> as on the demo site
  const sub = u.startsWith(`/${site.slug}/`) ? u.slice(site.slug.length + 2).replace(/\/+$/, "") : null;
  if (sub !== null && pageHtml.has(sub)) return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(pageHtml.get(sub));
  if (u === `/${site.slug}`) return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(html);
  // their pictures from <work-dir>/site/, shared ones (/detailing/cars/...) from public/
  const file = u.startsWith("/a/") ? path.join(dir, "site", path.basename(u)) : path.join(ROOT, "public", path.normalize(u));
  if (!file.startsWith(dir) && !file.startsWith(path.join(ROOT, "public"))) return res.writeHead(404).end();
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/`;
const shots = path.join(dir, "shots");
rmSync(shots, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");
const b = await launch();
let bad = false;
const paths = [...pageHtml.keys()];
for (const [w, h] of [[390, 844], [1440, 900]]) for (const sub of paths) {
  const page = await b.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await routeOutside(page, (u) => /fonts\.(googleapis|gstatic)\.com/.test(u));
  await page.goto(sub ? `${url}${site.slug}/${sub}` : url, { waitUntil: "networkidle" });
  await settle(page);
  const p = await problems(page, errors);
  const tag = sub ? "-" + sub.replace(/\//g, "-") : "";
  await page.screenshot({ path: path.join(shots, `top-${w}${tag}.png`) });
  const full = await page.screenshot({ fullPage: true });
  const meta = await sharp(full).metadata();
  const piece = h * 2;
  let n = 0;
  for (let y = 0; y < meta.height; y += piece) await sharp(full).extract({ left: 0, top: y, width: meta.width, height: Math.min(piece, meta.height - y) }).toFile(path.join(shots, `page-${w}${tag}-${++n}.png`));
  console.log(`${w}px /${sub}: errors ${p.errors.join(" | ") || "none"} · broken pictures ${p.broken.join(" ") || "none"} · sideways scroll ${p.sideways ? "YES" : "no"} · ${n} pieces`);
  bad ||= p.errors.length > 0 || p.broken.length > 0 || p.sideways;
  await page.close();
}
await b.close();
server.close();
console.log(bad ? "FIX the problems above before publishing." : "No problems found. Now look at the shots.");
process.exit(bad ? 1 : 0);
