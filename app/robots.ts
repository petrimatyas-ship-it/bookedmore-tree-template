import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Demo drafts are private links sent to one prospect. Never index them.
      { userAgent: "*", allow: "/", disallow: ["/demo/"] }
    ]
  };
}
