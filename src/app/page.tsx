import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { UnifiedScoreboard } from "@/components/UnifiedScoreboard";
import { FEEDS } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";
import { loadLatestBriefs } from "@/lib/briefs";
import { formatLongDate } from "@/lib/briefsDates";
import { getTickerCards } from "@/lib/tournaments/ticker";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* ── JSON-LD structured data for the homepage ─────────────────────── */
const BASE = "https://www.nichegolfhq.com";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "nichegolfHQ",
  url: BASE,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/brand/nichegolfhq/logo-v2.png`,
  },
  image: `${BASE}/og/og-nichegolfhq.png`,
  description:
    "Independent media and intelligence platform covering competitive amateur golf — junior, mid-amateur, and senior events.",
  foundingDate: "2019",
  sameAs: [
    "https://www.x.com/midamgolfhq",
    "https://www.instagram.com/midamgolfhq",
    "https://www.x.com/juniorgolfhq",
    "https://www.instagram.com/juniorgolfhq",
    "https://www.x.com/seniorgolfhq",
    "https://www.instagram.com/seniorgolfhq",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${BASE}/contact`,
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  name: "nichegolfHQ",
  url: BASE,
  publisher: { "@id": `${BASE}/#organization` },
};

export default async function Home() {
  const channelOrder: Record<string, number> = { junior: 0, midam: 1, senior: 2 };
  const results = (
    await Promise.all(
      FEEDS.map(async (f) => ({
        feed: f,
        items: await fetchFeedItems(f.rssUrl, 2),
      }))
    )
  ).sort((a, b) => (channelOrder[a.feed.key] ?? 99) - (channelOrder[b.feed.key] ?? 99));

  const latestBrief =
    (loadLatestBriefs(10) || []).find((b) => (b.items || []).length > 0) ??
    null;

  const tickerCards = getTickerCards();

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const todayLabel = formatLongDate(todayIso);
  const briefHref = latestBrief ? `/briefs/${latestBrief.date}` : null;

  return (
    <SiteShell>
      {/* ── Structured data ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />

      {/* ======= HERO VIDEO ======= */}
      <section className="fixed inset-0 z-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </section>

      <section className="relative z-10 w-full h-[38vh] flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-3xl">
          <h1
            className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            nichegolfHQ
          </h1>
          <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase text-white/80 mb-4">
            The home of competitive amateur golf
          </p>
        </div>
      </section>

      {/* Page content with solid background */}
      <div className="relative z-10">
        {/* Unified scoreboard: cross-channel tracker + today's brief */}
        <UnifiedScoreboard
          cards={tickerCards}
          dateLabel={todayLabel}
          briefHref={briefHref}
        />

        {/* Channels */}
        <section className="mx-auto w-full max-w-6xl px-5 py-14">
          <div className="text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">
              Channels
            </h2>
          </div>
          <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3">
            {results.map(({ feed, items }) => (
              <details key={feed.slug} className="group w-full">
                <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-3 transition hover:border-white/30">
                  <Image
                    src={`/brand/${feed.slug}/logo.png`}
                    alt={`${feed.name} logo`}
                    width={130}
                    height={48}
                    className="h-[28px] w-auto"
                    priority={false}
                  />
                  <span className="text-sm font-medium text-white/60 transition group-hover:text-white">
                    {feed.name}
                  </span>
                  <svg
                    className="h-4 w-4 text-white/40 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <div className="mt-4 rounded-2xl bg-black/60 p-4 backdrop-blur-md">
                  <div className="grid grid-cols-1 gap-4">
                    {items.length ? (
                      items.map((it) => (
                        <IssueCard
                          key={it.link + it.title}
                          item={it}
                          newsletterSlug={feed.slug}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-white/10 p-4 text-center text-sm text-white/40">
                        No posts yet.
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={`/${feed.slug}`}
                      className="text-xs text-white/30 underline underline-offset-2 transition hover:text-white/50"
                    >
                      View all {feed.name} &rarr;
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
