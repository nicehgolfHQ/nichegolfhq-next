import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getMajorBySlug, listMajorSlugs } from "@/lib/majors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMajorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getMajorBySlug(slug);
  if (!event) return { title: "Mid-Am Majors | midamgolfHQ" };
  return {
    title: `${event.name} | Mid-Am Majors | midamgolfHQ`,
    description: `Results and history for ${event.name} (Mid-Am Majors).`,
    alternates: { canonical: `/midamgolfhq/majors/${event.slug}` },
  };
}

export default async function MajorHubPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getMajorBySlug(slug);
  if (!event) notFound();

  const years = [...event.years].sort((a, b) => b.year - a.year);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6">
          <Link href="/midamgolfhq/majors" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← Mid-Am Majors
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">{event.name}</h1>
          <div className="mt-3 text-sm text-zinc-600">
            {event.course ? `${event.course} • ` : ""}
            {event.location ?? ""}
            {event.typicalWindow ? ` • Typically ${event.typicalWindow}` : ""}
          </div>
          {event.description ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-700">{event.description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Year-by-year</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {years.map((y) => (
                  <Link
                    key={y.year}
                    href={`/midamgolfhq/majors/${event.slug}/${y.year}`}
                    className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-white"
                  >
                    <div className="text-xs text-zinc-500">{y.dates ?? ""}</div>
                    <div className="mt-1 font-serif text-2xl font-semibold tracking-tight text-zinc-950">
                      {y.year}
                    </div>
                    <div className="mt-2 text-sm text-zinc-700">
                      {y.winners?.midAm ? `Mid-Am: ${y.winners.midAm.name}` : ""}
                      {y.winners?.senior ? ` • Seniors: ${y.winners.senior.name}` : ""}
                    </div>
                    <div className="mt-3 text-sm font-medium text-zinc-900">
                      View results <span aria-hidden className="inline-block transition group-hover:translate-x-0.5">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">About this hub</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                This page is the canonical reference for {event.name}. Daily Briefs can cover round-by-round action, but this hub
                and its year pages are built to rank for results and history queries.
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Quick facts</h2>
              <div className="mt-3 space-y-2 text-sm text-zinc-700">
                {event.typicalWindow ? (
                  <div>
                    <span className="text-zinc-500">When:</span> {event.typicalWindow}
                  </div>
                ) : null}
                {event.course ? (
                  <div>
                    <span className="text-zinc-500">Course:</span> {event.course}
                  </div>
                ) : null}
                {event.location ? (
                  <div>
                    <span className="text-zinc-500">Location:</span> {event.location}
                  </div>
                ) : null}
              </div>
              {years[0] ? (
                <Link
                  href={`/midamgolfhq/majors/${event.slug}/${years[0].year}`}
                  className="mt-4 inline-block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-300 hover:bg-white"
                >
                  Latest: {years[0].year} results →
                </Link>
              ) : null}
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">What we’ll add next</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
                <li>Past champions table (all years)</li>
                <li>Course notes + setup</li>
                <li>Structured data (SportsEvent + year results)</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
