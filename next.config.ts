import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // BeeHiiv CDN + common image hosts
      { protocol: "https", hostname: "**.beehiiv.com" },
      { protocol: "https", hostname: "**.beehiivimages.com" },
      { protocol: "https", hostname: "**.beehiivcdn.com" },
      { protocol: "https", hostname: "images.beehiiv.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
    ],
  },
  redirects: async () => [
    {
      source: "/midamgolfhq/schedule/:slug",
      destination: "/midamgolfhq/:slug",
      permanent: true,
    },
    {
      source: "/juniorgolfhq/schedule/:slug",
      destination: "/juniorgolfhq/:slug",
      permanent: true,
    },
    {
      source: "/seniorgolfhq/schedule/:slug",
      destination: "/seniorgolfhq/:slug",
      permanent: true,
    },
  ],
};

export default nextConfig;
