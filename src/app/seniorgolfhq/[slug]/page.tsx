import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import { RelatedEvents } from "@/components/tournaments/RelatedEvents";
import {
  getSeniorMajorBySlug,
  listSeniorMajorSlugs,
  SENIOR_MAJOR_EVENTS_2026,
} from "@/lib/seniorMajors";
import type { Tournament } from "@/lib/tournaments/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeniorMajorSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Helper: convert SeniorMajorEvent → Tournament for shared components */
/* ------------------------------------------------------------------ */
function toTournament(
  event: NonNullable<ReturnType<typeof getSeniorMajorBySlug>>
): Tournament {
  return {
    slug: event.slug,
    name: event.name,
    channel: "senior",
    month: 1, // placeholder
    dates2026: event.month, // e.g. "February 2026"
    course: event.course,
    location: event.location,
    coursePar: event.coursePar,
    courseYardage: event.courseYardage,
    courseDesigner: event.courseDesigner,
    format: event.format,
    fieldSize: event.fieldSize,
    eligibility: event.eligibility,
    overview: event.overview,
    pastResults: event.pastResults?.map((r) => ({
      year: r.year,
      champion: r.champion,
      score: r.score,
      runnerUp: r.runnerUp,
    })) ?? (event.winners ?? []).map((w) => ({
      year: w.year,
      champion: w.champion,
    })),
    howToPlay: event.howToPlay,
    news: event.news,
  } as Tournament;
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
    if (mm) return `${m[2]}-${mm}-01`;
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

  const subtitle = [event.course, event.location, event.month]
    .filter(Boolean)
    .join(" \u2022 ");

  return {
    title: `${event.name} | seniorgolfHQ`,
    description: `Dates, venue, format, and past winners for ${event.name}. ${subtitle}`,
    alternates: { canonical: `/seniorgolfhq/${event.slug}` },
    openGraph: {
      type: "article",
      title: `${event.name} | seniorgolfHQ`,
      description: `Dates, venue, format, and past winners for ${event.name}. ${subtitle}`,
      url: `https://www.nichegolfhq.com/seniorgolfhq/${event.slug}`,
      siteName: "nichegolfHQ",
      images: [{ url: "/og/og-nichegolfhq.png", width: 1200, height: 630, alt: event.name }],
    },
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

  const tournament = toTournament(event);

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
    description: `Dates, venue, format, and past winners for ${event.name}.`,
    image: `${baseUrl}/og/og-nichegolfhq.png`,
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

  if (event.location) {
    eventLd.location = {
      "@type": "Place",
      name: [event.course, event.location].filter(Boolean).join(" \u2014 "),
      address: event.location,
    };
  }

  if (isoDate) {
    eventLd.startDate = isoDate;
  }

  const relatedEvents = SENIOR_MAJOR_EVENTS_2026
    .filter((e) => e.slug !== event.slug)
    .map((e) => ({
      slug: e.slug,
      name: e.name,
      month: e.month.replace(" 2026", ""),
    }));

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

      {/* -- Hero -- */}
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
            brandSlug="seniorgolfhq"
            brandLabel="seniorgolfHQ"
          />
        </div>
      </div>
    </SiteShell>
  );
}
