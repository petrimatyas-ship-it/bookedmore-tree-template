// node scripts/site-kit/upload.mjs <work-dir> <report-url>
// Uploads every picture in <work-dir>/site/ to Replymint (the app the report URL belongs to), where
// the published page reads them: PUT <app>/api/site-files/<slug>/<file>, bearer SITE_MAKER_KEY.
// Prints the address to put in the page's `assets`.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { key } from "./lib.mjs";

const [dirArg, report] = process.argv.slice(2);
const dir = path.resolve(dirArg ?? "");
const { slug } = JSON.parse(readFileSync(path.join(dir, "site.json"), "utf8"));
const app = new URL(report).origin;
const files = readdirSync(path.join(dir, "site")).filter((f) => /^[a-z0-9-]{1,40}\.(jpg|png|webp|gif|ico)$/.test(f));
let failed = 0;
for (const f of files) {
  const r = await fetch(`${app}/api/site-files/${slug}/${f}`, { method: "PUT", headers: { Authorization: `Bearer ${key()}` }, body: readFileSync(path.join(dir, "site", f)) });
  if (!r.ok) {
    failed++;
    console.log(`${f}: ${r.status} ${await r.text()}`);
  }
}
const skipped = readdirSync(path.join(dir, "site")).length - files.length;
console.log(`${files.length - failed} of ${files.length} uploaded${skipped ? `; ${skipped} skipped (names must be lowercase letters, digits and dashes, .jpg .png .webp .gif or .ico)` : ""}.`);
console.log(`assets: ${app}/api/site-files/${slug}/`);
process.exit(failed ? 1 : 0);
