// node scripts/site-kit/report.mjs <report-url> '<json>'
// Tells Replymint how the build went, bearer SITE_MAKER_KEY:
//   { "id": "<job>", "state": "review", "slug": "...", "url": "https://demo.morebookednow.com/<slug>", "business": "Name", "warnings": ["..."] }
//   { "id": "<job>", "state": "skipped" | "failed", "reason": "..." }
import { key } from "./lib.mjs";

const [url, json] = process.argv.slice(2);
JSON.parse(json);
const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" }, body: json });
console.log(r.status, await r.text());
process.exit(r.ok ? 0 : 1);
