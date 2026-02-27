import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import DailyBriefHero from "@/components/DailyBriefHero";
import EmailCapture from "@/components/EmailCapture";
import ChannelsSection from "@/components/ChannelsSection";
import { FEEDS } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { loadLatestBriefs } from "@/lib/briefs";
import { formatLongDate } from "@/lib/briefsDates";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function categoryFromTags(tags?: string[]) {
  const t = (tags || []).map((x) => String(x).toLowerCase());
  if (t.includes("senior") || t.includes("seniors")) return "SENIOR";
  if (t.includes("junior") || t.includes("juniors")) return "JUNIOR";
  return "MID-AM";
}

export default async function HomePage() {
  const feedResults = await Promise.all(FEEDS.map(async (f) => ({ feed: f, items: await fetchFeedItems(f.rssUrl, 2) })));

  const latestBrief = (loadLatestBriefs(10) || []).find((b) => (b.items || []).length > 0) ?? null;

  const briefItems = (latestBrief?.items || []).slice(0, 3).map((it) => ({
    category: categoryFromTags(it.tags),
    title: it.title,
    excerpt: (it.why || "").split("\n")[0],
    sourceUrl: it.url,
  }));

  const channels = feedResults.map(({ feed, items }) => ({ name: feed.name, slug: feed.slug, items }));

  return (
    <SiteShell>
      {latestBrief ? (
        <DailyBriefHero
          date={latestBrief.date}
          dateFormatted={formatLongDate(latestBrief.date)}
          items={briefItems}
          briefSlug={latestBrief.date}
        />
      ) : null}

      <EmailCapture />

      <ChannelsSection channels={channels} />
    </SiteShell>
  );
}
