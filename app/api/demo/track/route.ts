import { NextResponse } from "next/server";
import { recordEngagement, SLUG_RE } from "@/lib/db";

/**
 * Receives what the owner did with their draft.
 *
 * Deliberately forgiving: this is fire-and-forget from a beacon that may
 * arrive as the tab closes, and a failure here must never be visible on the
 * page. Everything returns 204 regardless.
 */

const EVENTS = /^(view|scroll|dwell|assistant|cta:[a-z-]{1,24})$/;
const VISIT_RE = /^[a-z0-9]{4,16}$/;

/**
 * Where the visit came from, so the owner can tell a prospect's visit from
 * their own. Vercel sets these headers from the IP; the IP itself is never
 * read or stored. Absent locally and on other hosts, where this is empty.
 */
function whereFrom(headers: Headers): string | undefined {
  const decode = (v: string | null) => {
    if (!v) return "";
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const parts = [
    decode(headers.get("x-vercel-ip-city")),
    decode(headers.get("x-vercel-ip-country-region")),
    decode(headers.get("x-vercel-ip-country"))
  ].filter(Boolean);
  return parts.length ? parts.join(", ").slice(0, 80) : undefined;
}

/** "iPhone, Safari": enough to tell two people apart, nothing more. */
function deviceFrom(ua: string): string | undefined {
  if (!ua) return undefined;
  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? /Mobile/.test(ua) ? "Android phone" : "Android tablet"
        : /Windows/.test(ua)
          ? "Windows"
          : /Macintosh|Mac OS X/.test(ua)
            ? "Mac"
            : /Linux/.test(ua)
              ? "Linux"
              : "Other";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /SamsungBrowser/.test(ua)
      ? "Samsung Internet"
      : /CriOS|Chrome\//.test(ua)
        ? "Chrome"
        : /FxiOS|Firefox\//.test(ua)
          ? "Firefox"
          : /Outlook|Microsoft Outlook/.test(ua)
            ? "Outlook"
            : /Safari\//.test(ua)
              ? "Safari"
              : "";
  return [os, browser].filter(Boolean).join(", ");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      slug?: string;
      event?: string;
      page?: string;
      value?: number;
      visit?: string;
    };
    const slug = String(body.slug ?? "");
    const event = String(body.event ?? "");

    if (!SLUG_RE.test(slug) || !EVENTS.test(event)) return new NextResponse(null, { status: 204 });

    await recordEngagement(slug, {
      event,
      page: String(body.page ?? "").slice(0, 120),
      value: typeof body.value === "number" && Number.isFinite(body.value) ? Math.round(body.value) : undefined,
      at: new Date().toISOString(),
      visit: VISIT_RE.test(String(body.visit ?? "")) ? String(body.visit) : undefined,
      where: whereFrom(request.headers),
      device: deviceFrom(request.headers.get("user-agent") ?? "")
    });
  } catch {
    /* Never surface a tracking failure to the visitor. */
  }
  return new NextResponse(null, { status: 204 });
}
