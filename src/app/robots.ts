import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: "/" };

  return {
    rules: [
      { userAgent: "*", ...allowAll },

      // AI / LLM crawlers — explicitly allowed
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "Bytespider", ...allowAll },
      { userAgent: "GoogleOther", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "cohere-ai", ...allowAll },
    ],
    sitemap: "https://www.nichegolfhq.com/sitemap.xml",
  };
}
