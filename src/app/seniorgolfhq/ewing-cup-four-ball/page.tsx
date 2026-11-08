import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { EwingCupHub } from "@/components/hubs/EwingCupHub";
import { RelatedEvents } from "@/components/tournaments/RelatedEvents";
import { appearancesFor, playersInEvent } from "@/data/players/registry";
import { EWING_EVENT_SLUG, verifyEwingSnapshot } from "@/data/hubs/ewing-cup-four-ball";
import { breadcrumbLd, sportsEventLd } from "@/lib/seo/structuredData";
import { getSeniorMajorBySlug, SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";

export const metadata: Metadata = {
  title: "Ewing Cup Four-Ball | seniorgolfHQ",
  description:
    "Senior division dates, venue, format, and past winners for the Ewing Cup Four-Ball. Dallas Athletic Club • Dallas, TX • November 13-15, 2026",
  alternates: { canonical: "/seniorgolfhq/ewing-cup-four-ball" },
  openGraph: {
    type: "article",
    title: "Ewing Cup Four-Ball | seniorgolfHQ",
    description:
      "Senior division dates, venue, format, and past winners for the Ewing Cup Four-Ball. Dallas Athletic Club • Dallas, TX • November 13-15, 2026",
    url: "https://www.nichegolfhq.com/seniorgolfhq/ewing-cup-four-ball",
    siteName: "nichegolfHQ",
    images: [{ url: "/og/og-nichegolfhq.png", width: 1200, height: 630, alt: "Ewing Cup Four-Ball" }],
  },
};

export default function SeniorEwingCupHubPage() {
  verifyEwingSnapshot();
  const tournament = getSeniorMajorBySlug(EWING_EVENT_SLUG);
  if (!tournament) throw new Error("Senior Ewing Cup tournament record is missing");

  const entrants = playersInEvent(EWING_EVENT_SLUG)
    .filter((player) =>
      appearancesFor(player.id).some((row) => row.eventSlug === EWING_EVENT_SLUG && row.sideLabel === "Senior"),
    )
    .map((player) => ({
      ...player,
      appearances: appearancesFor(player.id).filter(
        (row) => row.eventSlug === EWING_EVENT_SLUG && row.sideLabel === "Senior",
      ),
    }));

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/seniorgolfhq/${tournament.slug}`;

  const relatedEvents = SENIOR_MAJOR_EVENTS_2026.filter((item) => item.slug !== tournament.slug).map((item) => ({
    slug: item.slug,
    name: item.name,
    month: item.month.replace(" 2026", ""),
  }));

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <style>{`
        body:has(.ewing-cup-hub) header.sticky {
          position: static;
        }
      `}</style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", item: baseUrl },
          { name: "seniorgolfHQ", item: `${baseUrl}/seniorgolfhq` },
          { name: tournament.name, item: pageUrl },
        ])}
      />
      <JsonLd
        data={sportsEventLd({
          name: tournament.name,
          url: pageUrl,
          description: "Senior division dates, venue, format, and past winners for the Ewing Cup Four-Ball.",
          course: tournament.course,
          location: tournament.location,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
        })}
      />
      <EwingCupHub
        division="senior"
        channelLabel="seniorgolfHQ"
        pastChampions={[]}
        entrants={entrants}
        articles={(tournament.news ?? []).map((article) => ({
          href: `/seniorgolfhq/${tournament.slug}/${article.slug}`,
          title: article.title,
          date: article.date,
          summary: article.summary ?? "",
        }))}
      />
      <div className="mx-auto w-full max-w-6xl px-5 pb-10">
        <RelatedEvents events={relatedEvents} brandSlug="seniorgolfhq" brandLabel="seniorgolfHQ" />
      </div>
    </SiteShell>
  );
}
