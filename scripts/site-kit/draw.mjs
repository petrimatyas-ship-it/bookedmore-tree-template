// node scripts/site-kit/draw.mjs <out.jpg> "<what the picture shows>"
// A last-resort picture from OpenAI's image model (OPENAI_API_KEY; quality SITE_MAKER_IMAGE_QUALITY, low by
// default, about $0.005 each), for a service card none of their photos fits. Never for the hero, the work
// gallery or the about section, at most five a site, and every one named in the report's warnings.
import { writeFileSync } from "node:fs";

const [out, subject] = process.argv.slice(2);
const k = (process.env.OPENAI_API_KEY || "").trim();
const quality = (process.env.SITE_MAKER_IMAGE_QUALITY || "low").trim().toLowerCase();
if (!k || !["low", "medium", "high"].includes(quality)) {
  console.log("No picture: OPENAI_API_KEY is not set (or quality is off). Leave the card without a photo.");
  process.exit(2);
}
const prompt = `Realistic photo, landscape: ${subject}. Natural colors, sharp focus. No text, no lettering, no logos, no brand names, no license plates, no people.`;
const r = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "gpt-image-2", prompt, size: "1536x1024", quality, output_format: "jpeg", output_compression: 80, n: 1 }),
});
if (!r.ok) {
  console.log("No picture:", r.status, (await r.text()).slice(0, 300));
  process.exit(1);
}
const b64 = (await r.json()).data?.[0]?.b64_json;
writeFileSync(out, Buffer.from(b64, "base64"));
console.log("saved", out);
