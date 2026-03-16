import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import {
  getMidAmTournamentBySlug,
  listMidAmTournamentSlugs,
} from "@/lib/tournaments/midam";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { TournamentNews } from "@/components/tournaments/TournamentNews";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/* Helper: convert human-readable date string to ISO 8601             */
/* ------------------------------------------------------------------ */
const MONTH_MAP: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08", aug: "08",
  september: "09", october: "10", november: "11", december: "12",
  jan: "01", feb: "02", mar: "03", apr: "04", jun: "06",
  jul: "07", sep: "09", oct: "10", nov: "11", dec: "12",
};

function parseDateToISO(raw: string): { start: string; end?: string } | null {
  if (!raw) return null;
  // "Aug 18–21, 2026" or "June 15-18, 2026"
  const rangeMatch = raw.match(
    /^(\w+)\s+(\d{1,2})[–\-](\d{1,2}),?\s+(\d{4})$/
  );
  if (rangeMatch) {
    const mm = MONTH_MAP[rangeMatch[1].toLowerCase()];
    if (mm) {
      const yyyy = rangeMatch[4];
      const d1 = rangeMatch[2].padStart(2, "0");
      const d2 = rangeMatch[3].padStart(2, "0");
      return { start: `${yyyy}-${mm}-${d1}`, end: `${yyyy}-${mm}-${d2}` };
    }
  }
  // "January 2026"
  const monthYear = raw.match(/^(\w+)\s+(\d{4})$/);
  if (monthYear) {
    const mm = MONTH_MAP[monthYear[1].toLowerCase()];
    if (mm) return { start: `${monthYear[2]}-${mm}` };
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
    const parsed = parseDateToISO(tournament.dates2026);
    if (parsed) {
      eventLd.startDate = parsed.start;
      if (parsed.end) { eventLd.endDate = parsed.end; }
    }
  }

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
        </div>
      </div>
    </SiteShell>
  );
}
