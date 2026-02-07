import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8069/api/:path*",
      },
      {
        source: "/web/:path*",
        destination: "http://localhost:8069/web/:path*",
      },
    ];
  },
};

export default nextConfig;
