import Link from "next/link";
import type { Tournament } from "@/lib/tournaments/types";

interface Props {
  tournament: Tournament;
  // URL prefix for the tournament hub on this channel (e.g. "/midamgolfhq")
  channelPrefix: string;
}

export function ActiveTournamentWidget({ tournament, channelPrefix }: Props) {
  const hubHref = `${channelPrefix}/${tournament.slug}`;
  const venueLine = [tournament.course, tournament.location]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="px-6 py-7 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Live now
        </div>
        <div className="mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900">
          {tournament.name}
        </div>
        {venueLine ? (
          <div className="mt-1 text-sm text-zinc-500">{venueLine}</div>
        ) : null}
        {tournament.dates2026 ? (
          <div className="mt-1 text-xs text-zinc-400">{tournament.dates2026}</div>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {tournament.golfGeniusUrl ? (
            <Link
              href={tournament.golfGeniusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Live Scoring
            </Link>
          ) : null}
          <Link
            href={hubHref}
            className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Tournament Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
