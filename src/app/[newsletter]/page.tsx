import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { BeehiivEmbed } from "@/components/BeehiivEmbed";
import { FEEDS, getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import type { Metadata } from "next";

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
    description: feed.tagline || undefined,
    alternates: { canonical: `/${feed.slug}` },
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

  return (
    <SiteShell brandSlug={feed.slug}>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4">
              <Image
                src={`/brand/${feed.slug}/logo.png`}
                alt={`${feed.name} logo`}
                width={320}
                height={120}
                className="h-[54px] w-auto"
                priority={false}
              />
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">{feed.name}</h1>
            {feed.tagline ? <p className="max-w-2xl text-base leading-7 text-zinc-600">{feed.tagline}</p> : null}

            {/* socials moved to bottom */}
          </div>

          {feed.slug === "midamgolfhq" ? (
            <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <div className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">2026 Mid-Am Major Schedule</div>

                <Link
                  href="/midamgolfhq/schedule"
                  className="group relative inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800"
                >
                  <span>Open schedule</span>
                </Link>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            </div>
          ) : null}

          {feed.slug === "juniorgolfhq" ? (
            <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <div className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">2026 Junior Major Schedule</div>

                <Link
                  href="/juniorgolfhq/majors"
                  className="group relative inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800"
                >
                  <span>Open schedule</span>
                </Link>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            </div>
          ) : null}

          {feed.slug === "seniorgolfhq" ? (
            <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <div className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">2026 Senior Major Schedule</div>

                <Link
                  href="/seniorgolfhq/majors"
                  className="group relative inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800"
                >
                  <span>Open schedule</span>
                </Link>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12">
        <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-900">Latest issues</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.length ? (
            items.map((it) => <IssueCard key={it.link + it.title} item={it} newsletterSlug={feed.slug} />)
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              No posts yet (or RSS URL not configured).
            </div>
          )}
        </div>
      </section>

      {(feed.slug === "midamgolfhq" || feed.slug === "juniorgolfhq" || feed.slug === "seniorgolfhq") &&
      (feed.xProfileUrl || feed.instagramProfileUrl || feed.youtubeProfileUrl) ? (
        <section className="mx-auto w-full max-w-6xl px-5 pb-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <div className="text-center">
              <div className="text-sm font-semibold text-zinc-900">Follow</div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
                {feed.slug === "midamgolfhq" && feed.youtubeProfileUrl ? (
                  <Link
                    href={feed.youtubeProfileUrl}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-50"
                  >
                    YouTube
                  </Link>
                ) : null}
                {feed.xProfileUrl ? (
                  <Link
                    href={feed.xProfileUrl}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-50"
                  >
                    X
                  </Link>
                ) : null}
                {feed.instagramProfileUrl ? (
                  <Link
                    href={feed.instagramProfileUrl}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-50"
                  >
                    Instagram
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section id="subscribe" className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center md:text-left">
              <div className="text-sm font-semibold text-zinc-900">Subscribe</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Get {feed.name} in your inbox.</p>
              <div className="mt-4">
                <Link href="/subscribe" className="text-sm font-semibold text-zinc-900 underline underline-offset-2">
                  View all subscribe options →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-2">
              <BeehiivEmbed src={feed.subscribeEmbedUrl} height={feed.subscribeEmbedHeight} />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
