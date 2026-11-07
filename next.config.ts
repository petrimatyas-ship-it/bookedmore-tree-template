import type { NextConfig } from "next";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

/** Every detailing demo built from demo-templates/detailing (one JSON per business). */
const detailingSlugs = readdirSync(path.join(process.cwd(), "demo-templates/detailing/businesses"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

/**
 * A site on a host of its own (domingotreeservice.morebookednow.com): host ->
 * the slug it shows at "/". Each host must also be added to this Vercel
 * project's domains and pointed here in DNS; the page itself is unchanged,
 * still at demo.morebookednow.com/<slug>.
 */
const ownDomains = Object.entries(
  JSON.parse(readFileSync(path.join(process.cwd(), "own-domains.json"), "utf8")) as Record<string, string>
).filter(([host, slug]) => /^[a-z0-9.-]+$/.test(host) && /^[a-z0-9][a-z0-9-]{1,80}$/.test(slug));

/** A hand-built page lives in public/<slug>/index.html; a stored one is the [slug] route. */
const pageOf = (slug: string) =>
  existsSync(path.join(process.cwd(), "public", slug, "index.html")) ? `/${slug}/index.html` : `/${slug}`;

const nextConfig: NextConfig = {
  // Sites the Replymint site maker stores are rendered per request from their
  // template, so the templates ship with those two routes.
  outputFileTracingIncludes: {
    "/[slug]": ["./demo-templates/detailing/template.html", "./demo-templates/pressure-washing/template.html", "./demo-templates/landscaping/template.html", "./demo-templates/contractor/template.html", "./demo-templates/cleaning/template.html"],
    "/api/sites": ["./demo-templates/detailing/**/*", "./demo-templates/pressure-washing/template.html", "./demo-templates/landscaping/template.html", "./demo-templates/contractor/template.html", "./demo-templates/cleaning/template.html"]
  },
  images: {
    // Demo pages show the prospect's own logo, served from wherever their
    // site or Google keeps it. The host is not known ahead of time.
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  // Hand-built demo pages are plain HTML in public/<name>/index.html, so
  // demo.morebookednow.com/<name> serves them without the trailing file name.
  async rewrites() {
    return {
      // Before the app's own pages, or "/" would be the home page on every host.
      beforeFiles: ownDomains.map(([host, slug]) => ({
        source: "/",
        has: [{ type: "host" as const, value: host.replace(/\./g, "\\.") }],
        destination: pageOf(slug)
      })),
      afterFiles: [
        { source: "/angel-pro", destination: "/angel-pro/index.html" },
        ...detailingSlugs.map((slug) => ({ source: `/${slug}`, destination: `/${slug}/index.html` }))
      ],
      fallback: []
    };
  }
};

export default nextConfig;
