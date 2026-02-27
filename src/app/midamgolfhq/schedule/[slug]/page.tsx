import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getMidAmTournamentBySlug, listMidAmTournamentSlugs } from "@/lib/tournaments/midam";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentLinks } from "@/components/tournaments/TournamentLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const t = getMidAmTournamentBySlug(slug);
  if (!t) return { title: "Mid-Am Schedule | midamgolfHQ" };

  const dates = t.dates2026 ?? t.typicalDates;
  const subtitle = `${t.course} • ${t.location}${dates ? ` • ${dates}` : ""}`;

  return {
    title: `${t.name} | Mid-Am Schedule | midamgolfHQ`,
    description: `Dates, venue, format, and past winners for ${t.name}. ${subtitle}`,
    alternates: { canonical: `/midamgolfhq/schedule/${t.slug}` },
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
  const pageUrl = `${baseUrl}/midamgolfhq/schedule/${tournament.slug}`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "midamgolfHQ",
        item: `${baseUrl}/midamgolfhq`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Mid-Am Major Schedule",
        item: `${baseUrl}/midamgolfhq/schedule`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tournament.name,
        item: pageUrl,
      },
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
      name: [tournament.course, tournament.location].filter(Boolean).join(" — ") || tournament.location || tournament.course || tournament.name,
      address: tournament.location,
    },
    description: `Dates, venue, format, and past winners for ${tournament.name}.`,
  };

  // Use a simple ISO date when we have a concrete date range; otherwise omit.
  if (tournament.dates2026) {
    eventLd.startDate = tournament.dates2026;
  }

  return (
    <SiteShell>
      <Script id={`ld-breadcrumbs-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(eventLd)}
      </Script>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="flex items-center justify-start">
          <Link
            href="/midamgolfhq/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white"
          >
            <span aria-hidden>←</span>
            <span>Schedule</span>
          </Link>
        </div>

        <div className="mt-4">
          <TournamentHero tournament={tournament} />
          <TournamentQuickFacts tournament={tournament} />
          <TournamentTabs tournament={tournament} />
          <TournamentLinks tournament={tournament} />
        </div>
      </div>
    </SiteShell>
  );
}
