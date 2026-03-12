import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listSeniorMajorsByMonth } from "@/lib/seniorMajors";

export const dynamic = "force-static";

export const metadata = {
  title: "Senior Amateur Golf Majors: Schedule & Results | seniorgolfHQ",
  description:
    "Senior amateur golf coverage: major schedule hubs with dates, formats, scoring links, and results pointers across the top senior events.",
  alternates: { canonical: "/seniorgolfhq" },
};

export default function SeniorIndexPage() {
  const months = listSeniorMajorsByMonth();

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-10 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">seniorgolfHQ</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Senior major schedule hubs with formats, scoring links, and results.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/seniorgolfhq/majors"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              View full 2026 schedule
            </Link>
            <Link
              href="/briefs"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
            >
              Daily Briefs
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <div className="mb-8 text-center">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2026 senior majors</h2>
            <p className="mt-2 text-sm text-zinc-600">Quick links into each event hub.</p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-4">
            {months.map((m) => (
              <section key={m.monthKey} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-950">{m.month}</h3>
                </div>

                <div className="mt-4 divide-y divide-zinc-200/70">
                  {m.events.map((e) => (
                    <Link key={e.slug} href={`/seniorgolfhq/${e.slug}`} className="block px-1 transition hover:bg-zinc-50">
                      <div className="py-3">
                        <div className="font-serif text-lg font-semibold tracking-tight text-zinc-950">{e.name}</div>
                        {e.format ? <div className="mt-1 text-xs text-zinc-600">{e.format}</div> : null}
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
