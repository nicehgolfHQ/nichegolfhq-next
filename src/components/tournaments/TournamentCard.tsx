import Link from "next/link";
import type { Tournament } from "@/lib/tournaments/types";

function formatBadge(format?: string) {
  if (!format) return null;
  const s = format.toLowerCase();

  const hasMatch = s.includes("match");
  const hasStroke = s.includes("stroke");
  const hasFourBall = s.includes("4-ball") || s.includes("four-ball") || s.includes("best ball") || s.includes("better ball");
  const hasAltShot = s.includes("alternate") || s.includes("foursomes") || s.includes("alt shot");

  if (hasMatch) return "Match Play";
  if (hasStroke) return "Stroke Play";

  if (hasFourBall && hasAltShot) return "4-Ball / Alt";
  if (hasFourBall) return "4-Ball";
  if (hasAltShot) return "Alt Shot";

  return format;
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const dates = tournament.dates2026 ?? (tournament.typicalDates ? `Typically ${tournament.typicalDates}` : "");
  const badge = formatBadge(tournament.format);

  return (
    <Link
      href={`/midamgolfhq/schedule/${tournament.slug}`}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.07]"
    >
      <div className="min-w-0 flex-1">
        <div className="font-serif text-xl font-semibold tracking-tight text-white">{tournament.name}</div>
        {tournament.course || tournament.location ? (
          <div className="mt-1.5 text-sm text-white/45">{[tournament.course, tournament.location].filter(Boolean).join(" • ")}</div>
        ) : null}
        {tournament.note ? <div className="mt-2 text-xs text-white/30">{tournament.note}</div> : null}
        {dates ? <div className="mt-2 text-xs text-white/30">{dates}</div> : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        {badge ? (
          <div className="rounded-full border border-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/50">
            {badge}
          </div>
        ) : null}
        <div className="text-sm text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/60" aria-hidden>
          →
        </div>
      </div>
    </Link>
  );
}
