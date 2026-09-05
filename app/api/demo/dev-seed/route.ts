import { NextResponse } from "next/server";
import { putDemo, usingKv } from "@/lib/db";
import { demoFixture } from "@/lib/demo-fixture";

/**
 * Development helper: writes the hand-written fixture and sends you to it.
 * Never available in production — demos are written by the marketing site.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const demo = demoFixture();
  await putDemo(demo);
  console.log(`[dev-seed] wrote demo:${demo.slug} (${usingKv ? "Upstash" : "file store"})`);

  return NextResponse.redirect(new URL(`/demo/${demo.slug}`, request.url));
}
