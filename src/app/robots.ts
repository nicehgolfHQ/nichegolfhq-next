import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowJunk = [
    // /p/, /YYYY/MM/DD/, and /forms/ permanently redirect. Leaving them
    // disallowed would stop Google from seeing those redirects.
    // Old archive with query-string pollution
    "/archive?",
    // Feed endpoints Google shouldn't index
    "*/feed/",
    // Favicon variants
    "/favicon.ico?",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowJunk,
      },

      // AI / LLM crawlers — explicitly allowed
      { userAgent: "GPTBot", allow: "/", disallow: disallowJunk },
      { userAgent: "ChatGPT-User", allow: "/", disallow: disallowJunk },
      { userAgent: "ClaudeBot", allow: "/", disallow: disallowJunk },
      { userAgent: "Claude-Web", allow: "/", disallow: disallowJunk },
      { userAgent: "PerplexityBot", allow: "/", disallow: disallowJunk },
      { userAgent: "Bytespider", allow: "/", disallow: disallowJunk },
      { userAgent: "GoogleOther", allow: "/", disallow: disallowJunk },
      { userAgent: "Google-Extended", allow: "/", disallow: disallowJunk },
      { userAgent: "cohere-ai", allow: "/", disallow: disallowJunk },
    ],
    sitemap: [
      "https://www.nichegolfhq.com/sitemap.xml",
      "https://www.nichegolfhq.com/news-sitemap.xml",
    ],
  };
}
