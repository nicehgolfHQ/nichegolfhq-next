import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { EwingCupHub } from "@/components/hubs/EwingCupHub";
import { RelatedEvents } from "@/components/tournaments/RelatedEvents";
import { appearancesFor, playersInEvent } from "@/data/players/registry";
import { EWING_EVENT_SLUG, verifyEwingSnapshot } from "@/data/hubs/ewing-cup-four-ball";
import { breadcrumbLd, sportsEventLd } from "@/lib/seo/structuredData";
import { getMidAmTournamentBySlug, listMidAmTournaments } from "@/lib/tournaments/midam";

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const metadata: Metadata = {
  title: "Ewing Cup Four-Ball | midamgolfHQ",
  description: "Dates, venue, format, and past winners for Ewing Cup Four-Ball. Dallas Athletic Club • Dallas, TX • November 13-15, 2026",
  alternates: { canonical: "/midamgolfhq/ewing-cup-four-ball" },
  openGraph: {
    type: "article",
    title: "Ewing Cup Four-Ball | midamgolfHQ",
    description: "Dates, venue, format, and past winners for Ewing Cup Four-Ball. Dallas Athletic Club • Dallas, TX • November 13-15, 2026",
    url: "https://www.nichegolfhq.com/midamgolfhq/ewing-cup-four-ball",
    siteName: "nichegolfHQ",
    images: [{ url: "/og/og-nichegolfhq.png", width: 1200, height: 630, alt: "Ewing Cup Four-Ball" }],
  },
};

export default function EwingCupHubPage() {
  verifyEwingSnapshot();
  const tournament = getMidAmTournamentBySlug(EWING_EVENT_SLUG);
  if (!tournament) throw new Error("Ewing Cup tournament record is missing");

  const entrants = playersInEvent(EWING_EVENT_SLUG).map((player) => ({
    ...player,
    appearances: appearancesFor(player.id),
  }));

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/midamgolfhq/${tournament.slug}`;

  const relatedEvents = listMidAmTournaments()
    .filter((item) => item.slug !== tournament.slug)
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      month: MONTH_NAMES[item.month] || "",
    }));

  return (
    <SiteShell>
      <style>{`
        body:has(.ewing-cup-hub) header.sticky {
          position: static;
        }
      `}</style>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", item: baseUrl },
          { name: "midamgolfHQ", item: `${baseUrl}/midamgolfhq` },
          { name: tournament.name, item: pageUrl },
        ])}
      />
      <JsonLd
        data={sportsEventLd({
          name: tournament.name,
          url: pageUrl,
          description: "Dates, venue, format, and past winners for Ewing Cup Four-Ball.",
          liveStatus: tournament.liveStatus,
          course: tournament.course,
          location: tournament.location,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
        })}
      />
      <EwingCupHub pastChampions={tournament.pastResults ?? []} entrants={entrants} />
      <div className="mx-auto w-full max-w-6xl px-5 pb-10">
        <RelatedEvents events={relatedEvents} brandSlug="midamgolfhq" brandLabel="midamgolfHQ" />
      </div>
    </SiteShell>
  );
}
