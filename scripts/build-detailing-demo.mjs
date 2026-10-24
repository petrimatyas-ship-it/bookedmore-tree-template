#!/usr/bin/env node
/**
 * Builds a hand-built detailing demo page from the shared template.
 *
 *   node scripts/build-detailing-demo.mjs <slug>            writes public/<slug>/index.html
 *   node scripts/build-detailing-demo.mjs <slug> --out file writes somewhere else
 *
 * The layout lives in demo-templates/detailing/template.html; everything
 * about the business lives in demo-templates/detailing/businesses/<slug>.json.
 * See demo-templates/detailing/README.md for the whole routine.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "./render-template.mjs";
import { resolveAssets } from "./detailing-assets.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [slug, flag, outArg] = process.argv.slice(2);
if (!slug || !/^[a-z0-9][a-z0-9-]{1,80}$/.test(slug)) {
  console.error("Usage: node scripts/build-detailing-demo.mjs <slug> [--out <file>]");
  process.exit(1);
}
const dir = join(root, "demo-templates/detailing");
const data = JSON.parse(readFileSync(join(dir, "businesses", `${slug}.json`), "utf8"));
if (data.slug !== slug) throw new Error(`businesses/${slug}.json has slug "${data.slug}"`);

const html = render(readFileSync(join(dir, "template.html"), "utf8"), resolveAssets(data));
const out = flag === "--out" && outArg ? outArg : join(root, "public", slug, "index.html");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);

// Every image the page points at must exist next to it.
const missing = [...html.matchAll(new RegExp(`/${slug}/([\\w.-]+\\.(?:webp|png|jpe?g|svg))`, "g"))]
  .map((m) => m[1])
  .filter((f, i, a) => a.indexOf(f) === i && !existsSync(join(root, "public", slug, f)));
console.log(`Wrote ${out} (${html.length} bytes)`);
if (missing.length) console.warn(`Missing images in public/${slug}/: ${missing.join(", ")}`);
