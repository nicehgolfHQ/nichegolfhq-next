import ty
        {
          source: "/juniorgolfhq/schedule",
          destination: "/juniorgolfhq",
          permanent: true,
        },
        {
          source: "/seniorgolfhq/schedule",
          destination: "/seniorgolfhq",
          permanent: true,
        },pe { NextConfig } from "next";

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
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
