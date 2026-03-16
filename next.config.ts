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
      { protocol: "https", hostname: "mh6ne4zbebpsk1ph.public.blob.vercel-storage.com" },
    ],
  },

  redirects: async () => [
    /* ── Existing schedule-slug redirects ────────────────────────── */
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

    /* ── Old WordPress blog post URLs (/YYYY/MM/DD/slug/) ───────── */
    {
      source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*",
      destination: "/briefs",
      permanent: true,
    },

    /* ── Old Substack / Ghost newsletter URLs (/p/slug) ─────────── */
    {
      source: "/p/:slug*",
      destination: "/briefs",
      permanent: true,
    },

    /* ── Old WordPress category pages ────────────────────────────── */
    {
      source: "/category/midamgolfhq/:path*",
      destination: "/midamgolfhq",
      permanent: true,
    },
    {
      source: "/category/juniorgolfhq/:path*",
      destination: "/juniorgolfhq",
      permanent: true,
    },
    {
      source: "/category/seniorgolfhq/:path*",
      destination: "/seniorgolfhq",
      permanent: true,
    },
    {
      source: "/category/:path*",
      destination: "/",
      permanent: true,
    },

    /* ── Old archive pages → briefs ──────────────────────────────── */
    {
      source: "/archive",
      destination: "/briefs",
      permanent: true,
    },

    /* ── Old platform pages ──────────────────────────────────────── */
    {
      source: "/authors/:path*",
      destination: "/about",
      permanent: true,
    },
    {
      source: "/authors",
      destination: "/about",
      permanent: true,
    },
    {
      source: "/publications",
      destination: "/",
      permanent: true,
    },
    {
      source: "/upgrade",
      destination: "/subscribe",
      permanent: true,
    },

    /* ── Old forms page → contact ────────────────────────────────── */
    {
      source: "/forms/:path*",
      destination: "/contact",
      permanent: true,
    },
    {
      source: "/forms",
      destination: "/contact",
      permanent: true,
    },
  ],
};

export default nextConfig;
