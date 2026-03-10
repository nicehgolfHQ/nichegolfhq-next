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
  const subtitle = `${t.course} \u2022 ${t.location}${dates ? ` \u2022 ${dates}` : ""}`;

  return {
    title: `${t.name} | Mid-Am Schedule | midamgolfHQ`,
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
        item: `${baseUrl}/midamgolfhq`,
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
      name: [tournament.course, tournament.location].filter(Boolean).join(" \u2014 ") || tournament.location || tournament.course || tournament.name,
      address: tournament.location,
    },
    description: `Dates, venue, format, and past winners for ${tournament.name}.`,
  };

  // Use a simple ISO date when we have a concrete date range; otherwise omit.
  if (tournament.dates2026) {
    eventLd.startDate = tournament.dates2026;
  }

  return (
    <SiteShell hideHeader>
      <Script id={`ld-breadcrumbs-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-${tournament.slug}`} type="application/ld+json">
        {JSON.stringify(eventLd)}
      </Script>

      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-10">
          <div className="mb-6">
            <Link
              href="/midamgolfhq"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-white/70"
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
        </div>
      </div>
    </SiteShell>
  );
}
