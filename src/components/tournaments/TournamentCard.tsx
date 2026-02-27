import Link from "next/link";
import type { Tournament } from "@/lib/tournaments/types";

function formatBadge(format?: string) {
  if (!format) return null;
  const s = format.toLowerCase();
  if (s.includes("match")) return "Match Play";
  if (s.includes("4-ball") || s.includes("four-ball") || s.includes("best ball")) return "4-Ball";
  if (s.includes("stroke")) return "Stroke Play";
  return "Format";
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const dates = tournament.dates2026 ?? (tournament.typicalDates ? `Typically ${tournament.typicalDates}` : "");
  const badge = formatBadge(tournament.format);

  return (
    <Link
      href={`/midamgolfhq/schedule/${tournament.slug}`}
      className="group rounded-3xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950">{tournament.name}</div>
          {tournament.course || tournament.location ? (
            <div className="mt-1 text-sm text-zinc-700">{[tournament.course, tournament.location].filter(Boolean).join(" • ")}</div>
          ) : null}
          {tournament.note ? <div className="mt-2 text-xs text-zinc-500">{tournament.note}</div> : null}
          {dates ? <div className="mt-2 text-xs text-zinc-500">{dates}</div> : null}
        </div>
        {badge ? (
          <div className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-700">
            {badge}
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-sm font-medium text-zinc-900">
        View hub <span aria-hidden className="inline-block transition group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
