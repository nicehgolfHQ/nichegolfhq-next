import { PLAYERS, PLAYER_APPEARANCES } from "@/data/players/registry";
import type { FactSource } from "@/data/players/types";

export const EWING_EVENT_SLUG = "ewing-cup-four-ball";

const CHECKED_AT = "2026-11-07T19:04:00-06:00";

export type SourceRead = {
  url: string;
  title: string;
  outcome: "loaded" | "not_found";
};

export type PlannedRound = {
  id: "practice" | "round-1" | "round-2" | "final";
  label: string;
  date: string;
  course: string;
  detail: string;
  scored: boolean;
};

export const EWING_OFFICIAL = {
  home: "https://www.ewingcup.com/",
  information: "https://www.ewingcup.com/tournament-information",
} as const;

export const EWING_SNAPSHOT = {
  eventSlug: EWING_EVENT_SLUG,
  timezone: "America/Chicago",
  checkedAt: CHECKED_AT,
  /** Official pages loaded. A field and a public leaderboard were not on them. */
  fieldStatus: "not_published" as const,
  leaderboardStatus: "source_pending" as const,
  competitionStart: "2026-11-13",
  competitionEnd: "2026-11-15",
  sources: [
    { url: EWING_OFFICIAL.home, title: "DAC Ewing Cup home", outcome: "loaded" },
    { url: EWING_OFFICIAL.information, title: "DAC Ewing Cup tournament information", outcome: "loaded" },
    { url: "https://www.ewingcup.com/players", title: "Guessed players path", outcome: "not_found" },
    { url: "https://www.ewingcup.com/field", title: "Guessed field path", outcome: "not_found" },
    { url: "https://www.ewingcup.com/entries", title: "Guessed entries path", outcome: "not_found" },
    { url: "https://www.ewingcup.com/scoring", title: "Guessed scoring path", outcome: "not_found" },
    { url: "https://www.ewingcup.com/leaderboard", title: "Guessed leaderboard path", outcome: "not_found" },
  ] satisfies SourceRead[],
  missingInput: [
    "A public 2026 entry list or tee sheet that names the players.",
    "A public leaderboard URL. The tournament record has no scoring link, and the official site has no scoring or leaderboard page.",
  ],
  rounds: [
    {
      id: "practice",
      label: "Thursday",
      date: "2026-11-12",
      course: "Dallas Athletic Club",
      detail: "Player registration at the DAC pro shop. Practice rounds in morning and afternoon waves.",
      scored: false,
    },
    {
      id: "round-1",
      label: "Friday",
      date: "2026-11-13",
      course: "Blue Course",
      detail: "Tournament round 1. Tee times were still TBD on the official schedule.",
      scored: true,
    },
    {
      id: "round-2",
      label: "Saturday",
      date: "2026-11-14",
      course: "Gold Course",
      detail: "Tournament round 2. Tee times were still TBD. The Ewing Tailgate Party is after play.",
      scored: true,
    },
    {
      id: "final",
      label: "Sunday",
      date: "2026-11-15",
      course: "Blue Course",
      detail: "Final round. Full field start at 8:30 AM. Awards on the patio after play.",
      scored: true,
    },
  ] satisfies PlannedRound[],
  officialChampions: [
    { year: 2025, division: "Mid Amateur", players: "Charlie Holland and James Minahan" },
    { year: 2025, division: "Senior Amateur", players: "Bob Brewer and Greg Smith" },
    { year: 2024, division: "Mid Amateur", players: "Jordan Woolf and Travis Woolf" },
    { year: 2024, division: "Senior Amateur", players: "Bob Brewer and Greg Smith" },
    { year: 2023, division: "No tournament", players: "Course renovation" },
    { year: 2022, division: "Mid Amateur", players: "Michael Randle and Martin Board" },
    { year: 2022, division: "Senior Amateur", players: "Mike Peck and Steve Love" },
    { year: 2021, division: "Mid Amateur", players: "Torey Edwards and Ryder Epson" },
    { year: 2021, division: "Senior Amateur", players: "John Brellenthin and Tim Peterson" },
  ],
} as const;

export const EWING_SOURCE: FactSource = {
  url: EWING_OFFICIAL.information,
  title: "DAC Ewing Cup tournament information",
  checkedAt: CHECKED_AT,
  established: "2026 schedule and 2021-2025 champions by division.",
};

export function verifyEwingSnapshot() {
  const problems: string[] = [];
  if (!EWING_SNAPSHOT.checkedAt.endsWith("-06:00")) problems.push("checkedAt must use Central offset");
  const ewingRows = PLAYER_APPEARANCES.filter((row) => row.eventSlug === EWING_EVENT_SLUG);
  if (EWING_SNAPSHOT.fieldStatus === "not_published" && ewingRows.length > 0) {
    problems.push("Field is marked unpublished while player appearances exist");
  }
  for (const row of ewingRows) {
    if (!PLAYERS.some((player) => player.id === row.playerId)) {
      problems.push(`Missing player ${row.playerId}`);
    }
  }
  if (problems.length) throw new Error(problems.join("; "));
}
