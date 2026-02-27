import type { Tournament } from "@/lib/tournaments/types";

export function TournamentOverview({ tournament }: { tournament: Tournament }) {
  const overview = tournament.overview?.trim();
  const hasCourseNotes =
    Boolean(tournament.courseDesigner) ||
    Boolean(tournament.courseYear) ||
    Boolean(tournament.course) ||
    Boolean(tournament.location);

  const defending = (tournament.pastResults ?? []).slice().sort((a, b) => b.year - a.year)[0];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Overview</h2>
        {overview && overview.length > 0 ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{overview}</p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {tournament.format ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Format</div>
              <div className="mt-1 text-sm font-semibold text-zinc-950">{tournament.format}</div>
            </div>
          ) : null}

          {defending ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Defending champion</div>
              <div className="mt-1 text-sm font-semibold text-zinc-950">{defending.champion}</div>
              <div className="mt-1 text-xs text-zinc-600">{defending.year}</div>
            </div>
          ) : null}
        </div>
      </div>

      {hasCourseNotes ? (
        <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Course notes</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            {tournament.courseDesigner ? (
              <div>
                <span className="text-zinc-500">Designer:</span> {tournament.courseDesigner}
              </div>
            ) : null}
            {tournament.courseYear ? (
              <div>
                <span className="text-zinc-500">Opened:</span> {tournament.courseYear}
              </div>
            ) : null}
            {tournament.course ? (
              <div>
                <span className="text-zinc-500">Course:</span> {tournament.course}
              </div>
            ) : null}
            {tournament.location ? (
              <div>
                <span className="text-zinc-500">Location:</span> {tournament.location}
              </div>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
