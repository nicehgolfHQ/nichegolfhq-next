import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates } from "@/lib/briefs";
import { monthKeyFromYmd, formatMonthLong } from "@/lib/briefsDates";

export const metadata = {
  title: "Monthly Brief Archive",
  description: "Browse Daily Briefs by month.",
};

export default function BriefMonthsIndexPage() {
  const dates = listBriefDates();

  const monthCounts = new Map<string, number>();
  for (const d of dates) {
    const mk = monthKeyFromYmd(d);
    if (!mk) continue;
    monthCounts.set(mk, (monthCounts.get(mk) ?? 0) + 1);
  }

  const months = Array.from(monthCounts.keys()).sort((a, b) => (a < b ? 1 : -1));

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mb-3">
            <Link href="/briefs" className="text-sm text-zinc-600 hover:text-zinc-900">
              ← All briefs
            </Link>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Monthly archive</h1>
        </div>

        <div className="space-y-3">
          {months.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">No briefs yet.</div>
          ) : (
            months.map((m) => (
              <Link
                key={m}
                href={`/briefs/months/${m}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center hover:border-zinc-300"
              >
                <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                  {formatMonthLong(m)}
                </div>
                <div className="mt-2 text-sm text-zinc-600">{monthCounts.get(m) ?? 0} brief(s)</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </SiteShell>
  );
}
