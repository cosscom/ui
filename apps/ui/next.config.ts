import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  async redirects() {
    return [
      {
        destination: "/docs/radix-migration",
        permanent: true,
        source: "/docs/radix-shadcn-migration",
      },
    ];
  },
  async rewrites() {
    return [
      {
        destination: "/api/raw/docs/:path*",
        source: "/docs/:path*.md",
      },
    ];
  },
  // The old booker sanitises event descriptions with isomorphic-dompurify,
  // whose jsdom dependency breaks when bundled for the server.
  serverExternalPackages: ["isomorphic-dompurify"],
  transpilePackages: ["@coss/ui"],
};

export default withMDX(nextConfig);
