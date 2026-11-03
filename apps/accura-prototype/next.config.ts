import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@coss/ui"],
  webpack(config) {
    config.resolve.modules.push(path.resolve(process.cwd(), "node_modules"));
    return config;
  },
};

export default nextConfig;
