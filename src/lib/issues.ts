import { cache } from "react";
import { getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { normalizeBeehiivHtml } from "@/lib/beehiiv";
import { getSupabaseServer } from "@/lib/supabaseServer";

export type IssueRecord = {
  newsletter_slug: string;
  issue_slug: string;
  title: string;
  published_at: string | null;
  beehiiv_url: string;
  content_html: string | null;
  excerpt: string | null;
  image_url: string | null;
};

function issueSlugFromUrl(urlStr: string): string {
  try {
    const u = new URL(urlStr);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "issue";
  } catch {
    return "issue";
  }
}

function cleanSnippet(input?: string) {
  if (!input) return "";
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\s*[—–\-_=*•·]{3,}\s*/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * The issue page body and its metadata both call this.
 * Supabase is the source of truth. RSS is only a backfill when that row is missing.
 */
export const loadIssue = cache(async function loadIssue(
  newsletter: string,
  issueSlug: string
): Promise<IssueRecord | null> {
  const feed = getFeedBySlug(newsletter);
  if (!feed) return null;

  const supabase = getSupabaseServer();

  if (supabase) {
    const { data } = await supabase
      .from("issues")
      .select("newsletter_slug,issue_slug,title,published_at,beehiiv_url,content_html,excerpt,image_url")
      .eq("newsletter_slug", feed.slug)
      .eq("issue_slug", issueSlug)
      .maybeSingle();

    if (data?.issue_slug) return data as IssueRecord;
  }

  const items = await fetchFeedItems(feed.rssUrl, 200);
  const found = items.find((it) => issueSlugFromUrl(it.link) === issueSlug);
  if (!found) return null;

  const issue: IssueRecord = {
    newsletter_slug: feed.slug,
    issue_slug: issueSlug,
    title: found.title,
    published_at: found.isoDate || null,
    beehiiv_url: found.link,
    content_html: normalizeBeehiivHtml(found.contentHtml) || null,
    excerpt: cleanSnippet(found.contentSnippet) || null,
    image_url: found.imageUrl || null,
  };

  if (supabase) {
    await supabase.from("issues").upsert(issue, { onConflict: "newsletter_slug,issue_slug" });
  }

  return issue;
});
