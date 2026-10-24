import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  async redirects() {
    return [
      {
        source: "/illustration-lab-prototype",
        destination: "/illustration-lab",
        permanent: false,
      },
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
  transpilePackages: ["@coss/ui"],
};

export default withMDX(nextConfig);
