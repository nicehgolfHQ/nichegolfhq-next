"use client";

import Link from "next/link";

type BriefItem = {
  category: string;
  title: string;
  excerpt: string;
  sourceUrl: string;
};

type DailyBriefProps = {
  date: string;
  dateFormatted: string;
  items: BriefItem[];
  briefSlug: string;
};

const categoryConfig: Record<string, { color: string; glow: string; border: string }> = {
  SENIOR: { color: "text-emerald-400", glow: "hover:shadow-emerald-500/10", border: "border-l-emerald-500/40" },
  "MID-AM": { color: "text-sky-400", glow: "hover:shadow-sky-500/10", border: "border-l-sky-500/40" },
  JUNIOR: { color: "text-amber-400", glow: "hover:shadow-amber-500/10", border: "border-l-amber-500/40" },
};

export default function DailyBriefHero({ date, dateFormatted, items, briefSlug }: DailyBriefProps) {
  return (
    <section className="noise-overlay relative overflow-hidden bg-[#080811]">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-emerald-500/10 blur-[120px]" />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 animate-pulse rounded-full bg-sky-500/10 blur-[110px]"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">Daily Brief</span>
          </div>
          <span className="text-sm text-zinc-500">{dateFormatted}</span>
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-4xl tracking-tight text-white md:text-6xl lg:text-7xl">
          Daily Brief <span className="gradient-text">— {date}</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-400">Your morning briefing across amateur golf.</p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const config = categoryConfig[item.category] || { color: "text-zinc-400", glow: "", border: "border-l-zinc-500/40" };
            return (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] border-l-2 ${config.border} bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-xl ${config.glow}`}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${config.color}`}>{item.category}</span>
                  <h3 className="mt-3 font-display text-[17px] leading-snug text-white/90 transition-colors group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{item.excerpt}</p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-all duration-200 hover:text-emerald-300 hover:gap-2.5"
                  >
                    Source
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            href={`/briefs/${briefSlug}`}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            Read full brief
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
