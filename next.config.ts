import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: { globalNotFound: true },
  output: process.env.NEXT_OUTPUT_STANDALONE === "1" ? "standalone" : undefined,
  poweredByHeader: false,
  images: { qualities: [60, 75] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/",
        has: [{ type: "query", key: "editor", value: "1" }],
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
