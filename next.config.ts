import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Suppress lockfile root warning */
  turbopack: {
    root: process.cwd(),
  },

  /* Hide X-Powered-By header */
  poweredByHeader: false,

  /* Security headers */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  /* Image domains — used by next/image if adopted */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "bu.dusays.com" },
      { protocol: "https", hostname: "q1.qlogo.cn" },
      { protocol: "https", hostname: "q.qlogo.cn" },
      { protocol: "https", hostname: "bucket.loongai.fun" },
      { protocol: "https", hostname: "res.liuyuyang.net" },
      { protocol: "https", hostname: "**.thrivex.**" },
      { protocol: "http", hostname: "localhost", port: "8080" },
    ],
  },

  /* Standalone output for Docker deployment */
  output: "standalone",
};

export default nextConfig;
