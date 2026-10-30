import type { NextConfig } from "next";
import { readdirSync } from "fs";
import path from "path";

/** Every detailing demo built from demo-templates/detailing (one JSON per business). */
const detailingSlugs = readdirSync(path.join(process.cwd(), "demo-templates/detailing/businesses"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const nextConfig: NextConfig = {
  // Sites the Replymint site maker stores are rendered per request from their
  // template, so the templates ship with those two routes.
  outputFileTracingIncludes: {
    "/[slug]": ["./demo-templates/detailing/template.html", "./demo-templates/pressure-washing/template.html", "./demo-templates/landscaping/template.html"],
    "/api/sites": ["./demo-templates/detailing/**/*", "./demo-templates/pressure-washing/template.html", "./demo-templates/landscaping/template.html"]
  },
  images: {
    // Demo pages show the prospect's own logo, served from wherever their
    // site or Google keeps it. The host is not known ahead of time.
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  // Hand-built demo pages are plain HTML in public/<name>/index.html, so
  // demo.morebookednow.com/<name> serves them without the trailing file name.
  async rewrites() {
    return [
      { source: "/angel-pro", destination: "/angel-pro/index.html" },
      ...detailingSlugs.map((slug) => ({ source: `/${slug}`, destination: `/${slug}/index.html` }))
    ];
  }
};

export default nextConfig;
