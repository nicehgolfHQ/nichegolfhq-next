import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { FEEDS } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { loadLatestBriefs } from "@/lib/briefs";
import { formatLongDate } from "@/lib/briefsDates";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const results = await Promise.all(
    FEEDS.map(async (f) => ({ feed: f, items: await fetchFeedItems(f.rssUrl, 1) }))
  );

  const latestBrief = loadLatestBriefs(1)[0] ?? null;
  const briefPreviewItems = latestBrief?.items?.slice(0, 3) ?? [];

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-10 text-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Competitive golf beyond the mainstream
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Overlooked stories. Sharp opinions. Zero fluff.
            </h1>
          </div>
        </div>

        {/* Brief of the Day */}
        {latestBrief ? (
          <div className="mx-auto mt-10 w-full max-w-4xl">
            <Link
              href={`/briefs/${latestBrief.date}`}
              className="block overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:border-zinc-300"
            >
              <div className="relative px-6 py-8 sm:px-10">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
                <div className="relative text-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Daily Brief</div>
                  <div className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                    {formatLongDate(latestBrief.date)}
                  </div>
                  <div className="mt-4 text-sm font-medium text-zinc-700">
                    Open today’s brief →
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-4 text-center">
              <Link href="/briefs/weeks" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
                Weekly archive
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section id="latest" className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="flex items-end justify-center">
          <h2 className="text-xl font-semibold tracking-tight">Channels</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-10">
          {results.map(({ feed, items }) => (
            <div key={feed.slug} className="rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <Image
                  src={`/brand/${feed.slug}/logo.png`}
                  alt={`${feed.name} logo`}
                  width={275}
                  height={100}
                  className="h-[60px] w-auto"
                  priority={false}
                />
                <div className="text-base font-semibold tracking-tight md:text-lg">{feed.name}</div>

                <div className="flex w-full max-w-xs flex-wrap items-center justify-center gap-2 sm:flex-nowrap">
                  <Link
                    href={`/${feed.slug}#subscribe`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                  >
                    Newsletter
                  </Link>

                  {feed.xProfileUrl && (
                    <Link
                      href={feed.xProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                    >
                      X
                    </Link>
                  )}
                  {feed.instagramProfileUrl && (
                    <Link
                      href={feed.instagramProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                    >
                      Instagram
                    </Link>
                  )}
                </div>
              </div>

              <div className="mx-auto mt-5 grid w-full max-w-xl grid-cols-1 gap-4">
                {items.length ? (
                  items.map((it) => (
                    <IssueCard key={it.link + it.title} item={it} newsletterSlug={feed.slug} />
                  ))
                ) : (
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
                    No posts yet (or RSS URL not configured).
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
