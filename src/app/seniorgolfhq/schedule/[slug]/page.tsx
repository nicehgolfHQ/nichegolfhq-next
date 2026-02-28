import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { MajorEventHero } from "@/components/majors/MajorEventHero";
import { MajorEventTabs } from "@/components/majors/MajorEventTabs";
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
          <MajorEventHero name={event.name} subtitle={event.month} />

          <MajorEventTabs
            brand="seniorgolfHQ"
            name={event.name}
            month={event.month}
            officialUrl={event.officialUrl}
            note={event.note}
            resultsHref={`/seniorgolfhq/majors/${event.slug}/2026`}
            winners={[]}
          />
        </div>
      </div>
    </SiteShell>
  );
}
