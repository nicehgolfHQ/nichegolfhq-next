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
  /** Extra people to list. Does not add scores or replace the rows. */
  fieldNames?: string[];
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
  /** Field list when the match cards include another division. One person per name. */
  fieldNames?: string[];
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
    complete: true,
    scope: "official-final",
    roundCount: 3,
    rows: [
      { place: "1", name: "Sam Jackson", rounds: [70, 68, 70], total: 208, toPar: "-5" },
      { place: "2", name: "Sean Rowen", rounds: [70, 74, 68], total: 212, toPar: "-1" },
      { place: "T3", name: "Jackson King", rounds: [69, 72, 73], total: 214, toPar: "+1" },
      { place: "T3", name: "Will McCurdy", rounds: [70, 74, 70], total: 214, toPar: "+1" },
      { place: "T3", name: "Ethan Hagood", rounds: [74, 69, 71], total: 214, toPar: "+1" },
      { place: "T6", name: "Jeff Reuter", rounds: [72, 72, 71], total: 215, toPar: "+2" },
      { place: "T6", name: "Bo Hayes", rounds: [72, 74, 69], total: 215, toPar: "+2" },
      { place: "T6", name: "JP Cave", rounds: [71, 73, 71], total: 215, toPar: "+2" },
      { place: "T9", name: "Charlie Hoyle", rounds: [74, 72, 70], total: 216, toPar: "+3" },
      { place: "T9", name: "John Quigley", rounds: [73, 71, 72], total: 216, toPar: "+3" },
      { place: "T9", name: "Alan Coshatt", rounds: [73, 70, 73], total: 216, toPar: "+3" },
      { place: "T9", name: "Blake Watts", rounds: [71, 74, 71], total: 216, toPar: "+3" },
      { place: "T9", name: "Lawrence Allan", rounds: [71, 73, 72], total: 216, toPar: "+3" },
      { place: "T9", name: "Andy Sajevic", rounds: [74, 70, 72], total: 216, toPar: "+3" },
      { place: "T9", name: "Hunter Hamrick", rounds: [72, 68, 76], total: 216, toPar: "+3" },
      { place: "T16", name: "Cam Roam", rounds: [74, 74, 70], total: 218, toPar: "+5" },
      { place: "T16", name: "Patrick Christovich", rounds: [72, 74, 72], total: 218, toPar: "+5" },
      { place: "T16", name: "John Hunter", rounds: [74, 74, 70], total: 218, toPar: "+5" },
      { place: "T16", name: "Ryan Terry", rounds: [76, 69, 73], total: 218, toPar: "+5" },
      { place: "T20", name: "Daniel Connolly", rounds: [76, 73, 70], total: 219, toPar: "+6" },
      { place: "T20", name: "Austin Coggin", rounds: [71, 73, 75], total: 219, toPar: "+6" },
      { place: "T20", name: "TJ Shuart", rounds: [73, 73, 73], total: 219, toPar: "+6" },
      { place: "T23", name: "Taylor Eyster", rounds: [73, 74, 73], total: 220, toPar: "+7" },
      { place: "T23", name: "Logan Blondell", rounds: [75, 72, 73], total: 220, toPar: "+7" },
      { place: "T23", name: "Blair Hamm", rounds: [68, 77, 75], total: 220, toPar: "+7" },
      { place: "T23", name: "Keith Guest", rounds: [69, 78, 73], total: 220, toPar: "+7" },
      { place: "T23", name: "Garrett Jones", rounds: [76, 71, 73], total: 220, toPar: "+7" },
      { place: "T23", name: "Trent Alexander", rounds: [74, 70, 76], total: 220, toPar: "+7" },
      { place: "T29", name: "Kevin Gillick", rounds: [76, 74, 71], total: 221, toPar: "+8" },
      { place: "T29", name: "Robbie Keyes", rounds: [69, 78, 74], total: 221, toPar: "+8" },
      { place: "T29", name: "Bradley Sutherland", rounds: [75, 70, 76], total: 221, toPar: "+8" },
      { place: "T32", name: "Hunter Hawkins", rounds: [70, 73, 79], total: 222, toPar: "+9" },
      { place: "T32", name: "Nick Robillard", rounds: [75, 74, 73], total: 222, toPar: "+9" },
      { place: "T32", name: "Steven Groover", rounds: [72, 74, 76], total: 222, toPar: "+9" },
      { place: "T35", name: "Blaise Wilson", rounds: [73, 77, 73], total: 223, toPar: "+10" },
      { place: "T35", name: "Jackson Beindorf", rounds: [76, 74, 73], total: 223, toPar: "+10" },
      { place: "T35", name: "Harlan Winn", rounds: [78, 73, 72], total: 223, toPar: "+10" },
      { place: "T35", name: "Sam Jenkins", rounds: [74, 76, 73], total: 223, toPar: "+10" },
      { place: "T35", name: "David Zickler", rounds: [75, 71, 77], total: 223, toPar: "+10" },
      { place: "T40", name: "Grady Brame", rounds: [76, 75, 74], total: 225, toPar: "+12" },
      { place: "T40", name: "Ben Reeves", rounds: [75, 75, 75], total: 225, toPar: "+12" },
      { place: "T40", name: "Jay Moore", rounds: [73, 78, 74], total: 225, toPar: "+12" },
      { place: "T40", name: "Lowery Thomas", rounds: [73, 76, 76], total: 225, toPar: "+12" },
      { place: "T40", name: "Clint Provost", rounds: [73, 73, 79], total: 225, toPar: "+12" },
      { place: "T40", name: "Mitchell Ford", rounds: [72, 79, 74], total: 225, toPar: "+12" },
      { place: "46", name: "Lee Birchall", rounds: [73, 79, 74], total: 226, toPar: "+13" },
      { place: "47", name: "Parker Sisk", rounds: [73, 79, 75], total: 227, toPar: "+14" },
      { place: "T48", name: "Jones Brown", rounds: [80, 77, 71], total: 228, toPar: "+15" },
      { place: "T48", name: "Ty Capps", rounds: [79, 70, 79], total: 228, toPar: "+15" },
      { place: "T48", name: "Tucker Jenkins", rounds: [70, 78, 80], total: 228, toPar: "+15" },
      { place: "T51", name: "Rob Couture", rounds: [74, 78, 77], total: 229, toPar: "+16" },
      { place: "T51", name: "Sam Audia III", rounds: [76, 74, 79], total: 229, toPar: "+16" },
      { place: "T53", name: "Will Swift", rounds: [75, 76, 79], total: 230, toPar: "+17" },
      { place: "T53", name: "Alex Balog", rounds: [81, 77, 72], total: 230, toPar: "+17" },
      { place: "T53", name: "Matt Barnes", rounds: [74, 82, 74], total: 230, toPar: "+17" },
      { place: "T53", name: "Ryan Nietfeldt", rounds: [76, 74, 80], total: 230, toPar: "+17" },
      { place: "T53", name: "Ben Fisher", rounds: [77, 72, 81], total: 230, toPar: "+17" },
      { place: "T58", name: "Peter Vitali", rounds: [79, 78, 74], total: 231, toPar: "+18" },
      { place: "T58", name: "Ryan Trocchio", rounds: [75, 80, 76], total: 231, toPar: "+18" },
      { place: "T58", name: "Conner Elder", rounds: [79, 74, 78], total: 231, toPar: "+18" },
      { place: "T61", name: "Scott Turner", rounds: [76, 77, 79], total: 232, toPar: "+19" },
      { place: "T61", name: "Clay Guerin", rounds: [78, 80, 74], total: 232, toPar: "+19" },
      { place: "T61", name: "Kyle Stiles", rounds: [81, 74, 77], total: 232, toPar: "+19" },
      { place: "T61", name: "Bill Wellons", rounds: [77, 79, 76], total: 232, toPar: "+19" },
      { place: "T61", name: "Haymes Snedeker", rounds: [77, 75, 80], total: 232, toPar: "+19" },
      { place: "66", name: "Jack Brown III", rounds: [72, 79, 82], total: 233, toPar: "+20" },
      { place: "67", name: "Wesley Willings", rounds: [77, 75, 82], total: 234, toPar: "+21" },
      { place: "T68", name: "Pete Griffith", rounds: [77, 79, 79], total: 235, toPar: "+22" },
      { place: "T68", name: "Jonathan Jeter", rounds: [76, 81, 78], total: 235, toPar: "+22" },
      { place: "T68", name: "John Goldasich", rounds: [83, 70, 82], total: 235, toPar: "+22" },
      { place: "T68", name: "Michael Manakides", rounds: [75, 78, 82], total: 235, toPar: "+22" },
      { place: "T72", name: "Tobin Ayers", rounds: [78, 82, 76], total: 236, toPar: "+23" },
      { place: "T72", name: "Wesley Pate", rounds: [76, 75, 85], total: 236, toPar: "+23" },
      { place: "T72", name: "Tyler McKeever", rounds: [79, 77, 80], total: 236, toPar: "+23" },
      { place: "75", name: "David Murvin", rounds: [80, 75, 82], total: 237, toPar: "+24" },
      { place: "T76", name: "Bo Farlow", rounds: [79, 78, 81], total: 238, toPar: "+25" },
      { place: "T76", name: "Tyler Stalker", rounds: [78, 75, 85], total: 238, toPar: "+25" },
      { place: "78", name: "Matt Mitchell", rounds: [79, 78, 82], total: 239, toPar: "+26" },
      { place: "79", name: "Brinson Holder", rounds: [81, 82, 80], total: 243, toPar: "+30" },
      { place: "T80", name: "Michael Brown", rounds: [84, 83, 79], total: 246, toPar: "+33" },
      { place: "T80", name: "Philip Risman", rounds: [75, 83, 88], total: 246, toPar: "+33" },
      { place: "WD", name: "Michael Stamberger", rounds: [81, 73, "WD"], total: 154, status: "WD" },
      { place: "WD", name: "Matthew Gourgeot", rounds: [77, "WD", null], total: 77, status: "WD" },
      { place: "WD", name: "Thomas Hugghins", rounds: [null, null, null], total: null, status: "WD" },
    ],
    sources: [{ record: "official-board" }],
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
      { flight: "Singles", round: "Sun, November 8", result: "East 7.50, West 10.50", teams: ["East", "West"] },
      { flight: "All divisions", round: "Final", result: "East 19.50, West 25.50", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Mike McCoy def. Mike Sposa, 2 and 1", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Todd White def. Trae Cassell, 6 and 5", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Gene Elliott def. Danny Nelson, 4 and 3", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Bryan Hoops def. Rick Stimmel, 5 and 4", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Corby Segal def. Bob Royak, 1 up", teams: ["East", "West"] },
      { flight: "Senior singles", round: "Sun, November 8", result: "Jason Pridmore def. Doug Hanzel, 1 up", teams: ["East", "West"] },
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
      { session: "Sunday singles, all divisions", east: "7.50", west: "10.50" },
    ],
    cumulative: { label: "Final, all divisions", east: "19.50", west: "25.50" },
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
      { session: "Sunday singles, mid-amateur", players: ["Bobby Massa", "Scott Harvey"], result: "Bobby Massa def. Scott Harvey, 7 and 6" },
      { session: "Sunday singles, mid-amateur", players: ["Evan Beck", "Mikel Martinson"], result: "Evan Beck def. Mikel Martinson, 6 and 5" },
      { session: "Sunday singles, mid-amateur", players: ["Christian Cavaliere", "Zach Foushee"], result: "Christian Cavaliere def. Zach Foushee, 1 up" },
      { session: "Sunday singles, mid-amateur", players: ["Will Davenport", "Drew Stoltz"], result: "Will Davenport def. Drew Stoltz, 4 and 3" },
      { session: "Sunday singles, mid-amateur", players: ["Stewart Hagestad", "Brett Patterson"], result: "Stewart Hagestad def. Brett Patterson, 2 and 1" },
      { session: "Sunday singles, mid-amateur", players: ["Parker Edens", "Matt Vogt"], result: "Parker Edens def. Matt Vogt, 1 up" },
      { session: "Sunday singles, mid-amateur", players: ["Nate Smith", "Jonathan Bale"], result: "Nate Smith def. Jonathan Bale, 1 up" },
      { session: "Sunday singles, mid-amateur", players: ["Christian Brand", "Jordan Russell"], result: "Christian Brand def. Jordan Russell, 3 and 2" },
      { session: "Sunday singles, mid-amateur", players: ["Andrew Price", "Chris Wheeler"], result: "Andrew Price def. Chris Wheeler, 3 and 2" },
      { session: "Sunday singles, mid-amateur", players: ["Josh Persons", "Stephen Behr"], result: "Josh Persons def. Stephen Behr, 6 and 5" },
      { session: "Sunday singles, mid-amateur", players: ["Nate Gahman", "Drew Kittleson"], result: "Nate Gahman halved with Drew Kittleson" },
      { session: "Sunday singles, mid-amateur", players: ["Andrew Bailey", "Brad Nurski"], result: "Andrew Bailey def. Brad Nurski, 1 up" },
    ],
    fieldNames: [
      "Andrew Bailey", "Evan Beck", "Scott Harvey", "Matt Vogt", "Christian Cavaliere", "Andrew Price", "Stephen Behr", "Will Davenport", "Jonathan Bale", "Christian Brand", "Brett Patterson", "Nate Gahman",
      "Stewart Hagestad", "Bobby Massa", "Nate Smith", "Mikel Martinson", "Drew Kittleson", "Drew Stoltz", "Zach Foushee", "Jordan Russell", "Brad Nurski", "Chris Wheeler", "Josh Persons", "Parker Edens",
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
    const names = snapshot.rows.flatMap((row) => (row.players?.length ? row.players : [row.name]));
    return [...new Set([...names, ...(snapshot.fieldNames ?? [])].map(individualName))];
  }
  if (snapshot.kind === "team-match") {
    const names = snapshot.fieldNames ?? snapshot.matches.flatMap((match) => match.players);
    return [...new Set(names.map(individualName))];
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
