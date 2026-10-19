import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { getFeedBySlug } from "@/lib/feeds";
import { normalizeBeehiivHtml } from "@/lib/beehiiv";
import { loadIssue } from "@/lib/issues";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/structuredData";

export function generateStaticParams() {
  // Issues render on demand, then cache. An empty list keeps the build light.
  return [];
}

function cleanSnippet(input?: string | null) {
  if (!input) return "";
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\s*[—–\-_=*•·]{3,}\s*/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: { newsletter: string; issue: string } | Promise<{ newsletter: string; issue: string }>;
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const feed = getFeedBySlug(resolved.newsletter);
  if (!feed) return { title: "Not found" };

  const issue = await loadIssue(feed.slug, resolved.issue);
  if (!issue) return { title: "Not found" };

  const description =
    cleanSnippet(issue.excerpt) || feed.tagline || `Newsletter issue from ${feed.name}.`;
  const title = issue.title ? `${issue.title} | ${feed.name}` : feed.name;
  const image = issue.image_url || DEFAULT_OG_IMAGE;
  const url = `https://www.nichegolfhq.com/${feed.slug}/issue/${issue.issue_slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/${feed.slug}/issue/${issue.issue_slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "nichegolfHQ",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
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
  if (!feed) notFound();

  const issue = await loadIssue(feed.slug, resolved.issue);
  if (!issue) notFound();

  const snippet = cleanSnippet(issue.excerpt);
  const contentHtml = normalizeBeehiivHtml(issue.content_html || undefined);
  const pageUrl = `https://www.nichegolfhq.com/${feed.slug}/issue/${issue.issue_slug}`;
  const description = snippet || feed.tagline || issue.title;

  return (
    <SiteShell brandSlug={feed.slug}>
      <article className="w-full px-5 py-16">
        <div className="mx-auto w-full max-w-2xl">
          <header className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{feed.name}</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{issue.title}</h1>
            <div className="mt-3 text-sm text-zinc-500">
              {issue.published_at ? (
                <time dateTime={issue.published_at}>
                  {new Date(issue.published_at).toLocaleDateString()}
                </time>
              ) : null}
            </div>
          </header>

          {contentHtml ? (
            <div className="mt-12 w-full rounded-3xl border border-zinc-200 bg-white px-7 py-8 md:px-10 md:py-10">
              <div
                className="issue-content"
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

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: issue.title,
          description,
          datePublished: issue.published_at || undefined,
          image: issue.image_url ? [issue.image_url] : [DEFAULT_OG_IMAGE],
          author: { "@type": "Organization", name: feed.name },
          publisher: {
            "@type": "Organization",
            name: "nichegolfHQ",
            url: "https://www.nichegolfhq.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.nichegolfhq.com/brand/nichegolfhq/icon.png",
            },
          },
          mainEntityOfPage: pageUrl,
        }}
      />
    </SiteShell>
  );
}
