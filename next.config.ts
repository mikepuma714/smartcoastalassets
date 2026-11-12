import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  async rewrites() {
    return [{ source: "/projects/:slug.md", destination: "/md/projects/:slug" }];
  },
};

export default nextConfig;
