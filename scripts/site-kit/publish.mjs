// node scripts/site-kit/publish.mjs <work-dir> [--check]
// --check: says whether the slug in site.json is free on the demo site (a stored site under it is replaced
// by a publish, so never take one that belongs to another business).
// Without it: publishes site.json to the demo site (POST /api/sites, bearer SITE_MAKER_KEY), which renders
// it once and refuses it, naming the field, if anything the template needs is missing.
import { readFileSync } from "node:fs";
import path from "node:path";
import { DEMO, key } from "./lib.mjs";

const dir = path.resolve(process.argv[2] ?? "");
const site = JSON.parse(readFileSync(path.join(dir, "site.json"), "utf8"));
const auth = { Authorization: `Bearer ${key()}` };
if (process.argv.includes("--check")) {
  const r = await fetch(`${DEMO}/api/sites?slug=${encodeURIComponent(site.slug)}`, { headers: auth });
  const page = await fetch(`${DEMO}/${site.slug}`, { redirect: "manual" });
  console.log(r.status === 404 && page.status === 404 ? `${site.slug} is free.` : `${site.slug} is TAKEN (api ${r.status}, page ${page.status}); pick another.`);
  process.exit(0);
}
if (!/^https:\/\//.test(site.data.assets ?? "")) throw new Error("site.json's data.assets must be the address upload.mjs printed.");
const r = await fetch(`${DEMO}/api/sites`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(site) });
console.log(r.status, await r.text());
process.exit(r.ok ? 0 : 1);
