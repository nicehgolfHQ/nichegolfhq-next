import Link from "next/link";
import Script from "next/script";
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
  if (!event) return { title: "Senior Major Schedule | seniorgolfHQ" };
  return {
    title: `${event.name} — Senior Major Schedule | seniorgolfHQ`,
    description: `Dates and quick links for ${event.name}.`,
    alternates: { canonical: `/seniorgolfhq/schedule/${event.slug}` },
  };
}

export default async function SeniorScheduleEventPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getSeniorMajorBySlug(slug);
  if (!event) notFound();

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/seniorgolfhq/schedule/${event.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "seniorgolfHQ", item: `${baseUrl}/seniorgolfhq` },
      { "@type": "ListItem", position: 3, name: "Senior Major Schedule", item: `${baseUrl}/seniorgolfhq/schedule` },
      { "@type": "ListItem", position: 4, name: event.name, item: pageUrl },
    ],
  };

  const eventLd: any = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.name,
    url: pageUrl,
    sport: "Golf",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: "seniorgolfHQ",
      url: `${baseUrl}/seniorgolfhq`,
    },
    description: `Schedule hub for ${event.name} (senior majors).`,
  };

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <Script id={`ld-breadcrumbs-senior-${event.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-senior-${event.slug}`} type="application/ld+json">
        {JSON.stringify(eventLd)}
      </Script>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="flex items-center justify-start">
          <Link
            href="/seniorgolfhq/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white"
          >
            <span aria-hidden>←</span>
            <span>Schedule</span>
          </Link>
        </div>

        <div className="mt-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">{event.name}</h1>
            <div className="mt-2 text-sm text-zinc-600">{event.month}</div>
            {event.note ? <div className="mt-2 text-sm text-zinc-600">{event.note}</div> : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Overview</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  This page is the canonical schedule hub for {event.name}. We’ll keep adding official links and past winners.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/seniorgolfhq/majors/${event.slug}/2026`}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 hover:bg-zinc-50"
                  >
                    2026 results →
                  </Link>
                  {event.officialUrl ? (
                    <a
                      href={event.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 hover:bg-zinc-50"
                    >
                      Official site
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
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

              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Past winners</h2>
                <div className="mt-3 text-sm text-zinc-700">
                  We’ll expand this with a year-by-year table.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
