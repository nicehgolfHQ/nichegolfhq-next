import { notPostedRound, type FourBallScore } from "./four-ball";

/**
 * Ewing Cup scores, keyed by the official last-name pair.
 * Mid-amateur rows are in EWING_2026_MIDAM_SCORES; senior rows are in
 * EWING_2026_SENIOR_SCORES. Extend a team's `rounds` tuple with Saturday and
 * Sunday totals when those rounds are posted. Leave a missing round as null;
 * never fill it with zero.
 */
export type MidAmScoreEntry = {
  pair: string;
  officialPosition: string;
  rounds: [number | null, number | null, number | null];
  total: number;
  toPar: number;
};

export const EWING_2026_MIDAM_SCORES: MidAmScoreEntry[] = [
  { pair: "Keyes + Sass", officialPosition: "1", rounds: [62, null, null], total: 62, toPar: -10 },
  { pair: "Randle + Verses", officialPosition: "2", rounds: [63, null, null], total: 63, toPar: -9 },
  { pair: "Cook + Rowen", officialPosition: "T3", rounds: [65, null, null], total: 65, toPar: -7 },
  { pair: "Dwyer + Jenkins", officialPosition: "T3", rounds: [65, null, null], total: 65, toPar: -7 },
  { pair: "Atkinson + Hatter", officialPosition: "5", rounds: [66, null, null], total: 66, toPar: -6 },
  { pair: "Keane + Grice", officialPosition: "T6", rounds: [67, null, null], total: 67, toPar: -5 },
  { pair: "Woolf + Vinar", officialPosition: "T6", rounds: [67, null, null], total: 67, toPar: -5 },
  { pair: "Zamorano + McCarroll", officialPosition: "T6", rounds: [67, null, null], total: 67, toPar: -5 },
  { pair: "Christiansen + Minton", officialPosition: "T9", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Minahan + Holland", officialPosition: "T9", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Winslett + McDonald", officialPosition: "T9", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Smith + Dickerson", officialPosition: "T9", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Crawford + Heidrick", officialPosition: "T9", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Pagnam + Baxter", officialPosition: "T14", rounds: [69, null, null], total: 69, toPar: -3 },
  { pair: "Fleenor + Johnson", officialPosition: "T14", rounds: [69, null, null], total: 69, toPar: -3 },
  { pair: "Black + Kirkpatrick", officialPosition: "T14", rounds: [69, null, null], total: 69, toPar: -3 },
  { pair: "DePasquale + Sandefur", officialPosition: "T14", rounds: [69, null, null], total: 69, toPar: -3 },
  { pair: "Russell + Stollenwerck", officialPosition: "T18", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Paterson + Chung", officialPosition: "T18", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Govender + Adams", officialPosition: "T18", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Samp + Kraul", officialPosition: "T18", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Morley-Stockton + Wilkins", officialPosition: "T18", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Comerford + Lewis", officialPosition: "T23", rounds: [71, null, null], total: 71, toPar: -1 },
  { pair: "Collier + Hudelson", officialPosition: "T23", rounds: [71, null, null], total: 71, toPar: -1 },
  { pair: "Noble + Vance", officialPosition: "T23", rounds: [71, null, null], total: 71, toPar: -1 },
  { pair: "Palmer + Holtgrieve", officialPosition: "T26", rounds: [72, null, null], total: 72, toPar: 0 },
  { pair: "Espon + Kendrick", officialPosition: "T26", rounds: [72, null, null], total: 72, toPar: 0 },
  { pair: "Munson + Mitchell", officialPosition: "28", rounds: [73, null, null], total: 73, toPar: 1 },
  { pair: "Roudebush + Gutesha", officialPosition: "T29", rounds: [75, null, null], total: 75, toPar: 3 },
  { pair: "Elkington + Tracy", officialPosition: "T29", rounds: [75, null, null], total: 75, toPar: 3 },
  { pair: "Amparan + Ezmerlian", officialPosition: "T29", rounds: [75, null, null], total: 75, toPar: 3 },
  { pair: "Jones + Oakley", officialPosition: "32", rounds: [76, null, null], total: 76, toPar: 4 },
];

const SUFFIX = /^(jr|sr|ii|iii|iv)\.?$/i;

export function lastName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => !SUFFIX.test(part));
  return parts.at(-1) ?? name;
}

export function pairKey(names: [string, string]) {
  return `${lastName(names[0])} + ${lastName(names[1])}`;
}

function posting(strokes: number | null) {
  return strokes == null ? notPostedRound() : { strokes, status: "complete" as const };
}

export function scoreFromEntry(entry: MidAmScoreEntry): FourBallScore {
  return {
    rounds: [posting(entry.rounds[0]), posting(entry.rounds[1]), posting(entry.rounds[2])],
    total: entry.total,
    toPar: entry.toPar,
    thru: null,
    officialPosition: entry.officialPosition,
  };
}

