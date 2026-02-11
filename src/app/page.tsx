import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { FEEDS } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const results = await Promise.all(
    FEEDS.map(async (f) => ({ feed: f, items: await fetchFeedItems(f.rssUrl, 1) }))
  );

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-6xl px-5 py-16 text-center">
        <div className="grid grid-cols-1 gap-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Competitive golf beyond the mainstream
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Overlooked stories. Sharp opinions. Zero fluff.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-zinc-600">
              nichegolfHQ covers the corners of competitive amateur golf the mainstream ignores - with dedicated junior,
              mid-am, and senior amateur coverage across our channels.
            </p>
            {/* buttons removed */}
          </div>
        </div>
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
                    className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Newsletter
                  </Link>

                  {feed.xProfileUrl && (
                    <Link
                      href={feed.xProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                      X
                    </Link>
                  )}
                  {feed.instagramProfileUrl && (
                    <Link
                      href={feed.instagramProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
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
