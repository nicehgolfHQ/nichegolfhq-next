import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listMidAmTournaments } from "@/lib/tournaments/midam";
import { TournamentCard } from "@/components/tournaments/TournamentCard";

const YEAR = 2026;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const metadata = {
  title: `Mid-Am Schedule — ${YEAR} | midamgolfHQ`,
  description: `Mid-amateur tournament schedule for ${YEAR}: event hubs, formats, venues, and quick links.`,
  alternates: { canonical: "/midamgolfhq/schedule" },
};

export default function MidAmScheduleIndexPage() {
  const tournaments = listMidAmTournaments();

  const byMonth = tournaments.reduce<Record<number, typeof tournaments>>((acc, t) => {
    acc[t.month] = acc[t.month] ?? [];
    acc[t.month].push(t);
    return acc;
  }, {});

  const months = Object.keys(byMonth)
    .map((m) => Number(m))
    .sort((a, b) => a - b);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-8">
          <div className="text-sm text-zinc-600">midamgolfHQ</div>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-950">Mid-Am Major Schedule — {YEAR}</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500">Grouped by month</div>
          <Link href="/midamgolfhq" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            Back to Mid-Am →
          </Link>
        </div>

        <div className="mt-6 space-y-10">
          {months.map((month) => (
            <section key={month} className="scroll-mt-24">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">
                  {MONTH_NAMES[month - 1]?.toUpperCase()}
                </h2>
              </div>
              <div className="grid gap-4">
                {byMonth[month]!.map((t) => (
                  <TournamentCard key={t.slug} tournament={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
