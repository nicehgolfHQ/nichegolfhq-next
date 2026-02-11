import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { BeehiivEmbed } from "@/components/BeehiivEmbed";
import { FEEDS, getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import type { Metadata } from "next";
// import Script from "next/script";

export function generateStaticParams() {
  return FEEDS.map((f) => ({ newsletter: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { newsletter: string } | Promise<{ newsletter: string }>;
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const feed = getFeedBySlug(resolved.newsletter);
  if (!feed) return { title: "nichegolfHQ" };
  return {
    title: `${feed.name} — nichegolfHQ`,
    description: feed.tagline,
    alternates: {
      canonical: `/${feed.slug}`,
    },
  };
}

export default async function NewsletterPage({
  params,
}: {
  params: { newsletter: string } | Promise<{ newsletter: string }>;
}) {
  const resolved = await Promise.resolve(params);
  const feed = getFeedBySlug(resolved.newsletter);

  if (!feed) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <h1 className="text-2xl font-semibold">Not found</h1>
        </div>
      </SiteShell>
    );
  }

  const items = await fetchFeedItems(feed.rssUrl, 12);

  const showSocial = false; // temporarily disabled (X embed + IG)

  // Instagram (server-side). Only renders when configured.
  const igToken = process.env.IG_GRAPH_ACCESS_TOKEN;
  const igBusinessId = feed.instagramBusinessAccountId;

  let igItems:
    | Array<{
        id: string;
        caption?: string;
        media_type?: string;
        media_url?: string;
        thumbnail_url?: string;
        permalink?: string;
        timestamp?: string;
      }>
    | null = null;

  if (igToken && igBusinessId) {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp",
    ].join(",");

    const url = new URL(`https://graph.facebook.com/v19.0/${igBusinessId}/media`);
    url.searchParams.set("fields", fields);
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", igToken);

    try {
      const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
      if (res.ok) {
        const json = await res.json();
        igItems = Array.isArray(json?.data) ? json.data : [];
      }
    } catch {
      // ignore
    }
  }

  return (
    <SiteShell brandSlug={feed.slug}>
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-xs font-semibold tracking-wider text-zinc-600">
            {feed.name}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            latest newsletter volumes
          </h1>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.length ? (
            items.map((it) => <IssueCard key={it.link + it.title} item={it} newsletterSlug={feed.slug} />)
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No posts yet (or RSS URL not configured). Once we drop in the BeeHiiv RSS URL, this will populate automatically.
            </div>
          )}
        </div>

        {showSocial ? (
          <section className="mt-14">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">latest on x</div>
                  {feed.xProfileUrl ? (
                    <a
                      href={feed.xProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      view profile
                    </a>
                  ) : null}
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  {feed.xProfileUrl ? (
                    <div className="h-[560px] overflow-hidden">
                      <a
                        className="twitter-timeline"
                        data-height="560"
                        data-dnt="true"
                        data-theme="light"
                        href={feed.xProfileUrl}
                      >
                        posts by {feed.name}
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-zinc-600">X profile not set.</div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-900">latest on instagram</div>
                  {feed.instagramProfileUrl ? (
                    <a
                      href={feed.instagramProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      view profile
                    </a>
                  ) : null}
                </div>

                {igItems && igItems.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {igItems.map((it) => {
                      const src = it.media_type === "VIDEO" ? it.thumbnail_url : it.media_url;
                      if (!src || !it.permalink) return null;

                      return (
                        <a
                          key={it.id}
                          href={it.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                          title={it.caption || "instagram"}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={it.caption || "instagram"}
                            className="h-36 w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                    Instagram feed will appear here once each brand is connected to a Facebook Page (Meta) and we drop in the IG Graph
                    credentials.
                  </div>
                )}
              </div>
            </div>

            {/* X widgets script */}
            {/* <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" /> */}
          </section>
        ) : null}

        <div id="subscribe" className="mt-14 rounded-3xl border border-zinc-200 bg-white p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <div className="text-sm font-semibold text-zinc-900">Subscribe</div>
              <p className="mt-2 text-sm text-zinc-600">Get {feed.name} in your inbox. Free.</p>
              <p className="mt-2 text-xs text-zinc-500">No spam. Unsubscribe anytime.</p>

              {(feed.xProfileUrl || feed.instagramProfileUrl) && (
                <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-center">
                  {feed.xProfileUrl && (
                    <a
                      href={feed.xProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      X
                    </a>
                  )}
                  {feed.instagramProfileUrl && (
                    <a
                      href={feed.instagramProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="w-full md:max-w-lg">
              <BeehiivEmbed src={feed.subscribeEmbedUrl} height={feed.subscribeEmbedHeight} title={`${feed.name} subscribe`} />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center justify-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">explore</div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {FEEDS.filter((f) => f.slug !== feed.slug).map((f) => (
              <Link
                key={f.slug}
                href={`/${f.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                {f.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
