import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listMidAmTournaments } from "@/lib/tournaments/midam";

export const dynamic = "force-static";

export const metadata = {
  title: "Mid-Amateur Golf Tournaments, Live Scoring & Results | midamgolfHQ",
  description:
    "Mid-amateur golf coverage: tournament schedule, event hubs, live scoring links, and results across elite invitationals and championships.",
  alternates: { canonical: "/midamgolfhq" },
};

function monthName(month: number) {
  const dt = new Date(Date.UTC(2026, Math.max(0, month - 1), 1));
  return dt.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
}

export default function MidAmIndexPage() {
  const tournaments = listMidAmTournaments();

  const grouped = new Map<number, typeof tournaments>();
  for (const t of tournaments) {
    const arr = grouped.get(t.month) ?? [];
    arr.push(t);
    grouped.set(t.month, arr);
  }

  const months = Array.from(grouped.keys()).sort((a, b) => a - b);

  return (
    <SiteShell brandSlug="midamgolfhq">
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-10 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">midamgolfHQ</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Mid-amateur golf tournament hubs with dates, venues, formats, past winners, and live scoring links.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/briefs"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Daily Briefs
            </Link>
            <Link
              href="/majors"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Majors hubs
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2026 schedule hubs</h2>
            <p className="mt-2 text-sm text-zinc-600">Tap an event to see quick facts + past winners.</p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4">
            {months.map((m) => (
              <section key={m} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-950">{monthName(m)}</h3>
                </div>

                <div className="mt-4 divide-y divide-zinc-200/70">
                  {(grouped.get(m) ?? []).map((t) => (
                    <Link key={t.slug} href={`/midamgolfhq/${t.slug}`} className="block px-1 transition hover:bg-zinc-50">
                      <div className="py-3">
                        <div className="font-serif text-lg font-semibold tracking-tight text-zinc-950">{t.name}</div>
                        <div className="mt-1 text-xs text-zinc-600">
                          {[t.course, t.location, t.dates2026 ?? t.typicalDates].filter(Boolean).join(" • ")}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
