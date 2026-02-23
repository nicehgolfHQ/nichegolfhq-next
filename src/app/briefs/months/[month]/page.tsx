import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates } from "@/lib/briefs";
import {
  formatMonthLong,
  isoWeekKeyFromYmd,
  isoWeekStartEndFromKey,
  formatLongDate,
  monthKeyFromYmd,
} from "@/lib/briefsDates";

export const metadata = {
  title: "Monthly Brief Archive",
  description: "Browse Daily Briefs by month and week.",
};

export default async function BriefMonthPage({
  params,
}: {
  params: { month?: string } | Promise<{ month?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const month = p?.month;
  if (!/^[0-9]{4}-[0-9]{2}$/.test(month || "")) return notFound();

  const dates = listBriefDates().filter((d) => monthKeyFromYmd(d) === month);
  if (dates.length === 0) return notFound();

  const weekCounts = new Map<string, number>();
  for (const d of dates) {
    const wk = isoWeekKeyFromYmd(d);
    if (!wk) continue;
    weekCounts.set(wk, (weekCounts.get(wk) ?? 0) + 1);
  }

  // Chronological order (oldest → newest) so Week 1 is the first week in the month.
  const weeks = Array.from(weekCounts.keys()).sort((a, b) => (a < b ? -1 : 1));

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-4 text-sm">
            <Link href="/briefs" className="text-zinc-600 hover:text-zinc-900">
              All briefs
            </Link>
            <span className="text-zinc-300">/</span>
            <Link href="/briefs/months" className="text-zinc-600 hover:text-zinc-900">
              Monthly archive
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950">
            {formatMonthLong(month)}
          </h1>
          <div className="mt-2 text-sm text-zinc-600">Browse by week</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {weeks.map((wk, idx) => {
            const range = isoWeekStartEndFromKey(wk);
            const title = `Week ${idx + 1}`;
            const sub = range ? `${formatLongDate(range.start)} → ${formatLongDate(range.end)}` : wk;

            return (
              <Link
                key={wk}
                href={`/briefs/weeks/${wk}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center hover:border-zinc-300"
              >
                <div className="font-serif text-2xl font-semibold tracking-tight text-zinc-950">{title}</div>
                <div className="mt-2 text-sm text-zinc-600">{sub}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
