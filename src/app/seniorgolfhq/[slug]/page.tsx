import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { MajorEventHero } from "@/components/majors/MajorEventHero";
import { MajorEventTabs } from "@/components/majors/MajorEventTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { getSeniorMajorBySlug, listSeniorMajorSlugs } from "@/lib/seniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeniorMajorSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Helper: convert human-readable month string to ISO 8601           */
/* ------------------------------------------------------------------ */
const MONTH_MAP: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08", aug: "08",
  september: "09", october: "10", november: "11", december: "12",
  jan: "01", feb: "02", mar: "03", apr: "04", jun: "06",
  jul: "07", sep: "09", oct: "10", nov: "11", dec: "12",
};

function monthToISO(raw: string): string | null {
  if (!raw) return null;
  const m = raw.match(/^(\w+)\s+(\d{4})$/);
  if (m) {
    const mm = MONTH_MAP[m[1].toLowerCase()];
    if (mm) return `${m[2]}-${mm}`;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const event = getSeniorMajorBySlug(slug);
  if (!event) return { title: "seniorgolfHQ" };

  return {
    title: `${event.name} \u2014 Senior Major Schedule | seniorgolfHQ`,
    description: `Dates and quick links for ${event.name}.`,
    alternates: { canonical: `/seniorgolfhq/${event.slug}` },
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
  const pageUrl = `${baseUrl}/seniorgolfhq/${event.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "seniorgolfHQ",
        item: `${baseUrl}/seniorgolfhq`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Senior Major Schedule",
        item: `${baseUrl}/seniorgolfhq`,
      },
      { "@type": "ListItem", position: 4, name: event.name, item: pageUrl },
    ],
  };

  const isoDate = monthToISO(event.month);

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
    image: `${baseUrl}/og-senior.png`,
    performer: {
      "@type": "Organization",
      name: event.name,
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
      description: "Amateur senior golf tournament",
    },
  };

  if (isoDate) {
    eventLd.startDate = isoDate;
  }

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <Script
        id={`ld-breadcrumbs-senior-${event.slug}`}
        type="application/ld+json"
      >
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script
        id={`ld-event-senior-${event.slug}`}
        type="application/ld+json"
      >
        {JSON.stringify(eventLd)}
      </Script>

      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-zinc-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-10">
          <div className="mb-6">
            <Link
              href="/seniorgolfhq"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-700"
            >
              <span aria-hidden>&larr;</span>
              <span>seniorgolfHQ</span>
            </Link>
          </div>
          <MajorEventHero name={event.name} subtitle={event.month} />
        </div>
      </section>

      {/* -- White Content -- */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <MajorEventTabs
            brand="seniorgolfHQ"
            name={event.name}
            month={event.month}
            officialUrl={event.officialUrl}
            note={
              event.note || (event.format ? `Format: ${event.format}` : undefined)
            }
            resultsHref={`/seniorgolfhq/majors/${event.slug}/2026`}
            winners={event.winners ?? []}
          />
          <TournamentHowToPlay howToPlay={event.howToPlay} />
        </div>
      </div>
    </SiteShell>
  );
}
