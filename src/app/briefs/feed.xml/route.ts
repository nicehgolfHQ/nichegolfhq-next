import { NextResponse } from "next/server";
import { loadLatestBriefs } from "@/lib/briefs";

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
  const briefs = loadLatestBriefs(60);

  const items = briefs
    .map((b) => {
      const url = `${site}/briefs/${b.date}`;
      const title = b.title;
      const pubDate = new Date(`${b.date}T09:00:00-05:00`).toUTCString(); // anchor ~9am ET
      const desc = b.items
        .map((it) => `• ${it.title}${it.url ? ` — ${it.url}` : ""}\n  ${it.why}`)
        .join("\n\n");

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
    <title>nichegolfHQ Daily Briefs</title>
    <link>${site}/briefs</link>
    <description>Daily briefs from nichegolfHQ</description>
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
