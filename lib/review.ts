import { createHash, timingSafeEqual } from "crypto";

/**
 * Review mode is opened with ?review=<key> on any demo page. Only the key's
 * SHA-256 lives here (this repo is public); the key itself is with the owner.
 */
const REVIEW_KEY_SHA256 = "5fe62abeea2debe7f3b078b43578fa3459cf1ec1539f8f461e21f19f7ab93529";

export function reviewKeyOk(key: unknown): boolean {
  if (typeof key !== "string" || !key || key.length > 200) return false;
  const a = createHash("sha256").update(key).digest();
  const b = Buffer.from(REVIEW_KEY_SHA256, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
