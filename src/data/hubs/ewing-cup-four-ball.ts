import { PLAYERS, PLAYER_APPEARANCES } from "@/data/players/registry";
import type { FactSource } from "@/data/players/types";
import { auditScore, type FourBallScore } from "./four-ball";
import { EWING_2026_TEAMS, EWING_FIELD_CHECKED_AT } from "./ewing-2026-field";
import { EWING_EVENT_SLUG } from "./ewing-event";

/** When the public site was checked for a scoring link. Not the field-sheet time. */
const SCORING_CHECKED_AT = "2026-11-07T19:04:00-06:00";

export { EWING_EVENT_SLUG };

export type SourceRead = {
  url: string;
  title: string;
  outcome: "loaded" | "not_found";
};

export type PlannedRound = {
  id: "round-1" | "round-2" | "final";
  label: string;
  date: string;
  course: string;
  /** Internal schedule note. Not rendered. */
  detail: string;
  /** Reader-facing fact. Null when the only note is an internal caveat. */
  publicLine: string | null;
  /** Course par when this site has it. Blue Course par is not in the verified record. */
  par: number | null;
};

export const EWING_OFFICIAL = {
  home: "https://www.ewingcup.com/",
  information: "https://www.ewingcup.com/tournament-information",
  /** Public nav item "Apply". The page is password-protected; it is not an open form. */
  apply: "https://www.ewingcup.com/apply",
} as const;

export const EWING_SNAPSHOT = {
  eventSlug: EWING_EVENT_SLUG,
  timezone: "America/Chicago",
  scoringCheckedAt: SCORING_CHECKED_AT,
  fieldCheckedAt: EWING_FIELD_CHECKED_AT,
  fieldStatus: "posted" as const,
  leaderboardStatus: "source_pending" as "source_pending" | "verified" | "source_unavailable",
  /** Public scoring page. Null until a verified URL is recorded. */
  scoringUrl: null as string | null,
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
    "No public scoring link was found on the pages checked. A later public leaderboard URL can be added here before any score is copied.",
  ],
  rounds: [
    {
      id: "round-1",
      label: "Friday",
      date: "2026-11-13",
      course: "Blue Course",
      detail: "Round 1. Tee times were still TBD on the official schedule.",
      publicLine: null,
      par: null,
    },
    {
      id: "round-2",
      label: "Saturday",
      date: "2026-11-14",
      course: "Gold Course",
      detail: "Round 2. Tee times were still TBD on the official schedule.",
      publicLine: null,
      par: 72,
    },
    {
      id: "final",
      label: "Sunday",
      date: "2026-11-15",
      course: "Blue Course",
      detail: "Final round. Full field start at 8:30 AM.",
      publicLine: "Full field start at 8:30 AM.",
      par: null,
    },
  ] satisfies PlannedRound[],
  teams: EWING_2026_TEAMS.map((team) => ({
    ...team,
    score: null as FourBallScore | null,
  })),
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
  checkedAt: SCORING_CHECKED_AT,
  established: "Competition schedule and 2021-2025 champions by division.",
  kind: "public_page",
};

function sameInstant(left: string, right: string) {
  return left === right;
}

export function hasTimezoneOffset(iso: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(iso);
}

export function verifyEwingSnapshot() {
  const problems: string[] = [];
  if (!hasTimezoneOffset(EWING_SNAPSHOT.scoringCheckedAt)) problems.push("scoringCheckedAt needs a numeric offset");
  if (!hasTimezoneOffset(EWING_SNAPSHOT.fieldCheckedAt)) problems.push("fieldCheckedAt needs a numeric offset");
  if (sameInstant(EWING_SNAPSHOT.scoringCheckedAt, EWING_SNAPSHOT.fieldCheckedAt)) {
    problems.push("Field and scoring checks must stay separate timestamps");
  }
  const ids = new Set<string>();
  for (const team of EWING_SNAPSHOT.teams) {
    if (ids.has(team.id)) problems.push(`Duplicate team ${team.id}`);
    ids.add(team.id);
    if (EWING_SNAPSHOT.leaderboardStatus !== "verified" && team.score != null) {
      problems.push(`Team ${team.id} has a score while the leaderboard is ${EWING_SNAPSHOT.leaderboardStatus}`);
    }
    if (EWING_SNAPSHOT.leaderboardStatus === "verified" && team.score) {
      problems.push(...auditScore(team.score, EWING_SNAPSHOT.rounds.map((round) => round.par)));
    }
    for (const playerId of team.playerIds) {
      const player = PLAYERS.find((item) => item.id === playerId);
      if (!player) problems.push(`Missing player ${playerId}`);
    }
  }
  const mid = EWING_SNAPSHOT.teams.filter((team) => team.division === "mid-am").length;
  const senior = EWING_SNAPSHOT.teams.filter((team) => team.division === "senior").length;
  if (mid !== 32 || senior !== 20) problems.push(`Team counts ${mid}/${senior}`);
  const ewingRows = PLAYER_APPEARANCES.filter((row) => row.eventSlug === EWING_EVENT_SLUG);
  if (ewingRows.length !== EWING_SNAPSHOT.teams.length * 2) problems.push("Appearance count");
  const stollenwerck = PLAYERS.filter((player) => player.name.startsWith("John Stollenwerck"));
  if (stollenwerck.length !== 2) problems.push("Stollenwerck ids");
  if (problems.length) throw new Error(problems.join("; "));
}
