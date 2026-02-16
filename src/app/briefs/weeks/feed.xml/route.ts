import { NextResponse } from "next/server";
import { listBriefDates } from "@/lib/briefs";
import { isoWeekKeyFromYmd, isoWeekStartEndFromKey, formatLongDate } from "@/lib/briefsDates";

export const dynamic = "force-static";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const site = "https://www.nichegolfhq.com";
  const dates = listBriefDates();

  const weeks = new Map<string, number>();
  for (const d of dates) {
    const wk = isoWeekKeyFromYmd(d);
    if (!wk) continue;
    weeks.set(wk, (weeks.get(wk) ?? 0) + 1);
  }

  const weekKeys = Array.from(weeks.keys()).sort((a, b) => (a < b ? 1 : -1)).slice(0, 60);

  const items = weekKeys
    .map((wk) => {
      const url = `${site}/briefs/weeks/${wk}`;
      const range = isoWeekStartEndFromKey(wk);
      const title = range ? `Week of ${formatLongDate(range.start)}` : `Week ${wk}`;
      const pubDate = range ? new Date(`${range.start}T09:00:00-05:00`).toUTCString() : new Date().toUTCString();
      const count = weeks.get(wk) ?? 0;
      const desc = `${count} brief${count === 1 ? "" : "s"}`;

      return [
        "<item>",
        `<title>${escapeXml(title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        `<pubDate>${pubDate}</pubDate>`,
        `<description>${escapeXml(desc)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>nichegolfHQ Weekly Brief Archives</title>
    <link>${site}/briefs/weeks</link>
    <description>Weekly archive pages for nichegolfHQ daily briefs</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
