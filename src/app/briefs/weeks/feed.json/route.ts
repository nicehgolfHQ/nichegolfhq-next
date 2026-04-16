import { NextResponse } from "next/server";
import { listBriefDates } from "@/lib/briefs";
import { isoWeekKeyFromYmd, isoWeekStartEndFromKey, formatLongDate } from "@/lib/briefsDates";

export const dynamic = "force-static";

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

  return NextResponse.json(
    {
      version: "1.0",
      title: "nichegolfHQ Weekly Brief Archives",
      home_page_url: `${site}/briefs/weeks`,
      feed_url: `${site}/briefs/weeks/feed.json`,
      items: weekKeys.map((wk) => {
        const range = isoWeekStartEndFromKey(wk);
        const title = range ? `Week of ${formatLongDate(range.start)}` : `Week ${wk}`;
        const count = weeks.get(wk) ?? 0;
        return {
          id: `${site}/briefs/weeks/${wk}`,
          url: `${site}/briefs/weeks/${wk}`,
          title,
          date_published: range ? `${range.start}T09:00:00-05:00` : undefined,
          summary: `${count} brief${count === 1 ? "" : "s"}`,
        };
      }),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
