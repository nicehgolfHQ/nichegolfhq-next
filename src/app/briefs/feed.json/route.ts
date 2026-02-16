import { NextResponse } from "next/server";
import { loadLatestBriefs } from "@/lib/briefs";

export const dynamic = "force-static";

export function GET() {
  const site = "https://www.nichegolfhq.com";
  const briefs = loadLatestBriefs(60);

  return NextResponse.json(
    {
      version: "1.0",
      title: "nichegolfHQ Daily Briefs",
      home_page_url: `${site}/briefs`,
      feed_url: `${site}/briefs/feed.json`,
      items: briefs.map((b) => ({
        id: `${site}/briefs/${b.date}`,
        url: `${site}/briefs/${b.date}`,
        title: b.title,
        date_published: `${b.date}T09:00:00-05:00`,
        summary: `${b.items.length} items`,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
