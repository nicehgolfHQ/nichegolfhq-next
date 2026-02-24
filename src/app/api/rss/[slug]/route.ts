import { NextResponse } from "next/server";
import { getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const feed = getFeedBySlug(slug);
  if (!feed) {
    return NextResponse.json({ error: "unknown_feed" }, { status: 404 });
  }

  const items = await fetchFeedItems(feed.rssUrl, 8);
  return NextResponse.json({
    slug: feed.slug,
    name: feed.name,
    tagline: feed.tagline,
    items,
  });
}
