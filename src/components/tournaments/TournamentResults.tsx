import type { Tournament } from "@/lib/tournaments/types";

export function TournamentResults({ tournament }: { tournament: Tournament }) {
  const rows = [...(tournament.pastResults ?? [])].sort((a, b) => b.year - a.year);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Past winners</h2>
        {tournament.golfGeniusUrl ? (
          <a
            href={tournament.golfGeniusUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-700 underline-offset-4 hover:underline"
          >
            Detailed scoring →
          </a>
        ) : null}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2">Champion</th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-zinc-600" colSpan={2}>
                  No results added yet.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={r.year} className={idx % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                  <td className="px-3 py-3 font-medium text-zinc-900">{r.year}</td>
                  <td className="px-3 py-3 font-semibold text-zinc-950">{r.champion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