export function midAmScoreFor(names: [string, string]): FourBallScore | null {
  const key = pairKey(names);
  const reversed = `${lastName(names[1])} + ${lastName(names[0])}`;
  const entry = EWING_2026_MIDAM_SCORES.find((row) => row.pair === key || row.pair === reversed);
  return entry ? scoreFromEntry(entry) : null;
}


export function midAmBoardIndex(names: [string, string]) {
  const key = pairKey(names);
  const reversed = `${lastName(names[1])} + ${lastName(names[0])}`;
  return EWING_2026_MIDAM_SCORES.findIndex((row) => row.pair === key || row.pair === reversed);
}

export function unusedMidAmScorePairs(teams: Array<{ division: string; names: [string, string] }>) {
  const used = new Set(
    teams
      .filter((team) => team.division === "mid-am")
      .flatMap((team) => [pairKey(team.names), `${lastName(team.names[1])} + ${lastName(team.names[0])}`]),
  );
  return EWING_2026_MIDAM_SCORES.filter((row) => !used.has(row.pair)).map((row) => row.pair);
}

export const EWING_2026_SENIOR_SCORES: MidAmScoreEntry[] = [
  { pair: "Johnson + Tyner", officialPosition: "1", rounds: [65, null, null], total: 65, toPar: -7 },
  { pair: "Brellenthin + Peterson", officialPosition: "T2", rounds: [66, null, null], total: 66, toPar: -6 },
  { pair: "Lohner + Vancil", officialPosition: "T2", rounds: [66, null, null], total: 66, toPar: -6 },
  { pair: "Moore + Coutant", officialPosition: "T2", rounds: [66, null, null], total: 66, toPar: -6 },
  { pair: "Bruce + Bonneau", officialPosition: "T5", rounds: [67, null, null], total: 67, toPar: -5 },
  { pair: "Stollenwerck + Barfield", officialPosition: "T5", rounds: [67, null, null], total: 67, toPar: -5 },
  { pair: "Stephenson + Sandlin", officialPosition: "7", rounds: [68, null, null], total: 68, toPar: -4 },
  { pair: "Steen + Houston", officialPosition: "T8", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Motes + Landis", officialPosition: "T8", rounds: [70, null, null], total: 70, toPar: -2 },
  { pair: "Dean + Jones", officialPosition: "10", rounds: [71, null, null], total: 71, toPar: -1 },
  { pair: "Schaefer + Pierce", officialPosition: "T11", rounds: [72, null, null], total: 72, toPar: 0 },
  { pair: "Smith + Brewer", officialPosition: "T11", rounds: [72, null, null], total: 72, toPar: 0 },
  { pair: "Dortch + Schneider", officialPosition: "T13", rounds: [73, null, null], total: 73, toPar: 1 },
  { pair: "Aube + Childers", officialPosition: "T13", rounds: [73, null, null], total: 73, toPar: 1 },
  { pair: "Gafner + Quinn", officialPosition: "T13", rounds: [73, null, null], total: 73, toPar: 1 },
  { pair: "Allen + Tolliver", officialPosition: "T16", rounds: [74, null, null], total: 74, toPar: 2 },
  { pair: "Peck + Love", officialPosition: "T16", rounds: [74, null, null], total: 74, toPar: 2 },
  { pair: "Dandurand + Carter", officialPosition: "T18", rounds: [76, null, null], total: 76, toPar: 4 },
  { pair: "Dodson + Waldrip", officialPosition: "T18", rounds: [76, null, null], total: 76, toPar: 4 },
  { pair: "Crisco + Piersall", officialPosition: "20", rounds: [77, null, null], total: 77, toPar: 5 },
];

export function seniorScoreFor(names: [string, string]): FourBallScore | null {
  const key = pairKey(names);
  const reversed = `${lastName(names[1])} + ${lastName(names[0])}`;
  const entry = EWING_2026_SENIOR_SCORES.find((row) => row.pair === key || row.pair === reversed);
  return entry ? scoreFromEntry(entry) : null;
}

export function seniorBoardIndex(names: [string, string]) {
  const key = pairKey(names);
  const reversed = `${lastName(names[1])} + ${lastName(names[0])}`;
  return EWING_2026_SENIOR_SCORES.findIndex((row) => row.pair === key || row.pair === reversed);
}

export function unusedSeniorScorePairs(teams: Array<{ division: string; names: [string, string] }>) {
  const used = new Set(
    teams
      .filter((team) => team.division === "senior")
      .flatMap((team) => [pairKey(team.names), `${lastName(team.names[1])} + ${lastName(team.names[0])}`]),
  );
  return EWING_2026_SENIOR_SCORES.filter((row) => !used.has(row.pair)).map((row) => row.pair);
}
