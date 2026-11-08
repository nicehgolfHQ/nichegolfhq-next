import { roundCell, totalCell, type FourBallStanding } from "@/data/hubs/four-ball";

export function FourBallBoard({ rows }: { rows: FourBallStanding[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Four-ball leaderboard. Blank cells are not posted.</caption>
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-3 py-3 font-semibold">Place</th>
            <th className="px-3 py-3 font-semibold">Team</th>
            <th className="px-3 py-3 font-semibold">Blue</th>
            <th className="px-3 py-3 font-semibold">Gold</th>
            <th className="px-3 py-3 font-semibold">Blue</th>
            <th className="px-3 py-3 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-zinc-100 align-top">
              <td className="px-3 py-3 font-semibold text-zinc-800">{row.position ?? ""}</td>
              <td className="px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800">{row.divisionLabel}</p>
                <p className="mt-1">
                  <PlayerLink id={playerId(row.names[0])} name={row.names[0]} />
                  <span className="text-zinc-400"> and </span>
                  <PlayerLink id={playerId(row.names[1])} name={row.names[1]} />
                </p>
                {row.score?.thru ? <p className="text-xs text-zinc-500">Thru {row.score.thru}</p> : null}
              </td>
              <td className="px-3 py-3 tabular-nums">{cell(roundCell(row.score, 0))}</td>
              <td className="px-3 py-3 tabular-nums">{cell(roundCell(row.score, 1))}</td>
              <td className="px-3 py-3 tabular-nums">{cell(roundCell(row.score, 2))}</td>
              <td className="px-3 py-3 font-semibold tabular-nums">{cell(totalCell(row.score))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function cell(value: string) {
  if (value) return value;
  return <span className="text-zinc-400">Not posted</span>;
}

function playerId(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PlayerLink({ id, name }: { id: string; name: string }) {
  return (
    <a href={`/midamgolfhq/players/${id}`} className="font-semibold text-zinc-950 underline decoration-emerald-800/40 underline-offset-2 hover:text-emerald-800">
      {name}
    </a>
  );
}
