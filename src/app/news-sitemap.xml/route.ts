import { NextResponse } from "next/server";
import { loadLatestBriefs } from "@/lib/briefs";
import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";

export const dynamic = "force-dynamic";

const SITE = "https://www.nichegolfhq.com";
const WINDOW_HOURS = 48;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ymdToUtcIso(date: string, hour = 9): string | null {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), hour, 0, 0));
  return dt.toISOString();
}

type Entry = { loc: string; title: string; pubDateIso: string; pubDateMs: number };

export function GET() {
  const now = Date.now();
  const cutoff = now - WINDOW_HOURS * 60 * 60 * 1000;
  const entries: Entry[] = [];

  // Daily briefs from the last 48 hours
  const briefs = loadLatestBriefs(10);
  for (const b of briefs) {
    const iso = ymdToUtcIso(b.date, 14); // ~9am ET
    if (!iso) continue;
    const ms = Date.parse(iso);
    if (Number.isNaN(ms) || ms < cutoff) continue;
    entries.push({
      loc: `${SITE}/briefs/${b.date}`,
      title: b.title,
      pubDateIso: iso,
      pubDateMs: ms,
    });
  }

  // Tournament news articles
  const tournamentGroups: Array<{
    list: { slug: string; news?: { slug: string; title: string; date: string }[] }[];
    base: string;
  }> = [
    { list: MIDAM_TOURNAMENTS as any, base: "midamgolfhq" },
    { list: JUNIOR_MAJOR_EVENTS_2026 as any, base: "juniorgolfhq" },
    { list: SENIOR_MAJOR_EVENTS_2026 as any, base: "seniorgolfhq" },
  ];

  for (const g of tournamentGroups) {
    for (const t of g.list) {
      if (!t.news) continue;
      for (const a of t.news) {
        const iso = ymdToUtcIso(a.date, 14);
        if (!iso) continue;
        const ms = Date.parse(iso);
        if (Number.isNaN(ms) || ms < cutoff) continue;
        entries.push({
          loc: `${SITE}/${g.base}/${t.slug}/${a.slug}`,
          title: a.title,
          pubDateIso: iso,
          pubDateMs: ms,
        });
      }
    }
  }

  entries.sort((a, b) => b.pubDateMs - a.pubDateMs);

  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>nichegolfHQ</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${e.pubDateIso}</news:publication_date>\n      <news:title>${escapeXml(e.title)}</news:title>\n    </news:news>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
