import Link from "next/link";
import type { TickerCard } from "@/lib/tournaments/ticker";

interface Props {
  cards: TickerCard[];
  /** Formatted date shown on the right of the header bar, e.g. "May 30th, 2026". */
  dateLabel: string;
  /** Link to the latest brief, e.g. "/briefs/2026-05-30". Null hides the footer. */
  briefHref: string | null;
}

/* Brand-tinted accent colors, lightened for legibility on the dark glass panel. */
const CHANNEL_ACCENT: Record<TickerCard["channel"], string> = {
  junior: "#d8a76a",
  midam: "#93a8e0",
  senior: "#5fce93",
};

function StatusBadge({ status }: { status: TickerCard["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        Live
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70">
      Up next
    </span>
  );
}

function ScoreboardColumn({ card }: { card: TickerCard }) {
  const accent = CHANNEL_ACCENT[card.channel];
  return (
    <Link
      href={card.hubHref}
      className="group flex flex-col gap-1.5 px-5 py-4 transition hover:bg-white/5"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {card.channelLabel}
        </span>
        <StatusBadge status={card.status} />
      </div>

      <div className="text-[13px] font-bold leading-snug text-white transition group-hover:text-white/90">
        {card.name}
      </div>

      {card.datesLabel ? (
        <div className="text-[11px] text-white/45">{card.datesLabel}</div>
      ) : null}
    </Link>
  );
}

export function UnifiedScoreboard({ cards, dateLabel, briefHref }: Props) {
  if (!cards.length) return null;

  return (
    <section
      className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-6"
      aria-label="Major tournament tracker and today's brief"
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-5 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            Major tournament tracker
          </span>
          <span className="text-[11px] font-medium text-white/45">
            {dateLabel}
          </span>
        </div>

        {/* Tournament columns: 3-across on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {cards.map((card) => (
            <ScoreboardColumn key={card.channel} card={card} />
          ))}
        </div>

        {/* Footer bar — today's brief */}
        {briefHref ? (
          <Link
            href={briefHref}
            className="group flex items-center justify-between gap-3 border-t border-white/10 bg-white/5 px-5 py-2.5 transition hover:bg-white/10"
          >
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Today&rsquo;s brief
              </span>
              <span className="hidden truncate text-[11px] text-white/45 sm:inline">
                Headlines across junior, mid-am, and senior amateur golf
              </span>
            </span>
            <span className="shrink-0 text-[11px] font-semibold text-white/70 transition group-hover:text-white">
              Read &rarr;
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
