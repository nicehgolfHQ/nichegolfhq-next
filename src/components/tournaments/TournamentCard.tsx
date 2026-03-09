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
      href={`/midamgolfhq/${tournament.slug}`}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950">{tournament.name}</div>
        {tournament.course || tournament.location ? (
          <div className="mt-1.5 text-sm text-zinc-500">{[tournament.course, tournament.location].filter(Boolean).join(" \u2022 ")}</div>
        ) : null}
        {tournament.note ? <div className="mt-2 text-xs text-zinc-400">{tournament.note}</div> : null}
        {dates ? <div className="mt-2 text-xs text-zinc-400">{dates}</div> : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3">
        {badge ? (
          <div className="rounded-full border border-zinc-200 px-3.5 py-1.5 text-[11px] font-semibold text-zinc-500">
            {badge}
          </div>
        ) : null}
        <div className="text-sm text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-700" aria-hidden>
          &rarr;
        </div>
      </div>
    </Link>
  );
}
