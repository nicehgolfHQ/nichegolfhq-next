import Link from "next/link";
import type { TickerCard } from "@/lib/tournaments/ticker";

interface Props {
  cards: TickerCard[];
}

const CHANNEL_ACCENT: Record<TickerCard["channel"], string> = {
  junior: "#8b4513",
  midam: "#1a1a2e",
  senior: "#2d6a4f",
};

function CardView({ card, widthClass }: { card: TickerCard; widthClass: string }) {
  const accent = CHANNEL_ACCENT[card.channel];
  const isLive = card.status === "live";
  return (
    <div
      className={`flex shrink-0 flex-col rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-zinc-200 backdrop-blur ${widthClass}`}
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {card.channelLabel}
        </span>
        <span
          className={
            isLive
              ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
              : "inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700"
          }
        >
          {isLive ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Now Playing
            </>
          ) : (
            "Up Next"
          )}
        </span>
      </div>

      <Link
        href={card.hubHref}
        className="mt-2 line-clamp-2 font-serif text-base font-semibold leading-snug text-zinc-950 hover:underline"
      >
        {card.name}
      </Link>

      {card.venueLine ? (
        <div className="mt-1 line-clamp-1 text-xs text-zinc-600">
          {card.venueLine}
        </div>
      ) : null}
      {card.datesLabel ? (
        <div className="mt-0.5 text-[11px] text-zinc-400">{card.datesLabel}</div>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        {card.golfGeniusUrl ? (
          <Link
            href={card.golfGeniusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-500"
          >
            Live Scoring
          </Link>
        ) : null}
        <Link
          href={card.hubHref}
          className="inline-flex items-center rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          Tournament Hub →
        </Link>
      </div>
    </div>
  );
}

export function TournamentTicker({ cards }: Props) {
  if (!cards.length) return null;

  // Duplicate the set so the CSS marquee can loop seamlessly (-50% translate).
  const looped = [...cards, ...cards];

  return (
    <section
      className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6"
      aria-label="Current tournaments across nichegolfHQ channels"
    >
      {/* Desktop / tablet: horizontal auto-scrolling ticker */}
      <div className="hidden sm:block ticker-mask overflow-hidden">
        <div className="ticker-track flex gap-4">
          {looped.map((card, i) => (
            <CardView
              key={`${card.channel}-${i}`}
              card={card}
              widthClass="w-[320px] md:w-[360px]"
            />
          ))}
        </div>
      </div>

      {/* Mobile: stacked vertical list (no marquee) */}
      <div className="sm:hidden flex flex-col gap-3">
        {cards.map((card) => (
          <CardView key={card.channel} card={card} widthClass="w-full" />
        ))}
      </div>
    </section>
  );
}
