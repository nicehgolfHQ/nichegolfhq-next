import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getJuniorMajorBySlug, listJuniorMajorSlugs } from "@/lib/juniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listJuniorMajorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getJuniorMajorBySlug(slug);
  if (!event) return { title: "Junior Majors | juniorgolfHQ" };
  return {
    title: `${event.name} | Junior Majors | juniorgolfHQ`,
    description: `Hub page for ${event.name} (Junior Majors).`,
    alternates: { canonical: `/juniorgolfhq/majors/${event.slug}` },
  };
}

export default async function JuniorMajorHubPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getJuniorMajorBySlug(slug);
  if (!event) notFound();

  return (
    <SiteShell brandSlug="juniorgolfhq">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6">
          <Link href="/juniorgolfhq/majors" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← Junior Majors
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">{event.name}</h1>
          <div className="mt-3 text-sm text-zinc-600">{event.month}</div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-950">2026</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                This hub will hold the canonical links + results for {event.name}. We’ll add official site links and year-by-year pages
                next.
              </p>

              {event.winners2026 ? (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
                  <div className="font-semibold text-zinc-900">Winners (2026)</div>
                  <div className="mt-2">
                    {event.winners2026.boys ? `Boys: ${event.winners2026.boys}` : ""}
                    {event.winners2026.girls ? ` • Girls: ${event.winners2026.girls}` : ""}
                  </div>
                </div>
              ) : null}

              <Link
                href={`/juniorgolfhq/majors/${event.slug}/2026`}
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
