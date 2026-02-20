import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgflip.com",
      },
      {
        protocol: "https",
        hostname: "media.giphy.com",
      },
    ],
  },
  transpilePackages: ['@memes/shared'],
};

export default nextConfig;
