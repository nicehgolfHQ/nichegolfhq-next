import Link from "next/link";

export function MajorEventOverview({
  brand,
  name,
  month,
  officialUrl,
  note,
  resultsHref,
  winners,
}: {
  brand: "juniorgolfHQ" | "seniorgolfHQ";
  name: string;
  month: string;
  officialUrl?: string;
  note?: string;
  resultsHref?: string;
  winners: { year: number; champion: string }[];
}) {
  const defending = [...winners].sort((a, b) => b.year - a.year)[0];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Overview</h2>
        {note ? <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{note}</p> : null}

        {defending ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Defending champion</div>
              <div className="mt-1 text-sm font-semibold text-zinc-950">{defending.champion}</div>
              <div className="mt-1 text-xs text-zinc-600">{defending.year}</div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {resultsHref ? (
            <Link
              href={resultsHref}
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 hover:bg-zinc-50"
            >
              2026 results →
            </Link>
          ) : null}
          {officialUrl ? (
            <a
              href={officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 hover:bg-zinc-50"
            >
              Official site
            </a>
          ) : null}
        </div>
      </div>

      <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Quick facts</h2>
        <div className="mt-3 space-y-2 text-sm text-zinc-700">
          <div>
            <span className="text-zinc-500">Brand:</span> {brand}
          </div>
          <div>
            <span className="text-zinc-500">Month:</span> {month}
          </div>
          <div>
            <span className="text-zinc-500">Official:</span> {officialUrl ? (
              <a href={officialUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                link
              </a>
            ) : (
              "TBD"
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
