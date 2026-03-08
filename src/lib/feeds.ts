export type FeedKey = "junior" | "midam" | "senior";

export type FeedConfig = {
  key: FeedKey;
  name: string;
  slug: string; // route slug
  tagline: string;
  rssUrl: string;
  subscribeEmbedUrl: string;
  // Height BeeHiiv recommends for the embed iframe. We'll render responsively but preserve height.
  subscribeEmbedHeight: number;

  // Social
  xProfileUrl?: string;
  instagramProfileUrl?: string;
  youtubeProfileUrl?: string;
  instagramBusinessAccountId?: string;
};

export const FEEDS: FeedConfig[] = [
  {
    key: "midam",
    name: "midamgolfHQ",
    slug: "midamgolfhq",
    tagline: "Mid-amateur competitive golf coverage",
    rssUrl: "https://rss.beehiiv.com/feeds/cUc6JEAOIK.xml",
    subscribeEmbedUrl: "https://subscribe-forms.beehiiv.com/6cf3e924-a8fd-4097-95ac-3ce085407e52",
    subscribeEmbedHeight: 760,
    xProfileUrl: "https://x.com/midamgolfhq",
    instagramProfileUrl: "https://www.instagram.com/midamgolfhq/",
    youtubeProfileUrl: "https://youtube.com/@midamgolfhq",
    // Provided once Meta is wired up (IG Graph API)
    instagramBusinessAccountId: process.env.IG_BUSINESS_ID_MIDAMGOLFHQ,
  },
  {
    key: "senior",
    name: "seniorgolfHQ",
    slug: "seniorgolfhq",
    tagline: "Senior amateur competitive golf coverage",
    rssUrl: "https://rss.beehiiv.com/feeds/JcpdwP5K1m.xml",
    subscribeEmbedUrl: "https://subscribe-forms.beehiiv.com/3c2071dc-19ed-44c1-8990-7db48d82c043",
    subscribeEmbedHeight: 375,
    xProfileUrl: "https://x.com/seniorgolfhq",
    instagramProfileUrl: "https://www.instagram.com/seniorgolfhq/",
    instagramBusinessAccountId: process.env.IG_BUSINESS_ID_SENIORGOLFHQ,
  },
  {
    key: "junior",
    name: "juniorgolfHQ",
    slug: "juniorgolfhq",
    tagline: "Junior competitive golf coverage",
    rssUrl: "https://rss.beehiiv.com/feeds/ug2svosKWc.xml",
    subscribeEmbedUrl: "https://subscribe-forms.beehiiv.com/91af4bc6-784d-4631-b50e-9e3e1fa9615f",
    subscribeEmbedHeight: 567,
    xProfileUrl: "https://x.com/juniorgolfhq",
    instagramProfileUrl: "https://www.instagram.com/juniorgolfhq/",
    instagramBusinessAccountId: process.env.IG_BUSINESS_ID_JUNIORGOLFHQ,
  },
];

export function getFeedBySlug(slug: string): FeedConfig | undefined {
  return FEEDS.find((f) => f.slug === slug);
}
