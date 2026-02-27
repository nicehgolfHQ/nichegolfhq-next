import type { Tournament } from "@/lib/tournaments/types";

export function TournamentOverview({ tournament }: { tournament: Tournament }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Overview</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{tournament.overview}</p>
      </div>

      <aside className="rounded-3xl border border-zinc-200 bg-white p-6">
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
          <div>
            <span className="text-zinc-500">Course:</span> {tournament.course}
          </div>
          <div>
            <span className="text-zinc-500">Location:</span> {tournament.location}
          </div>
        </div>
      </aside>
    </div>
  );
}
