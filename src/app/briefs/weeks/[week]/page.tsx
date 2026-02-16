import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates } from "@/lib/briefs";
import { formatLongDate, isoWeekKeyFromYmd, isoWeekStartEndFromKey } from "@/lib/briefsDates";

export const dynamicParams = false;

export function generateStaticParams() {
  const dates = listBriefDates();
  const keys = new Set(dates.map((d) => isoWeekKeyFromYmd(d)).filter(Boolean));
  return Array.from(keys).map((week) => ({ week }));
}

export default function BriefWeekPage({ params }: { params: { week: string } }) {
  const weekKey = params.week;
  const range = isoWeekStartEndFromKey(weekKey);

  const allDates = listBriefDates();
  const weekDates = allDates.filter((d) => isoWeekKeyFromYmd(d) === weekKey).sort();

  const title = range ? `Week of ${formatLongDate(range.start)}` : `Week ${weekKey}`;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <Link href="/briefs/weeks" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← Weekly archive
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">{title}</h1>
          {range ? (
            <div className="mt-3 text-sm text-zinc-600">
              {formatLongDate(range.start)} – {formatLongDate(range.end)}
            </div>
          ) : (
            <div className="mt-3 text-sm text-zinc-600">{weekKey}</div>
          )}
        </div>

        <div className="space-y-3">
          {weekDates.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">No briefs in this week.</div>
          ) : (
            weekDates.map((d) => (
              <Link
                key={d}
                href={`/briefs/${d}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center hover:border-zinc-300"
              >
                <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                  {formatLongDate(d)}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </SiteShell>
  );
}
