import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { BeehiivEmbed } from "@/components/BeehiivEmbed";
import { MidAmRankings } from "@/components/MidAmRankings";
import { AmateurRankings } from "@/components/AmateurRankings";
import { FEEDS, getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { listMidAmTournaments } from "@/lib/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";
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

/* hero images per brand (null = gradient-only fallback) */
const HERO_IMAGES: Record<string, string | null> = {
  midamgolfhq: "/brand/midamgolfhq/DJI_20260221154348_0766_D.jpeg",
  juniorgolfhq: null,
  seniorgolfhq: "/brand/midamgolfhq/IMG_8556.JPG",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseMonthNum(monthStr: string): number {
  const m = monthStr.split(/[\/\s]/)[0].toLowerCase();
  const idx = MONTH_NAMES.findIndex((n) => n.toLowerCase().startsWith(m));
  return idx >= 0 ? idx + 1 : 1;
}

type ScheduleItem = {
  slug: string;
  name: string;
  month: number;
  dates2026?: string;
  course?: string;
  location?: string;
  format?: string;
  note?: string;
  channel?: string;
};

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

  /* ---------- Schedule data (inline dropdown) ---------- */
  const tournaments: ScheduleItem[] =
    feed.slug === "midamgolfhq"
      ? listMidAmTournaments()
      : feed.slug === "juniorgolfhq"
        ? JUNIOR_MAJOR_EVENTS_2026.map((e) => ({
            slug: e.slug,
            name: e.name,
            channel: "junior" as const,
            month: parseMonthNum(e.month),
            dates2026: e.month,
          }))
        : feed.slug === "seniorgolfhq"
          ? SENIOR_MAJOR_EVENTS_2026.map((e) => ({
              slug: e.slug,
              name: e.name,
              channel: "senior" as const,
              month: parseMonthNum(e.month),
              dates2026: e.month,
              format: e.format,
            }))
          : [];
  const tournamentsByMonth = tournaments.reduce<
    Record<number, ScheduleItem[]>
  >((acc, t) => {
    acc[t.month] = acc[t.month] ?? [];
    acc[t.month].push(t);
    return acc;
  }, {});
  const scheduleMonths = Object.keys(tournamentsByMonth)
    .map((m) => Number(m))
    .sort((a, b) => a - b);

  const heroImage = HERO_IMAGES[feed.slug] ?? null;

  return (
    <SiteShell brandSlug={feed.slug}>
      {/* -- Fixed hero background (parallax effect) -- */}
      {heroImage ? (
        <div className="fixed inset-0 z-0">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={85}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        </div>
      )}

      {/* -- Hero content overlay -- */}
      <section className="relative z-10 flex min-h-[70vh] items-center justify-center px-5">
        <div className="mx-auto w-full max-w-6xl pb-14 pt-24 text-center">
          <h1
            className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {feed.name}
          </h1>

          {feed.tagline ? (
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/60">
              {feed.tagline}
            </p>
          ) : null}

          {scheduleLabel && scheduleMonths.length > 0 ? (
            <div className="mt-10">
              <details className="group flex flex-col items-center text-left" id="schedule-dropdown">
                <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10">
                  <span>{scheduleLabel}</span>
                  <svg
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div className="mt-6 w-[90vw] max-w-2xl rounded-2xl bg-black/70 backdrop-blur-xl p-4 shadow-2xl">
                  <div className="space-y-6">
                    {scheduleMonths.map((month) => (
                      <div key={month}>
                        <div className="mb-3 flex items-center gap-3 px-1">
                          <div className="h-px flex-1 bg-white/10" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                            {MONTH_NAMES[month - 1]}
                          </span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <div className="space-y-2">
                          {tournamentsByMonth[month]!.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/${feed.slug}/schedule/${t.slug}`}
                              className="group/evt flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3.5 transition hover:border-white/20 hover:bg-white/5"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-serif text-base font-semibold tracking-tight text-white">
                                  {t.name}
                                </div>
                                {(t.course || t.location) ? (
                                  <div className="mt-0.5 text-xs text-white/40">
                                    {[t.course, t.location].filter(Boolean).join(" \u2022 ")}
                                  </div>
                                ) : null}
                                {t.dates2026 ? (
                                  <div className="mt-1 text-xs text-white/30">{t.dates2026}</div>
                                ) : null}
                              </div>
                              <div className="shrink-0 text-sm text-white/30 transition group-hover/evt:translate-x-0.5 group-hover/evt:text-white/60" aria-hidden>
                                &rarr;
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          ) : scheduleLabel ? (
            <div className="mt-10">
              <Link
                href={feed.slug === "midamgolfhq" ? "/midamgolfhq/schedule" : feed.slug === "juniorgolfhq" ? "/juniorgolfhq/schedule" : "/seniorgolfhq/schedule"}
                className="inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
              >
                {scheduleLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* -- All content scrolls over the fixed hero -- */}
      <div className="relative z-10">
        {/* -- Latest Issue (single) -- */}
        <section className="px-5 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 drop-shadow-sm">
              Latest issue
            </h2>
            {items.length ? (
              <IssueCard item={items[0]} newsletterSlug={feed.slug} />
            ) : null}
          </div>
        </section>

        {/* -- Past Newsletter Issues + Subscribe (stacked collapsible buttons) -- */}
        <section className="px-5 pb-16 pt-2">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
              {/* Past Newsletter Issues toggle */}
              {monthKeys.length > 0 ? (
                <details className="group w-full" id="past-issues">
                  <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white">
                    <span>Past Newsletter Issues</span>
                    <svg
                      className="h-4 w-4 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>

                  <div className="mt-6 space-y-0 rounded-2xl bg-black/60 backdrop-blur-md p-1">
                    {monthKeys.map((mk) => (
                      <details
                        key={mk}
                        className="group/month border-b border-white/10 first:border-t first:rounded-t-2xl last:border-b-0 last:rounded-b-2xl"
                      >
                        <summary className="cursor-pointer list-none px-4 py-5 transition hover:bg-white/5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="font-serif text-lg font-semibold tracking-tight text-white">
                              {monthLabel(mk)}
                            </div>
                            <div
                              className={`text-xs font-semibold uppercase tracking-wider ${
                                mk === mostRecentMonth
                                  ? "text-white/60"
                                  : "text-white/30"
                              }`}
                            >
                              {mk === mostRecentMonth ? "Current" : "View"}
                            </div>
                          </div>
                        </summary>
                        <div className="px-2 pb-6 pt-2">
                          <div className="mx-auto max-w-5xl">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:justify-items-center">
                              {groups[mk].map((it) => (
                                <div
                                  key={it.link + it.title}
                                  className="w-full md:max-w-xl"
                                >
                                  <IssueCard
                                    item={it}
                                    newsletterSlug={feed.slug}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              ) : null}

              {/* Subscribe toggle */}
              <details className="group w-full" id="subscribe">
                <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/60 transition hover:border-white/30 hover:text-white">
                  <span>Subscribe</span>
                  <svg
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-6 rounded-2xl bg-black/60 backdrop-blur-md p-8">
                  <BeehiivEmbed
                    src={feed.subscribeEmbedUrl}
                    height={feed.subscribeEmbedHeight}
                  />
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* -- Rankings -- */}
        {feed.slug === "midamgolfhq" ? (
          <section className="px-5 pb-16">
            <div className="mx-auto max-w-4xl">
              <MidAmRankings />
            </div>
          </section>
        ) : feed.slug === "juniorgolfhq" || feed.slug === "seniorgolfhq" ? (
          <section className="px-5 pb-16">
            <div className="mx-auto max-w-4xl">
              <AmateurRankings brand={feed.slug} />
            </div>
          </section>
        ) : null}

        {/* -- Socials -- */}
        {(feed.slug === "midamgolfhq" ||
          feed.slug === "juniorgolfhq" ||
          feed.slug === "seniorgolfhq") &&
        (feed.xProfileUrl ||
          feed.instagramProfileUrl ||
          feed.youtubeProfileUrl) ? (
          <section className="px-5 py-12">
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
      </div>
    </SiteShell>
  );
}
