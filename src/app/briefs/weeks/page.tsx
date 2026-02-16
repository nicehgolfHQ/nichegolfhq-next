import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates } from "@/lib/briefs";
import { formatLongDate, isoWeekKeyFromYmd, isoWeekStartEndFromKey } from "@/lib/briefsDates";

export const metadata = {
  title: "Weekly Archive",
};

export default function BriefWeeksIndexPage() {
  const dates = listBriefDates();

  const weeks = new Map<string, string[]>();
  for (const d of dates) {
    const wk = isoWeekKeyFromYmd(d);
    const arr = weeks.get(wk) ?? [];
    arr.push(d);
    weeks.set(wk, arr);
  }

  const weekKeys = Array.from(weeks.keys()).sort((a, b) => (a < b ? 1 : -1));

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Weekly Archive</h1>
          <div className="mt-3 text-sm text-zinc-600">
            Browse daily briefs grouped by week (Monday–Sunday).
          </div>
          <div className="mt-4">
            <Link href="/briefs" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
              ← Back to briefs
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {weekKeys.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">No briefs yet.</div>
          ) : (
            weekKeys.map((wk) => {
              const range = isoWeekStartEndFromKey(wk);
              const label = range ? `${formatLongDate(range.start)} – ${formatLongDate(range.end)}` : wk;
              const count = weeks.get(wk)?.length ?? 0;
              return (
                <Link
                  key={wk}
                  href={`/briefs/weeks/${wk}`}
                  className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center hover:border-zinc-300"
                >
                  <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">{label}</div>
                  <div className="mt-2 text-xs text-zinc-500">{wk} • {count} brief{count === 1 ? "" : "s"}</div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </SiteShell>
  );
}
