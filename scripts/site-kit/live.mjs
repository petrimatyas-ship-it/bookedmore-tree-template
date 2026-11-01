// node scripts/site-kit/live.mjs <work-dir>
// Opens the published page at 390 and 1440 wide: script errors, broken pictures, sideways scroll,
// and live-<w>.png of the first screen in <work-dir>/shots/.
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { DEMO, launch, routeOutside, settle, problems } from "./lib.mjs";

const dir = path.resolve(process.argv[2] ?? "");
const { slug } = JSON.parse(readFileSync(path.join(dir, "site.json"), "utf8"));
mkdirSync(path.join(dir, "shots"), { recursive: true });
const b = await launch();
let bad = false;
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const page = await b.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await routeOutside(page, (u) => !/\/api\//.test(u) || /\/api\/site-files\//.test(u));
  await page.goto(`${DEMO}/${slug}`, { waitUntil: "networkidle", timeout: 90_000 });
  await settle(page);
  const p = await problems(page, errors);
  await page.screenshot({ path: path.join(dir, "shots", `live-${w}.png`) });
  console.log(`${w}px: errors ${p.errors.join(" | ") || "none"} · broken pictures ${p.broken.join(" ") || "none"} · sideways scroll ${p.sideways ? "YES" : "no"}`);
  bad ||= p.errors.length > 0 || p.broken.length > 0 || p.sideways;
  await page.close();
}
await b.close();
// The chat answers from the site's own assistant block.
const chat = await fetch(`${DEMO}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, messages: [{ role: "user", content: "What's your phone number?" }] }) });
console.log("chat:", chat.status, (await chat.text()).slice(0, 300));
process.exit(bad ? 1 : 0);
