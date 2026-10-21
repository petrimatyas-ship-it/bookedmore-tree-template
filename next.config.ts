import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/apex-detailing", destination: "/apex-detailing/index.html" }
    ];
  }
};

export default nextConfig;
