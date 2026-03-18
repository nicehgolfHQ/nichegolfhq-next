import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentHowToPlay } from "@/components/tournaments/TournamentHowToPlay";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import { getJuniorMajorBySlug, listJuniorMajorSlugs } from "@/lib/juniorMajors";
import type { Tournament } from "@/lib/tournaments/types";

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
    description: `Dates, venue, format, and past winners for ${event.name}.`,
    alternates: { canonical: `/juniorgolfhq/${event.slug}` },
  };
}

/** Map JuniorMajorEvent fields into a Tournament-shaped object so we can
 *  reuse the same mid-am components (QuickFacts, Tabs, HowToPlay, News). */
function toTournament(event: ReturnType<typeof getJuniorMajorBySlug>): Tournament {
  if (!event) throw new Error("missing event");
  return {
    slug: event.slug,
    name: event.name,
    channel: "junior",
    month: 1,
    course: event.course,
    location: event.location,
    coursePar: event.coursePar,
    courseDesigner: event.courseDesigner,
    format: event.format,
    fieldSize: event.fieldSize,
    eligibility: event.eligibility,
    overview: event.overview,
    pastResults: event.pastResults?.map((r) => ({
      year: r.year,
      champion: r.champion,
      score: r.score,
    })),
    howToPlay: event.howToPlay,
    news: event.news,
  } as Tournament;
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
      { "@type": "ListItem", position: 2, name: "juniorgolfHQ", item: `${baseUrl}/juniorgolfhq` },
      { "@type": "ListItem", position: 3, name: "Junior Major Schedule", item: `${baseUrl}/juniorgolfhq` },
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

  const subtitle = [event.course, event.location, event.month]
    .filter(Boolean)
    .join(" \u2022 ");

  return (
    <SiteShell>
      <Script id={`ld-breadcrumbs-junior-${event.slug}`} type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id={`ld-event-junior-${event.slug}`} type="application/ld+json">
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
          <section className="text-center">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              {event.name}
            </h1>
            {subtitle && (
              <div className="mt-4 text-sm text-zinc-500">{subtitle}</div>
            )}
          </section>
        </div>
      </section>

      {/* -- White Content -- */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <TournamentQuickFacts tournament={tournament} />
          <TournamentTabs tournament={tournament} />
          <TournamentHowToPlay howToPlay={event.howToPlay} />
          <TournamentNews news={event.news} />
        </div>
      </div>
    </SiteShell>
  );
}
