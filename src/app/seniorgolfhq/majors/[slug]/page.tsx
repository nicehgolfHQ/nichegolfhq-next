import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getSeniorMajorBySlug, listSeniorMajorSlugs } from "@/lib/seniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeniorMajorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getSeniorMajorBySlug(slug);
  if (!event) return { title: "Senior Majors | seniorgolfHQ" };
  return {
    title: `${event.name} | Senior Majors | seniorgolfHQ`,
    description: `Hub page for ${event.name} (Senior Majors).`,
    alternates: { canonical: `/seniorgolfhq/majors/${event.slug}` },
  };
}

export default async function SeniorMajorHubPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getSeniorMajorBySlug(slug);
  if (!event) notFound();

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6">
          <Link href="/seniorgolfhq/majors" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← Senior Majors
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">{event.name}</h1>
          <div className="mt-3 text-sm text-zinc-600">{event.month}</div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2026</h2>

              {event.winners?.length ? (
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  Winner: <span className="font-semibold text-zinc-950">{event.winners[0].champion}</span>
                </p>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">Winner data TBD.</p>
              )}

              <Link
                href={`/seniorgolfhq/majors/${event.slug}/2026`}
                className="mt-5 inline-block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-300 hover:bg-white"
              >
                2026 results →
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Quick facts</h2>
              <div className="mt-3 space-y-2 text-sm text-zinc-700">
                <div>
                  <span className="text-zinc-500">Month:</span> {event.month}
                </div>
                <div>
                  <span className="text-zinc-500">Format:</span> {event.format ?? "TBD"}
                </div>
                <div>
                  <span className="text-zinc-500">Official:</span> {event.officialUrl ? (
                    <a href={event.officialUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      link
                    </a>
                  ) : (
                    "TBD"
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
