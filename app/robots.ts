import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Demo drafts are private links sent to one prospect. Never index them.
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/demo/",
          "/angel-pro",
          // Hand-built detailing demos, one per file in demo-templates/detailing/businesses.
          ...readdirSync(path.join(process.cwd(), "demo-templates/detailing/businesses"))
            .filter((f) => f.endsWith(".json"))
            .map((f) => `/${f.replace(/\.json$/, "")}`)
        ]
      }
    ]
  };
}
