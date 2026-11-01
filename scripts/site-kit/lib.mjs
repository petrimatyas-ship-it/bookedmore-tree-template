// Shared bits for the site kit (see .claude/skills/build-demo-site/SKILL.md).
import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, unlink, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DEMO = (process.env.DEMO_ORIGIN || "https://demo.morebookednow.com").replace(/\/+$/, "");
const require = createRequire(import.meta.url);

/** Playwright's chromium, from the machine's global install. */
export function chromium() {
  try {
    return require("playwright").chromium;
  } catch {
    return require("/opt/node22/lib/node_modules/playwright").chromium;
  }
}
export const launch = () => chromium().launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});

/**
 * Sends a page's outside requests through curl, which goes through the
 * session's proxy with its certificates (the browser's own TLS to some hosts
 * fails there). `keep(url)` says which outside requests to let through.
 */
export async function routeOutside(page, keep) {
  const run = promisify(execFile);
  const dir = await mkdtemp(path.join(tmpdir(), "kit-"));
  let n = 0;
  await page.route("**/*", async (r) => {
    const u = r.request().url();
    if (u.startsWith("http://127.0.0.1") || u.startsWith("http://localhost")) return r.continue();
    if (r.request().method() !== "GET" || !/^https?:/.test(u) || !keep(u)) return r.abort();
    const tmp = path.join(dir, String(n++));
    try {
      const { stdout } = await run("curl", ["-sL", "-m", "30", "-A", "Mozilla/5.0 Chrome/140", "-o", tmp, "-w", "%{http_code} %{content_type}", u]);
      const [code, ...type] = stdout.split(" ");
      await r.fulfill({ status: +code || 200, contentType: type.join(" "), body: await readFile(tmp), headers: { "access-control-allow-origin": "*" } });
      unlink(tmp).catch(() => {});
    } catch {
      await r.abort();
    }
  });
}

/** Loads every lazy picture and waits for pictures and fonts. */
export async function settle(page) {
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager")));
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })))));
  await page.waitForTimeout(800);
}

/** Errors, broken pictures and sideways scroll on an open page. */
export async function problems(page, errors) {
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.getAttribute("src") && i.complete && i.naturalWidth === 0).map((i) => i.getAttribute("src")));
  const width = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  return { errors, broken, sideways: width[0] > width[1] };
}

export function key() {
  const k = (process.env.SITE_MAKER_KEY || "").trim();
  if (!k) throw new Error("SITE_MAKER_KEY is not set in this environment.");
  return k;
}
