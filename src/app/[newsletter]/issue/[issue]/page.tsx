import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { normalizeBeehiivHtml } from "@/lib/beehiiv";
import { getSupabaseServer } from "@/lib/supabaseServer";

export function generateStaticParams() {
  // Keep this lightweight for now. We can expand to generate recent issues later.
  return [];
}

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

function sanitizeHtml(input?: string) {
  // Delegate to cheerio-based Beehiiv normalizer for consistent, premium layout.
  return normalizeBeehiivHtml(input);
}

export async function generateMetadata({
  params,
}: {
  params: { newsletter: string; issue: string } | Promise<{ newsletter: string; issue: string }>;
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const feed = getFeedBySlug(resolved.newsletter);
  if (!feed) return { title: "nichegolfHQ" };

  const items = await fetchFeedItems(feed.rssUrl, 25);
  const found = items.find((it) => issueSlugFromUrl(it.link) === resolved.issue) || items[0];

  const description = cleanSnippet(found?.contentSnippet) || feed.tagline || `Newsletter issue from ${feed.name}.`;
  const title = found?.title ? `${found.title} | ${feed.name}` : `${feed.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${feed.slug}/issue/${resolved.issue}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.nichegolfhq.com/${feed.slug}/issue/${resolved.issue}`,
      siteName: "nichegolfHQ",
      images: found?.imageUrl ? [{ url: found.imageUrl }] : undefined,
    },
    twitter: {
      card: found?.imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: found?.imageUrl ? [found.imageUrl] : undefined,
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: { newsletter: string; issue: string } | Promise<{ newsletter: string; issue: string }>;
}) {
  const resolved = await Promise.resolve(params);
  const feed = getFeedBySlug(resolved.newsletter);

  if (!feed) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-5 py-14">
          <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        </div>
      </SiteShell>
    );
  }

  const supabase = getSupabaseServer();

  // 1) Try DB first (supports full history)
  let issue:
    | {
        newsletter_slug: string;
        issue_slug: string;
        title: string;
        published_at: string | null;
        beehiiv_url: string;
        content_html: string | null;
        excerpt: string | null;
        image_url: string | null;
      }
    | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("issues")
      .select("newsletter_slug,issue_slug,title,published_at,beehiiv_url,content_html,excerpt,image_url")
      .eq("newsletter_slug", feed.slug)
      .eq("issue_slug", resolved.issue)
      .maybeSingle();
    issue = (data as any) || null;
  }

  // 2) Fallback: fetch RSS and backfill into DB if possible
  if (!issue) {
    const items = await fetchFeedItems(feed.rssUrl, 200);
    const found = items.find((it) => issueSlugFromUrl(it.link) === resolved.issue);

    if (!found) {
      return (
        <SiteShell brandSlug={feed.slug}>
          <div className="mx-auto w-full max-w-3xl px-5 py-14">
            <h1 className="text-2xl font-semibold tracking-tight">Issue not found</h1>
            <p className="mt-2 text-sm text-zinc-600">This issue may be older than the current RSS window.</p>
            <div className="mt-6">
              <Link href={`/${feed.slug}`} className="text-sm font-medium text-zinc-900 underline underline-offset-2">
                back to {feed.name}
              </Link>
            </div>
          </div>
        </SiteShell>
      );
    }

    const excerpt = cleanSnippet(found.contentSnippet);
    const content_html = sanitizeHtml(found.contentHtml);

    issue = {
      newsletter_slug: feed.slug,
      issue_slug: resolved.issue,
      title: found.title,
      published_at: found.isoDate || null,
      beehiiv_url: found.link,
      content_html: content_html || null,
      excerpt: excerpt || null,
      image_url: found.imageUrl || null,
    };

    if (supabase) {
      // Upsert so we can backfill history progressively.
      await supabase.from("issues").upsert(issue as any, {
        onConflict: "newsletter_slug,issue_slug",
      });
    }
  }

  const snippet = cleanSnippet(issue.excerpt || undefined);
  const contentHtml = sanitizeHtml(issue.content_html || undefined);

  return (
    <SiteShell brandSlug={feed.slug}>
      <article className="w-full px-5 py-16">
        <div className="mx-auto w-full max-w-2xl">
          <header className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{feed.name}</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{issue.title}</h1>
          <div className="mt-3 text-sm text-zinc-500">
            {issue.published_at ? new Date(issue.published_at).toLocaleDateString() : ""}
          </div>
        </header>

          {contentHtml ? (
            <div className="mt-12 w-full rounded-3xl border border-zinc-200 bg-white px-7 py-8 md:px-10 md:py-10">
            <div
              className="issue-content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
          ) : snippet ? (
            <div className="mt-12 w-full rounded-3xl border border-zinc-200 bg-white px-7 py-8 md:px-10 md:py-10">
            <p className="text-base leading-7 text-zinc-700">{snippet}</p>
          </div>
          ) : null}

          <div className="mt-10">
            <Link
              href={`/${feed.slug}`}
              className="text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
            >
              back to {feed.name}
            </Link>
          </div>
        </div>
      </article>

      {/* Structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: issue.title,
            datePublished: issue.published_at,
            publisher: { "@type": "Organization", name: "nichegolfHQ" },
            mainEntityOfPage: `https://www.nichegolfhq.com/${feed.slug}/issue/${resolved.issue}`,
          }),
        }}
      />
    </SiteShell>
  );
}
