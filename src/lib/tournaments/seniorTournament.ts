import type { Tournament } from "@/lib/tournaments/types";
import type { getSeniorMajorBySlug } from "@/lib/seniorMajors";

export function seniorVenueUnconfirmed(note?: string): boolean {
  return /venue for \d{4} pending confirmation/i.test(note ?? "");
}

/** Public record for a senior hub. Internal notes stay on the source event. */
export function toTournament(
  event: NonNullable<ReturnType<typeof getSeniorMajorBySlug>>
): Tournament {
  const venueUnconfirmed = seniorVenueUnconfirmed(event.note);
  return {
    slug: event.slug,
    name: event.name,
    channel: "senior",
    logo: event.logo,
    month: 1,
    dates2026: event.dates2026 ?? event.month,
    startDate: event.startDate,
    endDate: event.endDate,
    venueStatus: venueUnconfirmed ? "unconfirmed" : undefined,
    course: venueUnconfirmed ? undefined : event.course,
    location: venueUnconfirmed ? undefined : event.location,
    coursePar: venueUnconfirmed ? undefined : event.coursePar,
    courseYardage: venueUnconfirmed ? undefined : event.courseYardage,
    courseDesigner: venueUnconfirmed ? undefined : event.courseDesigner,
    format: event.format,
    fieldSize: event.fieldSize,
    eligibility: event.eligibility,
    overview: venueUnconfirmed ? undefined : event.overview,
    pastResults: event.pastResults?.map((r) => ({
      year: r.year,
      champion: r.champion,
      score: r.score,
      runnerUp: r.runnerUp,
      venue: r.venue,
      resultsUrl: r.resultsUrl,
      divisions: r.divisions,
    })) ?? (event.winners ?? []).map((w) => ({
      year: w.year,
      champion: w.champion,
    })),
    pastResultsVenueLabel: event.pastResultsVenueLabel,
    howToPlay: event.howToPlay,
    news: event.news,
    golfGeniusUrl: event.golfGeniusUrl,
    golfGeniusUrlLabel: event.golfGeniusUrlLabel,
    tournamentWebsite: event.tournamentWebsite,
    tournamentWebsiteLabel: event.tournamentWebsiteLabel,
    liveStatus: event.liveStatus,
  };
}
