export type Side = "East" | "West";

export type VerifiedMatch = {
  session: "saturday-am" | "saturday-pm";
  east: [string, string];
  west: [string, string];
  winner: Side | null;
  result: string;
  eastPoints: number;
  westPoints: number;
};

export const OFFICIAL_SCORING_URL =
  "https://2026eastwestmatches.golfgenius.com/pages/13130623543135991976";

export const VENUE_PHOTO = {
  src: "/images/articles/2026-east-vs-west-day-2.jpg",
  alt: "Golf course green beside a lake",
};

export const THROUGH_LABEL = "Saturday, Nov. 7, afternoon foursomes";

export const CUMULATIVE = { East: 12, West: 15 } as const;

export const SESSIONS = [
  {
    id: "friday",
    label: "Friday",
    detail: "Four-ball",
    East: 5,
    West: 4,
    status: "Final" as const,
    note: "Individual Friday pairings are not in this verified set.",
  },
  {
    id: "saturday-am",
    label: "Saturday morning",
    detail: "Foursomes",
    East: 4.5,
    West: 4.5,
    status: "Final" as const,
    note: null,
  },
  {
    id: "saturday-pm",
    label: "Saturday afternoon",
    detail: "Foursomes",
    East: 2.5,
    West: 6.5,
    status: "Final" as const,
    note: null,
  },
  {
    id: "sunday",
    label: "Sunday",
    detail: "Singles",
    East: null,
    West: null,
    status: "Not started" as const,
    note: "Singles have not started. The draw is not in this verified set, and there are no scores.",
  },
] as const;

export type SessionId = (typeof SESSIONS)[number]["id"];

/** Saturday morning foursomes. Jonathan supplied results, pt123u. */
const SATURDAY_AM: VerifiedMatch[] = [
  { session: "saturday-am", east: ["Christian Brand", "Andrew Price"], west: ["Bobby Massa", "Zach Foushee"], winner: "West", result: "4 and 3", eastPoints: 0, westPoints: 1 },
  { session: "saturday-am", east: ["Jonathan Bale", "Christian Cavaliere"], west: ["Parker Edens", "Jordan Russell"], winner: "West", result: "2 and 1", eastPoints: 0, westPoints: 1 },
  { session: "saturday-am", east: ["Todd White", "Evan Beck"], west: ["Bryan Hoops", "Nate Smith"], winner: "East", result: "7 and 5", eastPoints: 1, westPoints: 0 },
  { session: "saturday-am", east: ["Nate Gahman", "Brett Patterson"], west: ["Brad Nurski", "Drew Kittleson"], winner: "West", result: "5 and 4", eastPoints: 0, westPoints: 1 },
  { session: "saturday-am", east: ["Doug Hanzel", "Scott Harvey"], west: ["Jason Pridmore", "Mikel Martinson"], winner: "East", result: "4 and 3", eastPoints: 1, westPoints: 0 },
  { session: "saturday-am", east: ["Mike Sposa", "Bob Royak"], west: ["Gene Elliott", "Mike McCoy"], winner: "East", result: "1 up", eastPoints: 1, westPoints: 0 },
  { session: "saturday-am", east: ["Will Davenport", "Stephen Behr"], west: ["Stewart Hagestad", "Chris Wheeler"], winner: "East", result: "2 and 1", eastPoints: 1, westPoints: 0 },
  { session: "saturday-am", east: ["Rick Stimmel", "Danny Nelson"], west: ["Corby Segal", "Trae Cassell"], winner: null, result: "halved", eastPoints: 0.5, westPoints: 0.5 },
  { session: "saturday-am", east: ["Matt Vogt", "Andrew Bailey"], west: ["Josh Persons", "Drew Stoltz"], winner: "West", result: "4 and 3", eastPoints: 0, westPoints: 1 },
];

/** Saturday afternoon foursomes. Jonathan supplied results, pt124u. */
const SATURDAY_PM: VerifiedMatch[] = [
  { session: "saturday-pm", east: ["Todd White", "Rick Stimmel"], west: ["Bryan Hoops", "Mike McCoy"], winner: "East", result: "1 up", eastPoints: 1, westPoints: 0 },
  { session: "saturday-pm", east: ["Andrew Bailey", "Christian Cavaliere"], west: ["Brad Nurski", "Zach Foushee"], winner: "West", result: "4 and 3", eastPoints: 0, westPoints: 1 },
  { session: "saturday-pm", east: ["Scott Harvey", "Evan Beck"], west: ["Josh Persons", "Jordan Russell"], winner: null, result: "halved", eastPoints: 0.5, westPoints: 0.5 },
  { session: "saturday-pm", east: ["Mike Sposa", "Andrew Price"], west: ["Corby Segal", "Bobby Massa"], winner: "West", result: "2 and 1", eastPoints: 0, westPoints: 1 },
  { session: "saturday-pm", east: ["Bob Royak", "Stephen Behr"], west: ["Trae Cassell", "Chris Wheeler"], winner: "West", result: "3 and 2", eastPoints: 0, westPoints: 1 },
  { session: "saturday-pm", east: ["Brett Patterson", "Jonathan Bale"], west: ["Nate Smith", "Drew Kittleson"], winner: "West", result: "2 up", eastPoints: 0, westPoints: 1 },
  { session: "saturday-pm", east: ["Doug Hanzel", "Danny Nelson"], west: ["Jason Pridmore", "Gene Elliott"], winner: "East", result: "1 up", eastPoints: 1, westPoints: 0 },
  { session: "saturday-pm", east: ["Nate Gahman", "Will Davenport"], west: ["Stewart Hagestad", "Parker Edens"], winner: "West", result: "1 up", eastPoints: 0, westPoints: 1 },
  { session: "saturday-pm", east: ["Matt Vogt", "Christian Brand"], west: ["Drew Stoltz", "Mikel Martinson"], winner: "West", result: "3 and 2", eastPoints: 0, westPoints: 1 },
];

