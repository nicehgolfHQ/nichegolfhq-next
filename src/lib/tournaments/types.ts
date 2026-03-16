export type TournamentChannel = "midam" | "senior" | "junior";

export interface PastResult {
  year: number;
  champion: string;
  score?: string;
  runnerUp?: string;
  notes?: string;
}

export interface HowToPlayEntry {
  label: string;
  href?: string;
  note?: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  date: string; // ISO date e.g. "2026-03-15"
  author?: string;
  summary?: string; // Short blurb for cards / SEO
  content: string[]; // Array of paragraphs (rendered as <p> tags)
  photos?: string[]; // Array of image URLs for photo gallery
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
  // Course rating/slope (prefer furthest/back/championship tee)
  coursePar?: number;
  courseYardage?: number;
  courseRating?: number;
  courseSlope?: number;
  courseTeeName?: string;
  courseNotes?: string;

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

  // === HOW TO PLAY ===
  howToPlay?: HowToPlayEntry[];

  // === NEWS / ARTICLES ===
  news?: NewsArticle[];

  // === MEDIA ===
  heroImage?: string;
  logo?: string;
}
