import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Three.js / WebGL packages to be bundled properly
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Image optimization config
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
