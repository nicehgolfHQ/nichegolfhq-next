import type { MetadataRoute } from "next";
import { FEEDS } from "@/lib/feeds";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Daily Briefs (build-generated JSON; reliable on Vercel)
import briefsData from "@/content/briefs.generated.json";
import { isoWeekKeyFromYmd, monthKeyFromYmd, ymdToDateUtc } from "@/lib/briefsDates";

// Majors
import { listMajorSlugs, listMajorYearParams } from "@/lib/majors";
import { listJuniorMajorSlugs } from "@/lib/juniorMajors";
import { listSeniorMajorSlugs } from "@/lib/seniorMajors";

// Event pages (mid-am tournaments + junior/senior brand event pages)
import { listMidAmTournamentSlugs } from "@/lib/tournaments/midam";

const BASE = "https://www.nichegolfhq.com";

type DailyBrief = {
  date: string;
  title: string;
  items: Array<{ title: string; url: string; source: string; why: string; tags?: string[] }>;
};

function getBriefs(): DailyBrief[] {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? (briefs as DailyBrief[]) : [];
}

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

  // Daily Briefs: include index + archives + each dated brief page
  const briefs = getBriefs();

  const briefIndexUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/briefs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE}/briefs/months`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE}/briefs/weeks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const monthKeys = Array.from(new Set(briefs.map((b) => monthKeyFromYmd(b.date)).filter(Boolean))).sort();
  const weekKeys = Array.from(new Set(briefs.map((b) => isoWeekKeyFromYmd(b.date)).filter(Boolean))).sort();

  const briefArchiveUrls: MetadataRoute.Sitemap = [
    ...monthKeys.map((mk) => ({
      url: `${BASE}/briefs/months/${mk}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...weekKeys.map((wk) => ({
      url: `${BASE}/briefs/weeks/${wk}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  const briefDateUrls: MetadataRoute.Sitemap = briefs.map((b) => {
    const dt = ymdToDateUtc(b.date);
    return {
      url: `${BASE}/briefs/${b.date}`,
      lastModified: dt || now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    };
  });

  // Majors hubs and detail pages
  const majorsUrls: MetadataRoute.Sitemap = [];

  // Cross-brand landing
  majorsUrls.push({
    url: `${BASE}/majors`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  });

  // Mid-am majors (with per-event + per-year)
  majorsUrls.push({
    url: `${BASE}/midamgolfhq/majors`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  });
  for (const slug of listMajorSlugs()) {
    majorsUrls.push({
      url: `${BASE}/midamgolfhq/majors/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    });
  }
  for (const p of listMajorYearParams()) {
    majorsUrls.push({
      url: `${BASE}/midamgolfhq/majors/${p.slug}/${p.year}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

  // Junior majors
  majorsUrls.push({
    url: `${BASE}/juniorgolfhq/majors`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  });
  for (const slug of listJuniorMajorSlugs()) {
    majorsUrls.push({
      url: `${BASE}/juniorgolfhq/majors/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    });
    majorsUrls.push({
      url: `${BASE}/juniorgolfhq/majors/${slug}/2026`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

  // Senior majors
  majorsUrls.push({
    url: `${BASE}/seniorgolfhq/majors`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  });
  for (const slug of listSeniorMajorSlugs()) {
    majorsUrls.push({
      url: `${BASE}/seniorgolfhq/majors/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    });
    majorsUrls.push({
      url: `${BASE}/seniorgolfhq/majors/${slug}/2026`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    });
  }

  // Event detail pages (mid-am, junior, senior)
  const eventUrls: MetadataRoute.Sitemap = [];

  for (const slug of listMidAmTournamentSlugs()) {
    eventUrls.push({
      url: `${BASE}/midamgolfhq/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  }
  for (const slug of listJuniorMajorSlugs()) {
    eventUrls.push({
      url: `${BASE}/juniorgolfhq/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  }
  for (const slug of listSeniorMajorSlugs()) {
    eventUrls.push({
      url: `${BASE}/seniorgolfhq/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  }

  // Issue URLs: pulled from Supabase so Google can crawl the full archive.
  // Best-effort: if Supabase isn't configured, sitemap still returns other URLs.
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

  return [
    ...staticUrls,
    ...brandUrls,
    ...briefIndexUrls,
    ...briefArchiveUrls,
    ...briefDateUrls,
    ...majorsUrls,
    ...eventUrls,
    ...issueUrls,
  ];
}
