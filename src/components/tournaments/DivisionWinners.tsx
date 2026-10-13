import type { DivisionResults } from "@/lib/tournaments/types";

function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <span
        role="button"
        tabIndex={0}
        aria-label={`About the ${label} division`}
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-zinc-300 text-[10px] font-semibold leading-none text-zinc-500 outline-none transition hover:border-zinc-500 hover:text-zinc-800 focus-visible:border-zinc-700 focus-visible:text-zinc-900"
      >
        i
      </span>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

function sortedRows(d: DivisionResults) {
  return [...d.results].sort((a, b) => b.year - a.year);
}

function FeaturedDivision({ d }: { d: DivisionResults }) {
  const [latest, ...earlier] = sortedRows(d);
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm shadow-emerald-900/5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
          Championship division
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{d.label}</h3>
        {d.ages ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
            Ages {d.ages}
          </span>
        ) : null}
        {d.info ? <InfoTip label={d.label} text={d.info} /> : null}
      </div>

      {latest ? (
        <div className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-emerald-800">
              {latest.year} champion
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{latest.champion}</div>
          </div>
          {latest.score ? (
            <div className="text-sm tabular-nums text-zinc-600">
              Score <span className="font-semibold text-zinc-900">{latest.score}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {earlier.length ? (
        <table className="mt-4 w-full border-separate border-spacing-0">
          <tbody className="text-sm text-zinc-800">
            {earlier.map((r) => (
              <tr key={r.year} className="border-t border-emerald-200/80">
                <td className="w-16 py-2 pr-3 font-medium text-zinc-900">{r.year}</td>
                <td className="py-2 pr-3 font-semibold text-zinc-950">{r.champion}</td>
                <td className="py-2 text-right tabular-nums text-zinc-600">{r.score ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

function CompactDivision({ d }: { d: DivisionResults }) {
  const rows = sortedRows(d);
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-zinc-900">{d.label}</h4>
        {d.ages ? (
          <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {d.ages}
          </span>
        ) : null}
        {d.info ? <InfoTip label={d.label} text={d.info} /> : null}
      </div>
      <table className="mt-2 w-full border-separate border-spacing-0">
        <tbody className="text-sm text-zinc-800">
          {rows.map((r) => (
            <tr key={r.year} className="border-t border-zinc-200">
              <td className="w-12 py-1.5 pr-2 text-xs font-medium text-zinc-500">{r.year}</td>
              <td className="py-1.5 pr-2 font-medium text-zinc-900">{r.champion}</td>
              <td className="py-1.5 text-right text-xs tabular-nums text-zinc-500">{r.score ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DivisionWinners({
  divisions,
  note,
}: {
  divisions: DivisionResults[];
  note?: string;
}) {
  const primary = divisions.find((d) => d.primary);
  const others = divisions.filter((d) => d !== primary);

  return (
    <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
      <h2 className="text-center text-sm font-semibold tracking-tight text-zinc-950">
        Past winners by age division
      </h2>
      {note ? <p className="mt-2 text-center text-xs text-zinc-500">{note}</p> : null}

      {primary ? <div className="mt-5"><FeaturedDivision d={primary} /></div> : null}

      {others.length ? (
        <div className={primary ? "mt-6" : "mt-5"}>
          {primary ? (
            <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Other age divisions
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            {others.map((d) => (
              <CompactDivision key={d.label} d={d} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
