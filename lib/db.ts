import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { SiteConfig } from "@/lib/site-config";

/**
 * The demo store, read side.
 *
 * Upstash Redis over REST (KV_REST_API_URL / KV_REST_API_TOKEN — the names
 * Vercel sets for you) in production, the same pair of variables the
 * marketing site writes with. Both projects must point at one database.
 *
 * Without those variables it falls back to a folder on disk, shared by
 * default with the marketing site running on the same machine, so the whole
 * pipeline can be exercised locally with no accounts. Never use that in
 * production: serverless instances do not share a filesystem.
 */

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingKv = Boolean(KV_URL && KV_TOKEN);

const FILE_DIR = process.env.DEMO_STORE_DIR || path.join(os.tmpdir(), "morebookednow-demos");

export type DemoFraming = "has_site" | "no_site";

export type DemoRecord = {
  slug: string;
  leadId: string;
  createdAt: string;
  expiresAt: string;
  config: SiteConfig;
  /** Raw pulled reviews / photos / hours. Written in a later step, unused today. */
  enrichment: unknown | null;
  framing: DemoFraming;
};

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,80}$/;

async function kv(command: unknown[]): Promise<unknown> {
  const res = await fetch(KV_URL as string, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  return (await res.json()).result;
}

function filePath(slug: string) {
  return path.join(FILE_DIR, `demo-${slug}.json`);
}

export async function getDemo(slug: string): Promise<DemoRecord | null> {
  if (!SLUG_RE.test(slug)) return null;

  let raw: string | null = null;
  try {
    if (usingKv) {
      raw = ((await kv(["GET", `demo:${slug}`])) as string | null) ?? null;
    } else {
      raw = await fs.readFile(filePath(slug), "utf8");
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") {
      console.error("[db] Failed to read demo", slug, err);
    }
    return null;
  }

  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoRecord;
  } catch (err) {
    console.error("[db] Corrupt demo record", slug, err);
    return null;
  }
}

export function isExpired(demo: DemoRecord) {
  return new Date(demo.expiresAt).getTime() < Date.now();
}

/* ------------------------------------------------------------------ */
/* Engagement                                                            */
/* ------------------------------------------------------------------ */

export type EngagementEvent = { event: string; page: string; value?: number; at: string };

/** Plenty to judge interest; short enough that a bored tab cannot bloat it. */
const MAX_EVENTS = 200;

/**
 * Appends one thing the owner did with their draft.
 *
 * Kept under its own key rather than on the demo record: this is written far
 * more often than the demo is, and a lost or clashing write must never risk
 * the record the page renders from.
 */
export async function recordEngagement(slug: string, event: EngagementEvent): Promise<void> {
  const key = `engagement:${slug}`;
  try {
    if (usingKv) {
      await kv(["RPUSH", key, JSON.stringify(event)]);
      await kv(["LTRIM", key, -MAX_EVENTS, -1]);
      // Outlives the demo by a fortnight: still useful for following up
      // after the draft itself has come down.
      await kv(["EXPIRE", key, 60 * 60 * 24 * 45]);
      return;
    }
    await fs.mkdir(FILE_DIR, { recursive: true });
    const file = path.join(FILE_DIR, `engagement-${slug}.json`);
    let events: EngagementEvent[] = [];
    try {
      events = JSON.parse(await fs.readFile(file, "utf8")) as EngagementEvent[];
    } catch {
      events = [];
    }
    events.push(event);
    await fs.writeFile(file, JSON.stringify(events.slice(-MAX_EVENTS)), "utf8");
  } catch (err) {
    console.error("[db] Could not record engagement", slug, err);
  }
}

export async function getEngagement(slug: string): Promise<EngagementEvent[]> {
  if (!SLUG_RE.test(slug)) return [];
  try {
    if (usingKv) {
      const raw = (await kv(["LRANGE", `engagement:${slug}`, 0, -1])) as string[] | null;
      return (raw ?? []).map((r) => JSON.parse(r) as EngagementEvent);
    }
    return JSON.parse(await fs.readFile(path.join(FILE_DIR, `engagement-${slug}.json`), "utf8")) as EngagementEvent[];
  } catch {
    return [];
  }
}

/**
 * Write side. The marketing site owns generation, so the only caller here is
 * the dev seed route that renders a hand-written record.
 */
export async function putDemo(demo: DemoRecord): Promise<void> {
  const body = JSON.stringify(demo);
  if (usingKv) {
    const ttl = Math.max(60, Math.floor((new Date(demo.expiresAt).getTime() - Date.now()) / 1000));
    await kv(["SET", `demo:${demo.slug}`, body, "EX", ttl]);
    return;
  }
  await fs.mkdir(FILE_DIR, { recursive: true });
  await fs.writeFile(filePath(demo.slug), body, "utf8");
}
