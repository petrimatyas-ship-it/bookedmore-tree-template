import { createHash, timingSafeEqual } from "crypto";

/**
 * The Replymint site maker signs in to /api/sites with a key both sides keep
 * as a secret: SITE_MAKER_KEY here on Vercel, and the same value on the
 * loopfinity Worker. Without it set, the API refuses everything.
 */
export function siteMakerKeyOk(header: string | null): boolean {
  const want = process.env.SITE_MAKER_KEY;
  const got = header?.replace(/^Bearer\s+/i, "") ?? "";
  if (!want || !got || got.length > 300) return false;
  const a = createHash("sha256").update(got).digest();
  const b = createHash("sha256").update(want).digest();
  return timingSafeEqual(a, b);
}
