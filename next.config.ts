import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    scrollRestoration: false,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "geist",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
