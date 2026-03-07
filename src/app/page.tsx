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
  alternates: { canonical: "/" },
};

function laneFor(tags?: string[]) {
  const t = (tags || []).map((x) => String(x).toLowerCase());
  if (t.includes("junior") || t.includes("juniors")) return { label: "JUNIOR", color: "#8b4513" };
  if (t.includes("senior") || t.includes("seniors")) return { label: "SENIOR", color: "#2d6a4f" };
  return { label: "MID-AM", color: "#1a1a2e" };
}

export default async function Home() {
  const results = await Promise.all(
    FEEDS.map(async (f) => ({ feed: f, items: await fetchFeedItems(f.rssUrl, 2) }))
  );

  const latestBrief = (loadLatestBriefs(10) || []).find((b) => (b.items || []).length > 0) ?? null;
  const briefPreviewItems = latestBrief?.items?.slice(0, 3) ?? [];

  return (
    <SiteShell>
      {/* ======= HERO VIDEO ======= */}
      <section className="relative w-full h-screen -mt-[73px] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <h1
            className="font-serif text-5xl md:text-7xl font-bold tracking-wide mb-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            niche<span className="font-normal italic opacity-85">golf</span>HQ
          </h1>
          <p className="text-base md:text-lg font-light tracking-[0.15em] uppercase text-white/80 mb-10">
            The home of competitive amateur golf
          </p>
          <nav className="flex gap-4 md:gap-8 justify-center flex-wrap">
            {[
              { label: "Junior", href: "/juniorgolfhq" },
              { label: "Mid-Am", href: "/midamgolfhq" },
              { label: "Senior", href: "/seniorgolfhq" },
              { label: "Daily Briefs", href: "/briefs" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white text-xs md:text-sm font-medium tracking-[0.1em] uppercase px-4 py-3 md:px-6 md:py-3 border border-white/30 rounded-sm backdrop-blur-sm bg-white/5 hover:bg-white/15 hover:border-white/60 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 text-xs tracking-[0.15em] uppercase text-center animate-pulse">
          Scroll
          <div className="w-px h-10 bg-white/30 mx-auto mt-2" />
        </div>
      </section>

      {/* Daily Brief first */}
      {latestBrief ? (
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="inline-flex items-center rounded-sm bg-red-700 px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                Daily Brief
              </span>
              <span className="text-sm font-bold text-zinc-600">{formatLongDate(latestBrief.date)}</span>
            </div>

            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
              {latestBrief.title
                ?.replace(/^\"|\"$/g, "")
                .replace(/^Daily Brief\s+—\s+.+$/i, "Daily Brief")}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-7 text-zinc-600">
              Your daily news source across amateur golf
            </p>

            <div className="brief-grid mt-7 grid grid-cols-1 gap-4 text-left md:grid-cols-3 md:text-left">
              {briefPreviewItems.map((it) => {
                const lane = laneFor(it.tags);
                const why = (it.why || "").split("\n")[0];
                return (
                  <div
                    key={it.url + it.title}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-center"
                    style={{ borderTop: `3px solid ${lane.color}` }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: lane.color }}>
                      {lane.label}
                    </div>
                    <div className="mt-2 font-serif text-[16px] font-semibold leading-snug text-zinc-950">{it.title}</div>
                    {why ? <p className="mt-3 text-sm leading-6 text-zinc-600">{why}</p> : null}
                    <div className="mt-3 flex justify-center">
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-xs font-semibold"
                        style={{ color: lane.color }}
                      >
                        Read →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href={`/briefs/${latestBrief.date}`}
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Read full brief →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Channels */}
      <section className="mx-auto w-full max-w-6xl px-5 py-14">
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-900">Channels</h2>
        </div>

        <div className="mt-6 flex flex-col gap-7">
          {results.map(({ feed, items }) => (
            <div key={feed.slug} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
              <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                  <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                    <Image
                      src={`/brand/${feed.slug}/logo.png`}
                      alt={`${feed.name} logo`}
                      width={260}
                      height={96}
                      className="h-[44px] w-auto"
                      priority={false}
                    />
                  </div>
                  <div className="text-xl font-semibold tracking-tight text-zinc-950">{feed.name}</div>
                </div>

                <Link
                  href={`/${feed.slug}`}
                  className="inline-flex w-fit items-center justify-center self-center rounded-md px-4 py-2 text-sm font-bold text-white md:self-auto"
                  style={{ background: feed.slug === "midamgolfhq" ? "#1a1a2e" : feed.slug === "seniorgolfhq" ? "#2d6a4f" : "#8b4513" }}
                >
                  View All →
                </Link>
              </div>

              <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2">
                {items.length ? (
                  items.map((it) => <IssueCard key={it.link + it.title} item={it} newsletterSlug={feed.slug} />)
                ) : (
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600">
                    No posts yet (or RSS URL not configured).
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* moved to footer */}
      </section>
    </SiteShell>
  );
}
