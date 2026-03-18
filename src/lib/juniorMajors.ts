import type { HowToPlayEntry } from "@/lib/tournaments/types";

export type JuniorMajorEvent = {
  slug: string;
  name: string;
  month: string; // e.g. "January 2026"
  winners2026?: { boys?: string; girls?: string };
  note?: string;
  officialUrl?: string;
  winners?: { year: number; champion: string }[];
  howToPlay?: HowToPlayEntry[];
  // Venue
  course?: string;
  location?: string;
  coursePar?: number;
  courseYardage?: number;
  courseDesigner?: string;
  // Format
  format?: string;
  fieldSize?: string;
  eligibility?: string;
  // Editorial
  overview?: string;
  // History
  pastResults?: { year: number; champion: string; score?: string; runnerUp?: string }[];
};

export const JUNIOR_MAJOR_EVENTS_2026: JuniorMajorEvent[] = [
  { slug: "junior-orange-bowl", name: "Junior Orange Bowl", month: "January 2026", winners2026: { boys: "Tomas Restrepo", girls: "Charlotte Naughton" } },
  {
    slug: "ajga-simplify-boys-championship",
    name: "AJGA Simplify Boys Championship",
    month: "February 2026",
    officialUrl: "https://www.ajga.org/tournaments/ajga-simplify-boys-championship-at-carlton-woods",
    course: "The Club at Carlton Woods – Fazio Championship Course",
    location: "The Woodlands, TX",
    coursePar: 72,
    courseDesigner: "Tom Fazio",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational – boys ages 12–19",
    overview: "One of the premier AJGA Invitational events, the Simplify Boys Championship is held annually at the exclusive Club at Carlton Woods in The Woodlands, Texas. The Tom Fazio-designed Championship Course provides an elite test for the nation’s top junior golfers across three rounds of stroke play. The 2025 edition featured future stars including Miles Russell, who ran away with the title at 11 under par.",
    pastResults: [
      { year: 2025, champion: "Miles Russell", score: "-11 (64-70-71—205)", runnerUp: "T2: Michael Riebe / Giuseppe Puebla (-8)" },
    ],
  },
  { slug: "fortinet-stanford-invitational", name: "The Fortinet Stanford Invitational hosted by Rose Zhang", month: "February 2026" },
  { slug: "dustin-johnson-world-junior", name: "Dustin Johnson World Junior Golf Championship", month: "March 2026" },
  { slug: "junior-invitational-sage-valley", name: "Junior Invitational at Sage Valley", month: "March 2026", winners2026: { boys: "Miles Russell", girls: "Asterisk Talley" }, officialUrl: "https://juniorinvitational.com/", note: "72-hole stroke play \u2022 Sage Valley Golf Club, Graniteville, SC \u2022 Designed by Tom Fazio \u2022 Par 72, 7,437 yards \u2022 Field: 36 boys, 24 girls", winners: [
      { year: 2025, champion: "Boys: Miles Russell / Girls: Aphrodite Deng" },
      { year: 2024, champion: "Boys: Giovanni Daniele Binaghi / Girls: Asterisk Talley" },
      { year: 2023, champion: "Boys: Aldrich Potgieter / Girls: Anna Davis" },
      { year: 2022, champion: "Boys: Caleb Surratt / Girls: Amalie Leth-Nissen" },
      { year: 2020, champion: "Jackson Van Paris" },
      { year: 2019, champion: "Tom McKibbin" },
      { year: 2018, champion: "Akshay Bhatia" },
      { year: 2017, champion: "Joaquin Niemann" },
      { year: 2016, champion: "Austin Eckroat" },
      { year: 2015, champion: "Marcus Kinhult" },
      { year: 2014, champion: "Scottie Scheffler" },
      { year: 2013, champion: "Carson Young" },
      { year: 2012, champion: "Zachary Olsen" },
      { year: 2011, champion: "Nicholas Reach" },
    ] },
  { slug: "ajga-team-taylormade-invitational", name: "AJGA Team TaylorMade Invitational", month: "May 2026" },
  { slug: "nelly-invitational", name: "The Nelly Invitational presented by Chevron", month: "May 2026" },
  { slug: "southern-junior-championship", name: "Southern Junior Championship", month: "June 2026" },
  { slug: "ajga-wyndham-invitational", name: "AJGA Wyndham Invitational at Sedgefield", month: "June 2026" },
  { slug: "womens-western-junior", name: "Women's Western Junior Championship", month: "June 2026" },
  { slug: "western-junior", name: "Western Junior Championship", month: "June 2026" },
  { slug: "north-south-junior", name: "North & South Junior Golf Championship", month: "June 2026" },
  { slug: "rolex-girls-junior", name: "Rolex Girls Junior Championship", month: "June 2026" },
  { slug: "rlx-ralph-lauren-junior-classic", name: "RLX Ralph Lauren Junior Classic", month: "June 2026" },
  { slug: "wyndham-cup", name: "Wyndham Cup", month: "July 2026" },
  { slug: "us-girls-junior", name: "U.S. Girls' Junior Amateur", month: "July 2026" },
  { slug: "us-junior-amateur", name: "U.S. Junior Amateur", month: "July 2026" },
  { slug: "boys-junior-pga", name: "Boys Junior PGA Championship", month: "July 2026" },
  { slug: "us-womens-amateur", name: "U.S. Women's Amateur", month: "August 2026" },
  { slug: "us-amateur", name: "U.S. Amateur", month: "August 2026" },
  { slug: "junior-players-championship", name: "Junior Players Championship", month: "September 2026" },
  { slug: "junior-solheim-cup", name: "Junior Solheim Cup", month: "September 2026" },
  { slug: "junior-presidents-cup", name: "Junior Presidents Cup", month: "September 2026" },
  { slug: "annika-invitational", name: "ANNIKA Invitational", month: "October 2026" },
  { slug: "ajga-ping-invitational", name: "AJGA Ping Invitational", month: "October 2026" },
  { slug: "notah-begay-jr-national-championship", name: "Notah Begay Jr. Golf National Championship", month: "November 2026" },
  { slug: "rolex-tournament-of-champions", name: "Rolex Tournament of Champions", month: "November 2026" },
  { slug: "elite-invitational", name: "The Elite Invitational", month: "November 2026" },
  { slug: "junior-jones-cup", name: "Junior Jones Cup", month: "December 2026" },
];

export function getJuniorMajorBySlug(slug: string): JuniorMajorEvent | null {
  return JUNIOR_MAJOR_EVENTS_2026.find((e) => e.slug === slug) ?? null;
}

export function listJuniorMajorSlugs(): string[] {
  return JUNIOR_MAJOR_EVENTS_2026.map((e) => e.slug);
}

export function listJuniorMajorsByMonth(): Array<{
  month: string;
  monthKey: string;
  events: JuniorMajorEvent[];
}> {
  const order = [
    "January 2026", "February 2026", "March 2026", "April 2026",
    "May 2026", "June 2026", "July 2026", "August 2026",
    "September 2026", "October 2026", "November 2026", "December 2026",
  ];
  const groups = new Map<string, JuniorMajorEvent[]>();
  for (const e of JUNIOR_MAJOR_EVENTS_2026) {
    const arr = groups.get(e.month) || [];
    arr.push(e);
    groups.set(e.month, arr);
  }
  const out: Array<{ month: string; monthKey: string; events: JuniorMajorEvent[] }> = [];
  for (const m of order) {
    const events = groups.get(m);
    if (!events || !events.length) continue;
    const monthKey = m.split(" ")[0].slice(0, 3).toLowerCase();
    out.push({ month: m, monthKey, events });
  }
  return out;
}
