import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Suppress lockfile root warning */
  turbopack: {
    root: process.cwd(),
  },

  /* Image optimization — allow backend API images */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.thrivex.**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
    ],
  },

  /* Standalone output for Docker deployment */
  output: "standalone",
};

export default nextConfig;
