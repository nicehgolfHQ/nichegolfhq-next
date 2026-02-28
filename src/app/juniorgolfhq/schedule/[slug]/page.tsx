import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { MajorEventHero } from "@/components/majors/MajorEventHero";
import { MajorEventTabs } from "@/components/majors/MajorEventTabs";
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
  if (!event) return { title: "Junior Major Schedule | juniorgolfHQ" };
  return {
    title: `${event.name} — Junior Major Schedule | juniorgolfHQ`,
    description: `Dates, quick links, and results pointers for ${event.name}.`,
    alternates: { canonical: `/juniorgolfhq/schedule/${event.slug}` },
  };
}

export default async function JuniorScheduleEventPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getJuniorMajorBySlug(slug);
  if (!event) notFound();

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/juniorgolfhq/schedule/${event.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "juniorgolfHQ", item: `${baseUrl}/juniorgolfhq` },
      { "@type": "ListItem", position: 3, name: "Junior Major Schedule", item: `${baseUrl}/juniorgolfhq/schedule` },
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
      name: "juniorgolfHQ",
      url: `${baseUrl}/juniorgolfhq`,
    },
    description: `Schedule hub for ${event.name} (junior majors).`,
  };

  return (
    <SiteShell brandSlug="juniorgolfhq">
      <Script id={`ld-breadcrumbs-junior-${event.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-junior-${event.slug}`} type="application/ld+json">
        {JSON.stringify(eventLd)}
      </Script>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="flex items-center justify-start">
          <Link
            href="/juniorgolfhq/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white"
          >
            <span aria-hidden>←</span>
            <span>Schedule</span>
          </Link>
        </div>

        <div className="mt-4">
          <MajorEventHero name={event.name} subtitle={event.month} />

          <MajorEventTabs
            brand="juniorgolfHQ"
            name={event.name}
            month={event.month}
            officialUrl={event.officialUrl}
            note={event.note}
            resultsHref={`/juniorgolfhq/majors/${event.slug}/2026`}
            winners={
              event.winners2026
                ? [
                    {
                      year: 2026,
                      champion: [
                        event.winners2026.boys ? `Boys: ${event.winners2026.boys}` : null,
                        event.winners2026.girls ? `Girls: ${event.winners2026.girls}` : null,
                      ]
                        .filter(Boolean)
                        .join(" • "),
                    },
                  ]
                : []
            }
          />
        </div>
      </div>
    </SiteShell>
  );
}
