// node scripts/site-kit/example.mjs <slug> <out.json>
// Saves a finished site's { template, data } from the demo site, to copy its shape and tone.
// Its pictures are at https://demo.morebookednow.com/<slug>/<file> (hand-built ones) or under its `assets`.
import { writeFileSync } from "node:fs";
import { DEMO, key } from "./lib.mjs";

const [slug, out] = process.argv.slice(2);
const r = await fetch(`${DEMO}/api/sites?slug=${encodeURIComponent(slug)}&data=1`, { headers: { Authorization: `Bearer ${key()}` } });
if (!r.ok) throw new Error(`${slug}: ${r.status} ${await r.text()}`);
const { site } = await r.json();
if (!site.data) throw new Error("The demo site does not hand out site data yet (deploy pending).");
writeFileSync(out, JSON.stringify({ slug, template: site.template, data: site.data }, null, 1));
console.log(`${slug}: ${site.template}, saved to ${out}`);
