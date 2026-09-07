import { promises as fs } from "fs";
import os from "os";
import path from "path";

/**
 * Serves the images generated for a demo.
 *
 * The marketing site generates them and writes them to a folder; this route
 * hands them back on the template's own domain, so a demo page never links
 * to the other project.
 *
 * Local development only in practice: serverless instances share no disk, so
 * in production this folder must become blob storage and these URLs must
 * point at it instead.
 */

const ASSET_DIR = process.env.DEMO_ASSET_DIR || path.join(os.tmpdir(), "morebookednow-demo-assets");

/** No traversal, no surprises: a flat generated filename and nothing else. */
const SAFE_NAME = /^[a-z0-9][a-z0-9-]{0,120}\.png$/;

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!SAFE_NAME.test(name)) return new Response("Not found", { status: 404 });

  try {
    const file = await fs.readFile(path.join(ASSET_DIR, name));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/png",
        // Immutable: the filename carries a timestamp, so a new image is a
        // new URL and this one never changes.
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
