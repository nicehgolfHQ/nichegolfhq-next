import type { MetadataRoute } from "next";
import { FEEDS } from "@/lib/feeds";
import { getSupabaseServer } from "@/lib/supabaseServer";

import briefsData from "@/content/briefs.generated.json";
import { ymdToDateUtc } from "@/lib/briefsDates";

import { listMajorYearParams } from "@/lib/majors";
import { JUNIOR_MAJOR_EVENTS_2026 } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";
import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";

const BASE = "https://www.nichegolfhq.com";

type DailyBrief = {
  date: string;
  title: string;
  items: Array<{ title: string; url: string; source: string; why: string; tags?: string[] }>;
};

type NewsLike = { slug: string; date: string };
type EventLike = { slug: string; news?: NewsLike[] };

function getBriefs(): DailyBrief[] {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? (briefs as DailyBrief[]) : [];
}

function dateFromYmd(date: string | null | undefined): Date | undefined {
  const dt = ymdToDateUtc(date ?? "");
  return dt ?? undefined;
}

function latestNewsDate(news?: NewsLike[]): Date | undefined {
  let best: string | undefined;
  for (const item of news ?? []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue;
    if (!best || item.date > best) best = item.date;
  }
  return best ? dateFromYmd(best) : undefined;
}

function urlEntry(
  path: string,
  opts: {
    lastModified?: Date;
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }
): MetadataRoute.Sitemap[number] {
  const entry: MetadataRoute.Sitemap[number] = {
    url: path.startsWith("http") ? path : `${BASE}${path}`,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  };
  if (opts.lastModified && !Number.isNaN(opts.lastModified.getTime())) {
    entry.lastModified = opts.lastModified;
  }
  return entry;
}

function eventAndArticleUrls(events: EventLike[], channel: string): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const event of events) {
    urls.push(
      urlEntry(`/${channel}/${event.slug}`, {
        lastModified: latestNewsDate(event.news),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
    for (const article of event.news ?? []) {
      urls.push(
        urlEntry(`/${channel}/${event.slug}/${article.slug}`, {
          lastModified: dateFromYmd(article.date),
          changeFrequency: "monthly",
          priority: 0.7,
        })
      );
    }
  }
  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const briefs = getBriefs();
  const newestBrief = briefs.map((b) => b.date).sort().at(-1);

  const staticUrls: MetadataRoute.Sitemap = [
    urlEntry("/", { changeFrequency: "daily", priority: 1 }),
    urlEntry("/about", { changeFrequency: "monthly", priority: 0.5 }),
    urlEntry("/terms", { changeFrequency: "yearly", priority: 0.3 }),
    urlEntry("/privacy", { changeFrequency: "yearly", priority: 0.3 }),
    urlEntry("/contact", { changeFrequency: "monthly", priority: 0.4 }),
    urlEntry("/community", { changeFrequency: "monthly", priority: 0.4 }),
    urlEntry("/subscribe", { changeFrequency: "monthly", priority: 0.4 }),
    urlEntry("/sponsors", { changeFrequency: "monthly", priority: 0.4 }),
  ];

  const brandUrls = FEEDS.map((f) =>
    urlEntry(`/${f.slug}`, { changeFrequency: "daily", priority: 0.7 })
  );

  const briefIndexUrls: MetadataRoute.Sitemap = [
    urlEntry("/briefs", {
      lastModified: newestBrief ? dateFromYmd(newestBrief) : undefined,
      changeFrequency: "daily",
      priority: 0.7,
    }),
  ];

  const briefDateUrls: MetadataRoute.Sitemap = briefs.map((b) =>
    urlEntry(`/briefs/${b.date}`, {
      lastModified: dateFromYmd(b.date),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  // /midamgolfhq/majors and /midamgolfhq/majors/:slug redirect to the real hubs.
  // Junior and senior /majors/:slug and /majors/:slug/:year pages are thin placeholders
  // that 301 to the real hub, so they are omitted. The majors index pages stay.
  const majorsUrls: MetadataRoute.Sitemap = [
    urlEntry("/majors", { changeFrequency: "weekly", priority: 0.6 }),
    urlEntry("/juniorgolfhq/majors", { changeFrequency: "weekly", priority: 0.5 }),
    urlEntry("/seniorgolfhq/majors", { changeFrequency: "weekly", priority: 0.5 }),
  ];

  for (const p of listMajorYearParams()) {
    majorsUrls.push(
      urlEntry(`/midamgolfhq/majors/${p.slug}/${p.year}`, {
        changeFrequency: "yearly",
        priority: 0.4,
      })
    );
  }

  const eventUrls = [
    ...eventAndArticleUrls(MIDAM_TOURNAMENTS, "midamgolfhq"),
    ...eventAndArticleUrls(JUNIOR_MAJOR_EVENTS_2026, "juniorgolfhq"),
    ...eventAndArticleUrls(SENIOR_MAJOR_EVENTS_2026, "seniorgolfhq"),
  ];

  let issueUrls: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseServer();
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("issues")
      .select("newsletter_slug, issue_slug, published_at")
      .order("published_at", { ascending: false })
      .limit(5000);

    if (error) throw error;

    const seen = new Set<string>();
    issueUrls = (data || [])
      .filter((r) => r.newsletter_slug && r.issue_slug)
      .filter((r) => !String(r.issue_slug).includes("hello-world"))
      .map((r) => {
        const path = `/${r.newsletter_slug}/issue/${r.issue_slug}`;
        if (seen.has(path)) return null;
        seen.add(path);
        return urlEntry(path, {
          lastModified: r.published_at ? new Date(r.published_at) : undefined,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      })
      .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);
  } catch {
    // Sitemap still returns the rest of the site if Supabase is unavailable.
  }

  return [
    ...staticUrls,
    ...brandUrls,
    ...briefIndexUrls,
    ...briefDateUrls,
    ...majorsUrls,
    ...eventUrls,
    ...issueUrls,
  ];
}
