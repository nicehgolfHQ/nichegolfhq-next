import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import {
  getJuniorMajorBySlug,
  listJuniorMajorSlugs,
} from "@/lib/juniorMajors";
import type { Tournament } from "@/lib/tournaments/types";

export const dynamicParams = false

export function generateStaticParams() {
  return listJuniorMajorSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Helper: convert JuniorMajorEvent → Tournament for shared components */
/* ------------------------------------------------------------------ */
function toTournament(
  event: NonNullable<ReturnType<typeof getJuniorMajorBySlug>>
): Tournament {
  return {
    slug: event.slug,
    name: event.name,
    channel: "junior",
    month: 1, // placeholder — hero uses dates2026/typicalDates which we set below
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
  const m = raw.match(/^(\\w+)\\s+(\\d{4})$/);
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
  const event = getJuniorMajorBySlug(slug);
  if (!event) return { title: "juniorgolfHQ" };

  const subtitle = [event.course, event.location, event.month]
    .filter(Boolean)
    .join(" \u2022 ");

  return {
    title: `${event.name} | juniorgolfHQ`,
    description: `Dates, venue, format, and past winners for ${event.name}. ${subtitle}`,
    alternates: { canonical: `/juniorgolfhq/${event.slug}` },
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

  const tournament = toTournament(event);

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/juniorgolfhq/${event.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "juniorgolfHQ",
        item: `${baseUrl}/juniorgolfhq`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Junior Major Schedule",
        item: `${baseUrl}/juniorgolfhq`,
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
      name: "juniorgolfHQ",
      url: `${baseUrl}/juniorgolfhq`,
    },
    description: `Dates, venue, format, and past winners for ${event.name}.`,
    image: `${baseUrl}/og-junior.png`,
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
      description: "Amateur junior golf tournament",
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

  return (
    <SiteShell brandSlug="juniorgolfhq">
      <Script
        id={`ld-breadcrumbs-junior-${event.slug}`}
        type="application/ld+json"
      >
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script
        id={`ld-event-junior-${event.slug}`}
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
              href="/juniorgolfhq"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-700"
            >
              <span aria-hidden>&larr;</span>
              <span>juniorgolfHQ</span>
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
