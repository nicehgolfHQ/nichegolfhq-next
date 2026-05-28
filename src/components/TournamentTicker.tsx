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

function StatusBadge({ status }: { status: TickerCard["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        Now Playing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700">
      Up Next
    </span>
  );
}

function TickerCardView({ card }: { card: TickerCard }) {
  const accent = CHANNEL_ACCENT[card.channel];
  return (
    <div
      className="flex w-[280px] shrink-0 flex-col items-center rounded-2xl bg-white/95 px-4 py-3 text-center shadow-sm ring-1 ring-zinc-200 backdrop-blur"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-center justify-center gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {card.channelLabel}
        </span>
        <span className="text-zinc-300">·</span>
        <StatusBadge status={card.status} />
      </div>

      <Link
        href={card.hubHref}
        className="mt-1.5 line-clamp-2 font-serif text-sm font-semibold leading-snug text-zinc-950"
      >
        {card.name}
      </Link>

      {card.datesLabel ? (
        <div className="mt-0.5 text-[11px] text-zinc-500">{card.datesLabel}</div>
      ) : null}

      <Link
        href={card.hubHref}
        className="mt-2 inline-flex items-center rounded-full border border-zinc-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
      >
        Tournament Hub →
      </Link>
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
      <div className="mb-3 text-center">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
          Tournament Tracker
        </h2>
      </div>

      <div className="ticker-mask overflow-hidden">
        <div className="ticker-track flex gap-4">
          {looped.map((card, i) => (
            <TickerCardView key={`${card.channel}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
