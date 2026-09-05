import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo pages show the prospect's own logo, served from wherever their
    // site or Google keeps it. The host is not known ahead of time.
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  }
};

export default nextConfig;
