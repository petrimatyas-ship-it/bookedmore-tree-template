import type { MetadataRoute } from "next";
import { allAreas, slugify } from "@/lib/areas";

// Set this to the deployed domain when the site goes live.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/services", "/pricing", "/about", "/service-areas", "/reviews", "/quote"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8
    })
  );

  const areaPages = allAreas.map((area) => ({
    url: `${BASE_URL}/tree-service/${slugify(area.name)}`,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticPages, ...areaPages];
}
