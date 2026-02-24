import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listSeniorMajorsByMonth } from "@/lib/seniorMajors";

export const metadata = {
  title: "Senior Majors — 2026 | seniorgolfHQ",
  description: "Senior majors schedule for 2026: event hubs and year-by-year results pages.",
};

export default function SeniorMajorsIndexPage() {
  const months = listSeniorMajorsByMonth();

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Senior Majors — 2026</h1>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4">
          {months.map((m) => (
            <section key={m.monthKey} id={m.monthKey} className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">{m.month}</h2>
              </div>

              <div className="mt-4 divide-y divide-zinc-200/70">
                {m.events.map((e) => (
                  <Link key={e.slug} href={`/seniorgolfhq/majors/${e.slug}`} className="block px-1 transition hover:bg-zinc-50">
                    <div className="py-3">
                      <div className="font-serif text-lg font-semibold tracking-tight text-zinc-950">{e.name}</div>
                      {e.note ? <div className="mt-1 text-xs text-zinc-600">{e.note}</div> : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