export const MATCHES: VerifiedMatch[] = [...SATURDAY_AM, ...SATURDAY_PM];

export function points(matches: VerifiedMatch[], side: "eastPoints" | "westPoints") {
  return matches.reduce((sum, match) => sum + match[side], 0);
}

export function formatPoints(value: number) {
  const halves = Math.round(value * 2);
  if (halves % 2 === 0) return String(halves / 2);
  return `${Math.floor(halves / 2)}½`;
}

export function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

export type SaturdayRecord = { w: number; l: number; h: number };

export function saturdayRecord(name: string): SaturdayRecord {
  const record = { w: 0, l: 0, h: 0 };
  for (const match of MATCHES) {
    const onEast = match.east.includes(name);
    const onWest = match.west.includes(name);
    if (!onEast && !onWest) continue;
    if (match.winner === null) record.h += 1;
    else if ((onEast && match.winner === "East") || (onWest && match.winner === "West")) record.w += 1;
    else record.l += 1;
  }
  return record;
}

export function teamOf(name: string): Side | null {
  const match = MATCHES.find((item) => item.east.includes(name) || item.west.includes(name));
  if (!match) return null;
  return match.east.includes(name) ? "East" : "West";
}

export function players(): string[] {
  const names = new Set<string>();
  for (const match of MATCHES) {
    match.east.forEach((name) => names.add(name));
    match.west.forEach((name) => names.add(name));
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

const EXPECTED_SATURDAY: Record<string, [number, number, number]> = {
  "Andrew Bailey": [0, 2, 0],
  "Andrew Price": [0, 2, 0],
  "Bob Royak": [1, 1, 0],
  "Bobby Massa": [2, 0, 0],
  "Brad Nurski": [2, 0, 0],
  "Brett Patterson": [0, 2, 0],
  "Bryan Hoops": [0, 2, 0],
  "Chris Wheeler": [1, 1, 0],
  "Christian Brand": [0, 2, 0],
  "Christian Cavaliere": [0, 2, 0],
  "Corby Segal": [1, 0, 1],
  "Danny Nelson": [1, 0, 1],
  "Doug Hanzel": [2, 0, 0],
  "Drew Kittleson": [2, 0, 0],
  "Drew Stoltz": [2, 0, 0],
  "Evan Beck": [1, 0, 1],
  "Gene Elliott": [0, 2, 0],
  "Jason Pridmore": [0, 2, 0],
  "Jonathan Bale": [0, 2, 0],
  "Jordan Russell": [1, 0, 1],
  "Josh Persons": [1, 0, 1],
  "Matt Vogt": [0, 2, 0],
  "Mike McCoy": [0, 2, 0],
  "Mike Sposa": [1, 1, 0],
  "Mikel Martinson": [1, 1, 0],
  "Nate Gahman": [0, 2, 0],
  "Nate Smith": [1, 1, 0],
  "Parker Edens": [2, 0, 0],
  "Rick Stimmel": [1, 0, 1],
  "Scott Harvey": [1, 0, 1],
  "Stephen Behr": [1, 1, 0],
  "Stewart Hagestad": [1, 1, 0],
  "Todd White": [2, 0, 0],
  "Trae Cassell": [1, 0, 1],
  "Will Davenport": [1, 1, 0],
  "Zach Foushee": [2, 0, 0],
};

export function verifyEastWestMock() {
  const problems: string[] = [];
  const am = MATCHES.filter((match) => match.session === "saturday-am");
  const pm = MATCHES.filter((match) => match.session === "saturday-pm");
  if (points(am, "eastPoints") !== 4.5 || points(am, "westPoints") !== 4.5) {
    problems.push("Saturday morning is not 4.5-4.5");
  }
  if (points(pm, "eastPoints") !== 2.5 || points(pm, "westPoints") !== 6.5) {
    problems.push("Saturday afternoon is not 2.5-6.5");
  }
  if (5 + 4.5 + 2.5 !== CUMULATIVE.East || 4 + 4.5 + 6.5 !== CUMULATIVE.West) {
    problems.push("Cumulative is not East 12, West 15");
  }
  for (const match of MATCHES) {
    if (match.eastPoints + match.westPoints !== 1) problems.push(`Points do not total 1: ${match.result}`);
  }
  const names = players();
  if (names.length !== Object.keys(EXPECTED_SATURDAY).length) {
    problems.push(`Player count ${names.length}`);
  }
  for (const name of names) {
    const sides = new Set<Side>();
    for (const match of MATCHES) {
      if (match.east.includes(name)) sides.add("East");
      if (match.west.includes(name)) sides.add("West");
    }
    if (sides.size !== 1) problems.push(`${name} is on both sides`);
    const record = saturdayRecord(name);
    const expected = EXPECTED_SATURDAY[name];
    if (!expected || record.w !== expected[0] || record.l !== expected[1] || record.h !== expected[2]) {
      problems.push(`${name} Saturday record ${record.w}-${record.l}-${record.h}`);
    }
  }
  if (problems.length) throw new Error(problems.join("; "));
}
