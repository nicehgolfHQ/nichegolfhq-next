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
    title: feed.name,
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

  const items = await fetchFeedItems(feed.rssUrl, 24);

  const monthKey = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const monthLabel = (key: string) => {
    const [y, m] = key.split("-").map((n) => Number(n));
    const d = new Date(y, (m || 1) - 1, 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const groups = items.reduce<Record<string, typeof items>>((acc, it) => {
    const k = monthKey(it.isoDate);
    if (!k) return acc;
    acc[k] = acc[k] ?? [];
    acc[k].push(it);
    return acc;
  }, {});

  const monthKeys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));
  const mostRecentMonth = monthKeys[0] || "";

  const scheduleLabel =
    feed.slug === "midamgolfhq"
      ? "2026 Mid-Am Major Schedule"
      : feed.slug === "juniorgolfhq"
        ? "2026 Junior Major Schedule"
        : feed.slug === "seniorgolfhq"
          ? "2026 Senior Major Schedule"
          : null;

  const scheduleHref =
    feed.slug === "midamgolfhq"
      ? "/midamgolfhq/schedule"
      : feed.slug === "juniorgolfhq"
        ? "/juniorgolfhq/schedule"
        : feed.slug === "seniorgolfhq"
          ? "/seniorgolfhq/schedule"
          : null;

  return (
    <SiteShell brandSlug={feed.slug}>
      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-20 text-center">
          <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Image
              src={`/brand/${feed.slug}/logo.png`}
              alt={`${feed.name} logo`}
              width={320}
              height={120}
              className="h-[40px] w-auto brightness-0 invert"
              priority={false}
            />
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {feed.name}
          </h1>
          {feed.tagline ? (
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/50">
              {feed.tagline}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {scheduleLabel && scheduleHref ? (
              <Link
                href={scheduleHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
              >
                <span>{scheduleLabel}</span>
                <span aria-hidden>&rarr;</span>
              </Link>
            ) : null}
            <Link
              href="#subscribe"
              className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      {/* -- Latest Issues (dark) -- */}
      <section className="bg-zinc-950 px-5 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Latest issues
          </h2>
          {items.length ? (
            <div className={items.slice(0, 2).length === 1 ? "mx-auto max-w-2xl" : ""}>
              <div
                className={
                  items.slice(0, 2).length === 1
                    ? "grid grid-cols-1 gap-5"
                    : "grid grid-cols-1 gap-5 md:grid-cols-2"
                }
              >
                {items.slice(0, 2).map((it) => (
                  <IssueCard key={it.link + it.title} item={it} newsletterSlug={feed.slug} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* -- Monthly Archive (slightly lighter dark) -- */}
      <section className="bg-zinc-900 px-5 pb-16 pt-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Archive
          </h2>
          <div className="space-y-0">
            {monthKeys.length ? (
              monthKeys.map((mk) => (
                <details
                  key={mk}
                  className="group border-b border-white/10 first:border-t"
                >
                  <summary className="cursor-pointer list-none px-2 py-5 transition hover:bg-white/5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-serif text-lg font-semibold tracking-tight text-white">
                        {monthLabel(mk)}
                      </div>
                      <div
                        className={`text-xs font-semibold uppercase tracking-wider ${mk === mostRecentMonth ? "text-white/60" : "text-white/30"}`}
                      >
                        {mk === mostRecentMonth ? "Current" : "View"}
                      </div>
                    </div>
                  </summary>
                  <div className="px-2 pb-6 pt-2">
                    <div className="mx-auto max-w-5xl">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:justify-items-center">
                        {groups[mk]!.map((it) => (
                          <div key={it.link + it.title} className="w-full md:max-w-xl">
                            <IssueCard item={it} newsletterSlug={feed.slug} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/40">
                No posts yet (or RSS URL not configured).
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -- Subscribe -- */}
      <section id="subscribe" className="scroll-mt-16 bg-zinc-950 px-5 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Subscribe
          </h2>
          <BeehiivEmbed
            src={feed.subscribeEmbedUrl}
            height={feed.subscribeEmbedHeight}
          />
        </div>
      </section>

      {/* -- Socials -- */}
      {(feed.slug === "midamgolfhq" ||
        feed.slug === "juniorgolfhq" ||
        feed.slug === "seniorgolfhq") &&
      (feed.xProfileUrl || feed.instagramProfileUrl || feed.youtubeProfileUrl) ? (
        <section className="border-t border-white/10 bg-zinc-950 px-5 py-12">
          <div className="text-center">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/30">
              Follow
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {feed.slug === "midamgolfhq" && feed.youtubeProfileUrl ? (
                <Link
                  href={feed.youtubeProfileUrl}
                  className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  YouTube
                </Link>
              ) : null}
              {feed.xProfileUrl ? (
                <Link
                  href={feed.xProfileUrl}
                  className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  X
                </Link>
              ) : null}
              {feed.instagramProfileUrl ? (
                <Link
                  href={feed.instagramProfileUrl}
                  className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  Instagram
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
