export type TournamentChannel = "midam" | "senior" | "junior";

export interface PastResult {
  year: number;
  champion: string;
  score?: string;
  runnerUp?: string;
  notes?: string;
}

export interface Tournament {
  // === IDENTITY ===
  slug: string;
  name: string;
  shortName?: string;
  channel: TournamentChannel;

  // Optional note for schedule/index display (e.g., rescheduled)
  note?: string;

  // === SCHEDULE ===
  month: number; // 1-12
  dates2026?: string;
  dates2025?: string;
  typicalDates?: string;

  // === VENUE ===
  course?: string;
  location?: string;
  courseDesigner?: string;
  courseYear?: number;

  // === FORMAT ===
  format?: string;
  fieldSize?: string;
  eligibility?: string;
  daysOfPlay?: number;

  // === HISTORY & EDITORIAL ===
  founded?: number;
  overview?: string;
  prestige?: string;

  // === RESULTS ===
  pastResults?: PastResult[];

  // === LINKS ===
  golfGeniusUrl?: string;
  courseWebsite?: string;
  amateurgolfUrl?: string;
  socialHashtag?: string;

  // === MEDIA ===
  heroImage?: string;
  logo?: string;
}
