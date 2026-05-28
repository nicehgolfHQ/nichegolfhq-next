import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { IssueCard } from "@/components/IssueCard";
import { TournamentTicker } from "@/components/TournamentTicker";
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
  const results = await Promise.all(
    FEEDS.map(async (f) => ({
      feed: f,
      items: await fetchFeedItems(f.rssUrl, 2),
    }))
  );

  const latestBrief =
    (loadLatestBriefs(10) || []).find((b) => (b.items || []).length > 0) ??
    null;

  const briefHeadlineCount = latestBrief?.items?.length ?? 0;
  const briefLanes = (() => {
    const lanes = new Set<"junior" | "midam" | "senior">();
    for (const it of latestBrief?.items ?? []) {
      const t = (it.tags || []).map((x) => String(x).toLowerCase());
      if (t.includes("junior") || t.includes("juniors")) lanes.add("junior");
      else if (t.includes("senior") || t.includes("seniors")) lanes.add("senior");
      else lanes.add("midam");
    }
    const order: Array<"junior" | "midam" | "senior"> = ["junior", "midam", "senior"];
    const labels: Record<"junior" | "midam" | "senior", string> = {
      junior: "junior",
      midam: "mid-am",
      senior: "senior",
    };
    const present = order.filter((l) => lanes.has(l)).map((l) => labels[l]);
    if (present.length === 0) return "amateur golf";
    if (present.length === 1) return `${present[0]} amateur golf`;
    const head = present.slice(0, -1).join(", ");
    return `${head} & ${present[present.length - 1]} amateur golf`;
  })();

  const tickerCards = getTickerCards();

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

      <section className="relative z-10 w-full h-[65vh] flex items-center justify-center">
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs tracking-[0.15em] uppercase text-center animate-pulse">
          Scroll
          <div className="w-px h-10 bg-white/30 mx-auto mt-2" />
        </div>
      </section>

      {/* Page content with solid background */}
      <div className="relative z-10">
        {/* Cross-channel tournament tracker (Junior / Mid-Am / Senior) */}
        <TournamentTicker cards={tickerCards} />

        {/* Daily Brief — compact card */}
        {latestBrief ? (
          <section
            className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6"
            aria-label="Latest Daily Brief"
          >
            <div className="mb-3 text-center">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                Daily Brief
              </h2>
            </div>

            <Link
              href={`/briefs/${latestBrief.date}`}
              className="group/brief mx-auto flex w-full max-w-xs flex-col items-center rounded-2xl bg-white/95 px-4 py-3 text-center shadow-sm ring-1 ring-zinc-200 backdrop-blur transition hover:bg-white md:max-w-md"
              style={{ borderTop: "3px solid #b91c1c" }}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center rounded-sm bg-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  Today
                </span>
                <span className="text-zinc-300">·</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">
                  {formatLongDate(latestBrief.date)}
                </span>
              </div>

              <div className="mt-1.5 font-serif text-sm font-semibold leading-snug text-zinc-950">
                {briefHeadlineCount > 0
                  ? `${briefHeadlineCount} ${briefHeadlineCount === 1 ? "headline" : "headlines"} from ${briefLanes}`
                  : "Your daily news source across amateur golf"}
              </div>

              <span className="mt-2 inline-flex items-center rounded-full border border-zinc-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-800 transition group-hover/brief:border-zinc-400 group-hover/brief:bg-zinc-50">
                Read full brief →
              </span>
            </Link>
          </section>
        ) : null}

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
