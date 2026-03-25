import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import {
  getMidAmTournamentBySlug,
  listMidAmTournamentSlugs,
  listMidAmTournaments,
} from "@/lib/tournaments/midam";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import { RelatedEvents } from "@/components/tournaments/RelatedEvents";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/* Helper: convert human-readable date string to ISO 8601             */
/* ------------------------------------------------------------------ */
const MONTH_MAP: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  aug: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  jun: "06",
  jul: "07",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

function parseDateToISO(dateStr?: string, month?: number): { start: string; end?: string } | null {
  if (!dateStr)
    return month ? { start: `2026-${String(month).padStart(2, "0")}-01` } : null;

  const MONTHS: Record<string, string> = {
    jan: "01", january: "01", feb: "02", february: "02",
    mar: "03", march: "03", apr: "04", april: "04",
    may: "05", jun: "06", june: "06", jul: "07", july: "07",
    aug: "08", august: "08", sep: "09", september: "09",
    oct: "10", october: "10", nov: "11", november: "11",
    dec: "12", december: "12",
  };

  // Pattern: "Aug 18\u201321, 2026" or "Mar 26\u201329, 2026"
  const rangeMatch = dateStr.match(/(\w+)\s+(\d{1,2})[\u2013\-](\d{1,2}),?\s*(\d{4})/);
  if (rangeMatch) {
    const mm = MONTHS[rangeMatch[1].toLowerCase().slice(0, 3)] || "01";
    const startDay = rangeMatch[2].padStart(2, "0");
    const endDay = rangeMatch[3].padStart(2, "0");
    const year = rangeMatch[4];
    return { start: `${year}-${mm}-${startDay}`, end: `${year}-${mm}-${endDay}` };
  }

  // Pattern: "January 2026" or "Feb 2026"
  const monthMatch = dateStr.match(/(\w+)\s+(\d{4})/);
  if (monthMatch) {
    const mm = MONTHS[monthMatch[1].toLowerCase().slice(0, 3)];
    if (mm) return { start: `${monthMatch[2]}-${mm}-01` };
  }

  // Fallback to month number
  return month ? { start: `2026-${String(month).padStart(2, "0")}-01` } : null;
}

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const t = getMidAmTournamentBySlug(slug);
  if (!t) return { title: "midamgolfHQ" };

  const dates = t.dates2026 ?? t.typicalDates;
  const subtitle = `${t.course} \u2022 ${t.location}${dates ? ` \u2022 ${dates}` : ""}`;

  return {
    title: `${t.name} | midamgolfHQ`,
    description: `Dates, venue, format, and past winners for ${t.name}. ${subtitle}`,
    alternates: { canonical: `/midamgolfhq/${t.slug}` },
  };
}

export default async function MidAmTournamentPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const tournament = getMidAmTournamentBySlug(slug);
  if (!tournament) notFound();

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/midamgolfhq/${tournament.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "midamgolfHQ", item: `${baseUrl}/midamgolfhq` },
      { "@type": "ListItem", position: 3, name: "Mid-Am Major Schedule", item: `${baseUrl}/midamgolfhq` },
      { "@type": "ListItem", position: 4, name: tournament.name, item: pageUrl },
    ],
  };

  const eventLd: any = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    url: pageUrl,
    sport: "Golf",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: "midamgolfHQ",
      url: `${baseUrl}/midamgolfhq`,
    },
    location: {
      "@type": "Place",
      name: [tournament.course, tournament.location].filter(Boolean).join(" \u2014 ") || tournament.location || tournament.course || tournament.name,
      address: tournament.location,
    },
    description: `Dates, venue, format, and past winners for ${tournament.name}.`,
    image: `${baseUrl}/og-midam.png`,
    performer: { "@type": "Organization", name: tournament.name },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "USD",
      description: "Amateur golf tournament",
    },
  };

  // Use ISO 8601 dates for structured data
  if (tournament.dates2026) {
    const parsed = parseDateToISO(tournament.dates2026, tournament.month);
    if (parsed) {
      eventLd.startDate = parsed.start;
      if (parsed.end) {
        eventLd.endDate = parsed.end;
      }
    }
  }

  const relatedEvents = listMidAmTournaments()
    .filter((t) => t.slug !== tournament.slug)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      month: MONTH_NAMES[t.month] || "",
    }));

  return (
    <SiteShell>
      <Script id={`ld-breadcrumbs-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(eventLd)}
      </Script>

      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-zinc-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-10">
          <div className="mb-6">
            <Link
              href="/midamgolfhq"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-700"
            >
              <span aria-hidden>&larr;</span>
              <span>midamgolfHQ</span>
            </Link>
          </div>
          <TournamentHero tournament={tournament} />
        </div>
      </section>

      {/* -- White Content -- */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <TournamentQuickFacts tournament={tournament} />
          <TournamentTabs tournament={tournament} />
          <TournamentHowToPlay howToPlay={tournament.howToPlay} />
          <TournamentNews news={tournament.news} />
          <RelatedEvents
            events={relatedEvents}
            brandSlug="midamgolfhq"
            brandLabel="midamgolfHQ"
          />
        </div>
      </div>
    </SiteShell>
  );
}
