import type { MetadataRoute } from "next";
import { FEEDS } from "@/lib/feeds";
import { getSupabaseServer } from "@/lib/supabaseServer";

const BASE = "https://www.nichegolfhq.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls = ["/", "/subscribe", "/sponsors", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "/" ? 1 : 0.6,
  }));

  const brandUrls = FEEDS.map((f) => ({
    url: `${BASE}/${f.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Issue URLs: pulled from Supabase so Google can crawl the full archive.
  // Best-effort: if Supabase isn't configured, sitemap still returns static + brand URLs.
  let issueUrls: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseServer();
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("issues")
      .select("newsletter_slug, issue_slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(5000);

    if (error) throw error;

    issueUrls = (data || [])
      .filter((r) => r.newsletter_slug && r.issue_slug)
      .map((r) => ({
        url: `${BASE}/${r.newsletter_slug}/issue/${r.issue_slug}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
  } catch {
    // ignore
  }

  return [...staticUrls, ...brandUrls, ...issueUrls];
}
