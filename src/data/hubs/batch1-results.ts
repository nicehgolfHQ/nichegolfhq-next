/**
 * Partial 2026 results copied from articles and past-champion rows already on this site.
 * A missing round is null. These are not full fields.
 */

export type ResultSource = { articleSlug?: string; record: "article" | "past-champion" };

export type StrokeFinisher = {
  division?: string;
  place: string;
  name: string;
  rounds: Array<number | null>;
  total: number | null;
  detail?: string;
};

export type StrokeSnapshot = {
  kind: "stroke";
  complete: false;
  scope: "published-finishers";
  roundCount: number;
  rows: StrokeFinisher[];
  sources: ResultSource[];
};

export type MatchLine = {
  flight: string;
  round: string;
  result: string;
};

export type MatchSnapshot = {
  kind: "match";
  /** The stored format string does not by itself describe these stages. */
  formatConfidence: "string-only";
  complete: false;
  qualifying: { medalist: string } | null;
  matches: MatchLine[];
  sources: ResultSource[];
};

export type SessionScore = { session: string; east: string; west: string };

export type NamedMatch = { session: string; result: string };

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
  "gasparilla-invitational": {
    kind: "stroke",
    complete: false,
    scope: "published-finishers",
    roundCount: 3,
    rows: [
      { place: "1", name: "Hayes Brown", rounds: [67, 73, 68], total: 208, detail: "2-under" },
      { place: "2", name: "Peyton White", rounds: [null, null, 67], total: null, detail: "one shot back" },
      { place: "T3", name: "Michael Buttacavoli", rounds: [70, 70, 70], total: 210, detail: "even par" },
      { place: "T3", name: "Logan Blondell", rounds: [null, null, null], total: 210 },
    ],
    sources: [{ articleSlug: "2026-gasparilla-invitational-recap", record: "article" }],
  },
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
      { flight: "Championship", round: "Quarterfinal", result: "Rob Couture def. Joe Saladino, 2 and 1" },
      { flight: "Championship", round: "Quarterfinal", result: "Rob Couture def. Daniel Abbondandolo, 2 and 1" },
      { flight: "Championship", round: "Quarterfinal", result: "John Hunter def. Matt Parziale, 3 and 2" },
      { flight: "Championship", round: "Quarterfinal", result: "John Hunter def. Joseph Deraney, 2 and 1" },
      { flight: "Devereux Emmet Cup", round: "Final", result: "Matthew Naumec def. Andrew Lane" },
      { flight: "Dwight D. Eisenhower Cup", round: "Final", result: "Dave Scialabba def. Doug Clapp" },
      { flight: "William H. Taft Cup", round: "Final", result: "TJ Shuart def. Oscar Maxfield" },
      { flight: "Robert T. Jones Cup", round: "Final", result: "Connor Casey def. Brian Falk" },
      { flight: "Charles B. Macdonald Cup", round: "Final", result: "Jack Downey def. Steve White" },
    ],
    sources: [
      { articleSlug: "2026-travis-invitational-qualifying-recap", record: "article" },
      { articleSlug: "2026-travis-invitational-final-recap", record: "article" },
    ],
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
      { session: "Friday four-ball", result: "Mike Sposa and Todd White def. Bryan Hoops and Trae Cassell, 5 and 3" },
      { session: "Friday four-ball", result: "Danny Nelson and Brett Patterson def. Mike McCoy and Stewart Hagestad, 3 and 2" },
      { session: "Friday four-ball", result: "Matt Vogt and Rick Stimmel def. Gene Elliott and Parker Edens, 2 up" },
      { session: "Friday four-ball", result: "Doug Hanzel and Bob Royak def. Corby Segal and Jason Pridmore, 4 and 3" },
      { session: "Friday four-ball", result: "Bobby Massa and Mikel Martinson def. Christian Brand and Nate Gahman, 4 and 2" },
      { session: "Friday four-ball", result: "Nate Smith and Zach Foushee def. Christian Cavaliere and Scott Harvey, 2 and 1" },
      { session: "Friday four-ball", result: "Brad Nurski and Josh Persons def. Andrew Price and Andrew Bailey, 1 up" },
      { session: "Friday four-ball", result: "Jonathan Bale and Will Davenport halved with Chris Wheeler and Jordan Russell" },
      { session: "Friday four-ball", result: "Evan Beck and Stephen Behr halved with Drew Kittleson and Drew Stoltz" },
    ],
    sources: [
      { articleSlug: "2026-east-vs-west-matches-day-1-recap", record: "article" },
      { articleSlug: "2026-east-vs-west-matches-day-2-recap", record: "article" },
    ],
  },
};

export function resultSnapshot(slug: string): ResultSnapshot | null {
  return BATCH_1_RESULTS[slug] ?? null;
}

function sides(result: string): string[] {
  return result
    .split(/ def\. | halved with /)
    .map((side) => side.replace(/,.*$/, "").trim())
    .filter(Boolean);
}

export function snapshotNames(snapshot: ResultSnapshot): string[] {
  if (snapshot.kind === "stroke") return snapshot.rows.map((row) => row.name);
  const lines = snapshot.kind === "match" ? snapshot.matches.map((match) => match.result) : snapshot.matches.map((match) => match.result);
  const names = snapshot.kind === "match" && snapshot.qualifying ? [snapshot.qualifying.medalist] : [];
  for (const line of lines) names.push(...sides(line));
  return [...new Set(names)];
}
