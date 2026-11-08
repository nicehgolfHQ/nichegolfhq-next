/**
 * 2026 results. Partial snapshots are copied from articles and past-champion rows.
 * A missing round is null. Official boards keep source statuses and do not turn them into zero.
 */

import { gasparillaMainSnapshot, gasparillaSeniorSnapshot } from "@/data/hubs/gasparilla-public";
import { officialFormatSnapshot } from "@/data/hubs/official-formats";
import { officialRemainingSnapshot, womensWesternSnapshot } from "@/data/hubs/official-remaining";
import { officialStrokeSnapshot } from "@/data/hubs/official-stroke";

export type ResultSource = {
  articleSlug?: string;
  record: "article" | "past-champion" | "official-board";
  label?: string;
};

export type StrokeFinisher = {
  division?: string;
  place: string;
  name: string;
  rounds: Array<number | string | null>;
  total: number | string | null;
  detail?: string;
  hometown?: string;
  toPar?: string;
  status?: "ranked" | "CUT" | "WD" | "DQ" | "DNF" | "NC" | "NS" | "MC" | "RTD";
  /** One person per entry. A better-ball side is never stored as one combined name. */
  players?: string[];
};

export type StrokeSnapshot = {
  kind: "stroke";
  complete: boolean;
  scope: "published-finishers" | "official-overall" | "official-final" | "official-partial" | "official-award" | "official-totals" | "official-points";
  roundCount: number;
  /** Stableford points are not stroke scores. */
  scoring?: "strokes" | "stableford-points";
  /** Keeps the published column order when it is not rounds then total. */
  columnOrder?: "rounds-then-total" | "total-then-rounds";
  /** Short stage already stated by the source, such as "Through 36 holes". */
  stageLabel?: string;
  /** Public retrieval time. Provenance URLs stay off the page. */
  updatedLabel?: string;
  rows: StrokeFinisher[];
  /** Separate official divisions. Each keeps its own places. */
  divisions?: { label: string; par?: number; yardage?: number; rows: StrokeFinisher[] }[];
  /** Award standings for players who are already in rows. Not an extra field. */
  award?: { label: string; note: string; rows: StrokeFinisher[] };
  sources: ResultSource[];
};

export type MatchLine = {
  flight: string;
  /** The stage printed by the source. */
  round: string;
  result: string;
  /** One person per entry when the source names the players separately. */
  players?: string[];
  /** Side names such as East and West. Not people, and not part of the player field. */
  teams?: string[];
};

export type MatchSnapshot = {
  kind: "match";
  /** The stored format string does not by itself describe these stages. */
  formatConfidence: "string-only";
  complete: false;
  qualifying: { medalist: string } | null;
  /** Stroke-play rows printed with the matches. Not a second event. */
  qualifyingBoard?: { label: string; roundCount: number; rows: StrokeFinisher[] };
  matches: MatchLine[];
  sources: ResultSource[];
};

export type SessionScore = { session: string; east: string; west: string };

export type NamedMatch = {
  session: string;
  /** One person per entry. Partners are separate names, never a combined string. */
  players: string[];
  result: string;
};

export type TeamSnapshot = {
  kind: "team-match";
  complete: false;
  sessions: SessionScore[];
  cumulative: { label: string; east: string; west: string };
  matches: NamedMatch[];
  sources: ResultSource[];
};

export type ResultSnapshot = StrokeSnapshot | MatchSnapshot | TeamSnapshot;

