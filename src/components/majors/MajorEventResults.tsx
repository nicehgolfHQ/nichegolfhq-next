type WinnerRow = { year: number; champion: string };

export function MajorEventResults({
  rows,
}: {
  rows: WinnerRow[];
}) {
  const sorted = [...rows].sort((a, b) => b.year - a.year);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
      <h2 className="text-sm font-semibold tracking-tight text-zinc-950 text-center">Past winners</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2">Champion</th>
            </tr>
          </thead>
          <tbody className="text-sm text-zinc-800">
            {sorted.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-zinc-600" colSpan={2}>
                  No results added yet.
                </td>
              </tr>
            ) : (
              sorted.map((r, idx) => (
                <tr key={r.year + r.champion} className={idx % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
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
