import type { FactSource, Player, PlayerAppearance, PlayerId } from "@/data/players/types";
import { EWING_EVENT_SLUG } from "./ewing-event";

/** When mid-amateur pairings were last confirmed. Separate from the scoring-page check. */
export const EWING_FIELD_CHECKED_AT = "2026-11-13T15:39:00-06:00";

export const EWING_FIELD_SOURCE: FactSource = {
  title: "2026 Ewing Cup Divisions / Flights / Teams",
  checkedAt: EWING_FIELD_CHECKED_AT,
  established: "2026 Ewing Cup mid-amateur and senior pairings confirmed from the public Golf Genius tournament results, Saturday tee sheet, and confirmed-player lists. Handicap figures are not published.",
  kind: "supplied_document",
};

export type FieldDivision = "mid-am" | "senior";

export type FieldTeam = {
  id: string;
  division: FieldDivision;
  divisionLabel: string;
  playerIds: [PlayerId, PlayerId];
  names: [string, string];
};

const MID_AM: Array<[string, string]> = [
  ["Michael Samp", "Scott Kraul"],
  ["Jordan Woolf", "Kendrick Vinar"],
  ["Ryan Zamorano", "Todd McCarroll"],
  ["Dan DePasquale", "Barrett Sandefur"],
  ["Tyler Palmer", "Steven Holtgrieve"],
  ["Kolton Crawford", "Sean Heidrick"],
  ["Colby Amparan", "Gary Ezmerlian"],
  ["Drew Noble", "Harrison Vance"],
  ["Kenny Cook", "Sean Rowen"],
  ["Jordan Russell", "John Stollenwerck Jr"],
  ["Michael Randle", "Zac Verses"],
  ["Rory Smith", "Kyle Dickerson"],
  ["Jonathan Keane", "Andrew Grice"],
  ["Michael Dwyer", "Sam Jenkins"],
  ["Zach Atkinson", "Brian Hatter"],
  ["Ryan Morley-Stockton", "Ryan Wilkins"],
  ["Sam Elkington", "Zach Tracy"],
  ["Robbie Keyes", "Michael Sass"],
  ["Clark Collier", "Kyle Hudelson"],
  ["James Minahan", "Charlie Holland"],
  ["Steve Paterson", "Austin Chung"],
  ["James Pagnam", "Ben Baxter"],
  ["Ryder Espon", "Matt Kendrick"],
  ["Scott Roudebush", "Alex Gutesha"],
  ["Austen Christiansen", "Chris Minton"],
  ["Tyler Comerford", "Matt Lewis"],
  ["Preston Fleenor", "Alec Johnson"],
  ["Cade Govender", "Peter Adams"],
  ["Ryan Munson", "Daniel Mitchell"],
  ["Marcus Jones", "Tate Oakley"],
  ["JJ Black", "Cameron Kirkpatrick"],
  ["Scott Winslett", "Will McDonald"],
];

const SENIOR: Array<[string, string]> = [
  ["Kirk Johnson", "Tray Tyner"],
  ["Mike Lohner", "Todd Vancil"],
  ["Darren Dortch", "Scott Schneider"],
  ["John Stollenwerck", "Neal Barfield"],
  ["Jeff Dandurand", "Chip Carter"],
  ["Alex Moore", "Kenneth Coutant"],
  ["Greg Smith", "Bob Brewer"],
  ["Don Gafner", "Jim Quinn"],
  ["Donald Dean", "Darren Jones"],
  ["Mark Motes", "Drew Landis"],
  ["Gene Aube", "Russ Childers"],
  ["John Brellenthin", "Tim Peterson"],
  ["Lewis Stephenson", "Lee Sandlin"],
  ["Jeff Dodson", "Ted Waldrip"],
  ["John Schaefer", "John Pierce"],
  ["Bill Steen", "Rick Houston"],
  ["Mark Crisco", "Rick Piersall"],
  ["Grady Bruce", "Todd Bonneau"],
  ["Mike Peck", "Steve Love"],
  ["Burt Allen", "Billy Joe Tolliver"],
];

export function playerIdFromName(name: string): PlayerId {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildTeams(division: FieldDivision, label: string, pairs: Array<[string, string]>): FieldTeam[] {
  return pairs.map(([left, right]) => {
    const playerIds: [PlayerId, PlayerId] = [playerIdFromName(left), playerIdFromName(right)];
    const id = `ewing-2026-${[...playerIds].sort().join("-")}`;
    return { id, division, divisionLabel: label, playerIds, names: [left, right] };
  });
}

export const EWING_2026_TEAMS: FieldTeam[] = [
  ...buildTeams("mid-am", "Mid-Amateur", MID_AM),
  ...buildTeams("senior", "Senior", SENIOR),
];

const byId = new Map<PlayerId, Player>();

for (const team of EWING_2026_TEAMS) {
  team.names.forEach((name, index) => {
    const id = team.playerIds[index];
    const existing = byId.get(id);
    if (existing && existing.name !== name) {
      throw new Error(`Player id collision: ${id} is both ${existing.name} and ${name}`);
    }
    if (!existing) {
      byId.set(id, {
        id,
        name,
        sources: [
          {
            ...EWING_FIELD_SOURCE,
            established: `Named on the 2026 Ewing Cup ${team.divisionLabel} team sheet.`,
          },
        ],
      });
    }
  });
}

export const EWING_2026_PLAYERS: Player[] = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));

export const EWING_2026_APPEARANCES: PlayerAppearance[] = EWING_2026_TEAMS.flatMap((team) =>
  team.playerIds.map((playerId, index) => {
    const partnerId = team.playerIds[index === 0 ? 1 : 0];
    return {
      playerId,
      eventSlug: EWING_EVENT_SLUG,
      year: 2026,
      sideLabel: team.divisionLabel,
      partnerIds: [partnerId],
      sources: [
        {
          ...EWING_FIELD_SOURCE,
          established: `2026 ${team.divisionLabel} pairing.`,
        },
      ],
    };
  }),
);