export const BATCH_1_RESULTS: Record<string, ResultSnapshot> = {
  "gasparilla-invitational": gasparillaMainSnapshot(),
  "gasparilla-invitational-senior-division": gasparillaSeniorSnapshot(),
  "junior-orange-bowl": {
    kind: "stroke",
    complete: false,
    scope: "published-finishers",
    roundCount: 4,
    rows: [
      { division: "Boys", place: "1", name: "Tomas Restrepo", rounds: [69, 68, 64, 69], total: 270, detail: "14-under" },
      { division: "Boys", place: "2", name: "Frederick Egnatios", rounds: [67, 70, 69, 67], total: 273 },
      { division: "Boys", place: "T19", name: "Charlie Woods", rounds: [73, 72, 71, 72], total: 288, detail: "4-over" },
      { division: "Girls", place: "1", name: "Charlotte Naughton", rounds: [null, null, null, 69], total: 274, detail: "10-under" },
      { division: "Girls", place: "2", name: "Nina Choe", rounds: [null, null, null, null], total: null, detail: "seven shots back" },
    ],
    sources: [
      { articleSlug: "2026-junior-orange-bowl-recap", record: "article" },
      { record: "past-champion" },
    ],
  },
  "society-of-seniors-spring-classic": {
    kind: "stroke",
    complete: false,
    scope: "published-finishers",
    roundCount: 3,
    rows: [{ place: "1", name: "William Mallon", rounds: [null, null, null], total: null }],
    sources: [{ record: "past-champion" }],
  },
  "walter-j-travis-invitational": {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: { medalist: "Rob Couture" },
    matches: [
      { flight: "Championship", round: "Final", result: "Chris DeJohn def. Pat Wilson, 2 and 1" },
      { flight: "Championship", round: "Semifinal", result: "Chris DeJohn def. Rob Couture, 19 holes" },
      { flight: "Championship", round: "Semifinal", result: "Pat Wilson def. John Hunter" },
      { flight: "Championship", round: "Round of 16", result: "Rob Couture def. Joe Saladino, 2 and 1" },
      { flight: "Championship", round: "Quarterfinal", result: "Rob Couture def. Daniel Abbondandolo, 2 and 1" },
      { flight: "Championship", round: "Round of 16", result: "John Hunter def. Matt Parziale, 3 and 2" },
      { flight: "Championship", round: "Saturday", result: "John Hunter def. Joseph Deraney, 2 and 1" },
      { flight: "Devereux Emmet Cup", round: "Final", result: "Matthew Naumec def. Andrew Lane" },
      { flight: "Dwight D. Eisenhower Cup", round: "Final", result: "Dave Scialabba def. Doug Clapp" },
      { flight: "William H. Taft Cup", round: "Final", result: "TJ Shuart def. Oscar Maxfield" },
      { flight: "Robert T. Jones Cup", round: "Final", result: "Connor Casey def. Brian Falk" },
      { flight: "Charles B. Macdonald Cup", round: "Final", result: "Jack Downey def. Steve White" },
    ],
    sources: [
      { articleSlug: "2026-travis-invitational-qualifying-recap", record: "article" },
      { articleSlug: "2026-travis-invitational-saturday-results", record: "article" },
      { articleSlug: "2026-travis-invitational-final-recap", record: "article" },
    ],
  },
  "national-invitational-tournament": {
    kind: "stroke",
    complete: false,
    scope: "published-finishers",
    roundCount: 2,
    stageLabel: "Through 36 holes",
    rows: [
      { place: "1", name: "Sam Jackson", rounds: [70, 68], total: 138, detail: "4-under" },
      { place: "2", name: "Hunter Hamrick", rounds: [null, 68], total: 140, detail: "2-under" },
      { place: "3", name: "Jackson King", rounds: [null, 72], total: 141, detail: "1-under" },
      { place: "T4", name: "Alan Coshatt", rounds: [null, 70], total: 143, detail: "1-over" },
      { place: "T4", name: "Ethan Hagood", rounds: [null, 69], total: 143, detail: "1-over" },
      { place: "T4", name: "Hunter Hawkins", rounds: [null, 73], total: 143, detail: "1-over" },
    ],
    sources: [{ articleSlug: "2026-national-invitational-tournament-round-2-recap", record: "article", label: "Round 2 recap" }],
  },
  "rlx-ralph-lauren-junior-classic": {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: null,
    matches: [
      { flight: "Boys", round: "Final", result: "Rory Asselta def. Joseph Corcell (Fla.), 5&4" },
      { flight: "Girls", round: "Final", result: "Eliana Saga def. Clairey Lin (Canada), 2&1" },
    ],
    sources: [{ record: "official-board" }],
  },
  "junior-solheim-cup": {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: null,
    matches: [
      { flight: "Singles", round: "Singles", result: "Annabel Peaford (Europe) def. Asterisk Talley (U.S. Team), 1 up" },
      { flight: "Singles", round: "Singles", result: "Eliana Saga (U.S. Team) def. Adriana García Terol (Europe), 4 and 3" },
      { flight: "Singles", round: "Singles", result: "Lauren Crump (Europe) def. Amber Lee (U.S. Team), 3 and 2" },
      { flight: "Singles", round: "Singles", result: "Anna Ludvova (Europe) def. Grace Carter (U.S. Team), 2 and 1" },
      { flight: "Singles", round: "Singles", result: "Madeleine Conser (U.S. Team) def. Lana Guyot (Europe), 5 and 4" },
      { flight: "Singles", round: "Singles", result: "Kelly Zhang (U.S. Team) def. Caroline Perez-Tasso (Europe), 2 up" },
      { flight: "Singles", round: "Singles", result: "Lena Geier (Europe) def. Aubrey Hilgers (U.S. Team), 2up" },
      { flight: "Singles", round: "Singles", result: "Sofia Maier-Borst (Europe) def. Amelie Zalsman (U.S. Team), 2 and 1" },
      { flight: "Singles", round: "Singles", result: "Axelle Guillemard (Europe) def. Honorine Ferry (U.S. Team), 3 and 2" },
      { flight: "Singles", round: "Singles", result: "Carlota Lopez Minguela (Europe) def. Iris Lee (U.S. Team), 3 and 2" },
      {
        flight: "Singles",
        round: "Singles",
        result: "Anna Fang (U.S. Team) and Marta Muñoz (Europe), Tie",
        players: ["Anna Fang", "Marta Muñoz"],
      },
      { flight: "Singles", round: "Singles", result: "Alice Kong (Europe) def. Lily Peng (USA), 1 up" },
    ],
    sources: [{ record: "official-board" }],
  },
  "east-west-cup-matches": {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: null,
    matches: [
      { flight: "Four Ball", round: "Fri, November 6", result: "East 5.00, West 4.00", teams: ["East", "West"] },
      { flight: "Foursomes", round: "R1", result: "East 4.50, West 4.50", teams: ["East", "West"] },
      { flight: "Foursomes", round: "R2", result: "East 2.50, West 6.50", teams: ["East", "West"] },
    ],
    sources: [{ record: "official-board" }],
  },
  "walter-j-travis-invitational-senior-division": {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: null,
    matches: [
      { flight: "Dwight D. Eisenhower Cup", round: "Final", result: "Dave Scialabba def. Doug Clapp" },
    ],
    sources: [{ record: "official-board" }],
  },
  "east-vs-west-matches": {
    kind: "team-match",
    complete: false,
    sessions: [
      { session: "Friday four-ball", east: "5", west: "4" },
      { session: "Saturday morning foursomes", east: "4½", west: "4½" },
      { session: "Saturday afternoon foursomes", east: "2½", west: "6½" },
    ],
    cumulative: { label: "Entering Sunday singles", east: "12", west: "15" },
    matches: [
      { session: "Friday four-ball", players: ["Mike Sposa", "Todd White", "Bryan Hoops", "Trae Cassell"], result: "Mike Sposa and Todd White def. Bryan Hoops and Trae Cassell, 5 and 3" },
      { session: "Friday four-ball", players: ["Danny Nelson", "Brett Patterson", "Mike McCoy", "Stewart Hagestad"], result: "Danny Nelson and Brett Patterson def. Mike McCoy and Stewart Hagestad, 3 and 2" },
      { session: "Friday four-ball", players: ["Matt Vogt", "Rick Stimmel", "Gene Elliott", "Parker Edens"], result: "Matt Vogt and Rick Stimmel def. Gene Elliott and Parker Edens, 2 up" },
      { session: "Friday four-ball", players: ["Doug Hanzel", "Bob Royak", "Corby Segal", "Jason Pridmore"], result: "Doug Hanzel and Bob Royak def. Corby Segal and Jason Pridmore, 4 and 3" },
      { session: "Friday four-ball", players: ["Bobby Massa", "Mikel Martinson", "Christian Brand", "Nate Gahman"], result: "Bobby Massa and Mikel Martinson def. Christian Brand and Nate Gahman, 4 and 2" },
      { session: "Friday four-ball", players: ["Nate Smith", "Zach Foushee", "Christian Cavaliere", "Scott Harvey"], result: "Nate Smith and Zach Foushee def. Christian Cavaliere and Scott Harvey, 2 and 1" },
      { session: "Friday four-ball", players: ["Brad Nurski", "Josh Persons", "Andrew Price", "Andrew Bailey"], result: "Brad Nurski and Josh Persons def. Andrew Price and Andrew Bailey, 1 up" },
      { session: "Friday four-ball", players: ["Jonathan Bale", "Will Davenport", "Chris Wheeler", "Jordan Russell"], result: "Jonathan Bale and Will Davenport halved with Chris Wheeler and Jordan Russell" },
      { session: "Friday four-ball", players: ["Evan Beck", "Stephen Behr", "Drew Kittleson", "Drew Stoltz"], result: "Evan Beck and Stephen Behr halved with Drew Kittleson and Drew Stoltz" },
    ],
    sources: [
      { articleSlug: "2026-east-vs-west-matches-day-1-recap", record: "article" },
      { articleSlug: "2026-east-vs-west-matches-day-2-recap", record: "article" },
    ],
  },
};

