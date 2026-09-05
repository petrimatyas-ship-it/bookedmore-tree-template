import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// One-time helper: generates before/after photos for the project cards
// using the OpenAI Images API, saving them into public/images/projects/.
// Visit http://localhost:3000/api/generate-images once, wait for the JSON
// summary, then refresh the Reviews page. Already-generated files are
// skipped, so re-running only fills in what's missing.

export const maxDuration = 300;

const OUT_DIR = path.join(process.cwd(), "public", "images", "projects");

const scenes = [
  {
    slug: "oak-clearance",
    scene:
      "a craftsman bungalow with tan wood siding and a covered front patio on a narrow tree-lined street in Houston Heights, Texas, warm morning light, photorealistic residential photography, shot from the front sidewalk",
    before:
      "a huge live oak tree towering over the house with heavy low limbs hanging directly over the roofline and patio, dense overgrown canopy casting the whole house in shade",
    after:
      "the same live oak tree now professionally pruned with a raised, balanced canopy, clear open space between the branches and the roofline, sunlight reaching the tidy front yard"
  },
  {
    slug: "maple-removal",
    scene:
      "a two-story brick suburban home with a wide concrete driveway in Sugar Land, Texas, overcast sky after a storm, photorealistic residential photography, shot from across the street",
    before:
      "a large maple tree with a badly split trunk leaning at a dangerous angle toward the driveway, broken branches on the lawn, storm damage visible",
    after:
      "the maple tree completely removed, a clean lawn where it stood, driveway swept spotless, no debris anywhere, the yard looking open and safe"
  },
  {
    slug: "stump-grind",
    scene:
      "a front yard of a one-story ranch home among tall pine trees in Kingwood, Texas, soft afternoon light, photorealistic residential photography",
    before:
      "three large weathered pine tree stumps scattered across the patchy front lawn, roots visible, grass growing unevenly around them",
    after:
      "the same yard with all stumps gone, ground leveled smooth and covered with fresh soil and mulch patches, ready for new sod, clean and open"
  },
  {
    slug: "lot-clearing",
    scene:
      "the side lot of a traditional brick home in Bellaire, Texas, with a wooden privacy fence along the back, bright daylight, photorealistic residential photography",
    before:
      "the lot completely overgrown with dense brush, tangled vines, weeds and volunteer trees hiding the fence, wild and neglected",
    after:
      "the same lot cleared completely, neat mowed grass, the wooden fence fully visible and clean, open usable space"
  }
];

async function generateOne(apiKey: string, prompt: string): Promise<Buffer> {
  // Try gpt-image-1 first, fall back to dall-e-3.
  const attempts = [
    { model: "gpt-image-1", body: { model: "gpt-image-1", prompt, size: "1536x1024", quality: "medium" } },
    { model: "dall-e-3", body: { model: "dall-e-3", prompt, size: "1792x1024", response_format: "b64_json" } }
  ];

  let lastError = "";
  for (const attempt of attempts) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(attempt.body)
    });
    if (res.ok) {
      const data = await res.json();
      const b64 = data.data?.[0]?.b64_json;
      if (b64) return Buffer.from(b64, "base64");
      lastError = "No image data in response";
      continue;
    }
    lastError = `${attempt.model}: ${res.status} ${await res.text().catch(() => "")}`.slice(0, 300);
  }
  throw new Error(lastError);
}

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY missing from .env.local" }, { status: 500 });
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const results: Array<{ file: string; status: string }> = [];

  for (const item of scenes) {
    for (const phase of ["before", "after"] as const) {
      const fileName = `${item.slug}-${phase}.png`;
      const filePath = path.join(OUT_DIR, fileName);

      try {
        await fs.access(filePath);
        results.push({ file: fileName, status: "already exists, skipped" });
        continue;
      } catch {
        // doesn't exist yet -> generate
      }

      const prompt = `${item.scene}. ${item[phase]}. No people, no text, no watermarks.`;
      try {
        const buffer = await generateOne(apiKey, prompt);
        await fs.writeFile(filePath, buffer);
        results.push({ file: fileName, status: "generated" });
      } catch (err) {
        results.push({ file: fileName, status: `FAILED: ${err instanceof Error ? err.message : "unknown"}` });
      }
    }
  }

  return NextResponse.json({
    done: true,
    note: "Refresh the Reviews page to see the images. This route can be deleted once you're happy with them.",
    results
  });
}