export function resultSnapshot(slug: string): ResultSnapshot | null {
  return BATCH_1_RESULTS[slug] ?? (slug === "womens-western-junior" ? womensWesternSnapshot() : null) ?? officialRemainingSnapshot(slug) ?? officialStrokeSnapshot(slug) ?? officialFormatSnapshot(slug);
}

function individualName(name: string): string {
  if (/\band\b/i.test(name)) throw new Error(`Player name is a pairing, not one person: ${name}`);
  return name;
}

export function scopeLabel(snapshot: ResultSnapshot): string {
  if (snapshot.kind === "stroke" && snapshot.scope === "official-overall") return "Overall results";
  if (snapshot.kind === "stroke" && snapshot.scope === "official-final") return "Final results";
  if (snapshot.kind === "stroke" && snapshot.scope === "official-partial") return snapshot.stageLabel ?? "Partial results";
  if (snapshot.kind === "stroke" && snapshot.scope === "official-award") return "Low Senior award";
  if (snapshot.kind === "stroke" && snapshot.scope === "official-totals") return "Qualifying totals";
  if (snapshot.kind === "stroke" && snapshot.scope === "official-points") return "Stableford points";
  return snapshot.kind === "stroke" ? "Selected results" : "Selected matches";
}

export function snapshotNames(snapshot: ResultSnapshot): string[] {
  if (snapshot.kind === "stroke") {
    return snapshot.rows.flatMap((row) => (row.players?.length ? row.players : [row.name]).map(individualName));
  }
  if (snapshot.kind === "team-match") {
    return [...new Set(snapshot.matches.flatMap((match) => match.players.map(individualName)))];
  }
  if (snapshot.qualifyingBoard?.rows.length) {
    return snapshot.qualifyingBoard.rows.map((row) => individualName(row.name));
  }
  const names = snapshot.qualifying ? [individualName(snapshot.qualifying.medalist)] : [];
  for (const match of snapshot.matches) {
    if (match.teams?.length) continue;
    if (match.players?.length) {
      names.push(...match.players.map(individualName));
      continue;
    }
    for (const side of match.result.split(/ def\. | halved with /)) {
      names.push(individualName(side.replace(/,.*$/, "").trim()));
    }
  }
  return [...new Set(names.filter(Boolean))];
}
