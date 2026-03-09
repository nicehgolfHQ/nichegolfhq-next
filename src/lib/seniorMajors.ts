import type { HowToPlayEntry } from "@/lib/tournaments/types";

export type SeniorMajorEvent = {
  slug: string;
  name: string;
  month: string; // e.g. "February 2026" or "Aug/Sep 2026"
  format?: string; // short label used on schedule + hubs (match Mid-Am style)
  note?: string;
  officialUrl?: string;
  winners?: { year: number; champion: string }[];
  howToPlay?: HowToPlayEntry[];
};

export const SENIOR_MAJOR_EVENTS_2026: SeniorMajorEvent[] = [
  { slug: "society-of-seniors-spring-classic", name: "Society of Seniors: Spring Classic", month: "February 2026", format: "54-hole stroke play", winners: [{ year: 2026, champion: "William Mallon" }] },
  { slug: "gasparilla-invitational-senior-division", name: "Gasparilla Invitational (Senior Division)", month: "February 2026", format: "54-hole stroke play", winners: [{ year: 2026, champion: "Jeff Frazier" }] },
  { slug: "jones-cup-senior-invitational", name: "Jones Cup Senior Invitational", month: "February 2026", format: "54-hole stroke play", winners: [{ year: 2026, champion: "Mike McCoy" }] },
  { slug: "golfweek-senior-amateur-championship", name: "Golfweek Senior Amateur Championship", month: "March/April 2026", format: "72-hole stroke play" },
  { slug: "george-coleman-invitational-senior-division", name: "George Coleman Invitational (Senior Division)", month: "April 2026", format: "54-hole stroke play" },
  { slug: "society-of-seniors-senior-masters", name: "Society of Seniors: Senior Masters", month: "April 2026", format: "54-hole stroke play" },
  { slug: "trans-mississippi-senior-championship", name: "Trans-Mississippi Senior Championship", month: "May 2026", format: "54-hole stroke play" },
  { slug: "john-t-lupton-memorial-senior-division", name: "John T. Lupton Memorial (Senior Division)", month: "May 2026", format: "54-hole stroke play" },
  { slug: "huddleston-cup-senior-division", name: "Huddleston Cup (Senior Division)", month: "May 2026", format: "54-hole stroke play" },
  { slug: "ra-senior-amateur", name: "R&A Senior Amateur Championship", month: "July 2026", format: "stroke play + match play" },
  { slug: "north-south-senior-mens-amateur", name: "North & South Senior Men's Amateur Championship", month: "August 2026", format: "match play" },
  { slug: "sunnehanna-senior-amateur", name: "Sunnehanna Senior Amateur Championship", month: "August 2026", format: "stroke play" },
  { slug: "valentine-invitational", name: "Valentine Invitational", month: "August 2026", format: "54-hole stroke play" },
  { slug: "senior-porter-cup", name: "Senior Porter Cup", month: "September 2026", format: "54-hole stroke play" },
  { slug: "usga-mens-senior-amateur", name: "USGA Men's Senior Amateur", month: "August/September 2026", format: "stroke play + match play" },
  { slug: "crump-cup-senior-division", name: "The Crump Cup (Senior Division)", month: "September 2026", format: "stroke play" },
  { slug: "international-senior-individual-championship", name: "International Senior Individual Championship", month: "October 2026", format: "72-hole stroke play" },
  { slug: "ojai-senior-cup", name: "Ojai Senior Cup", month: "October 2026", format: "match play" },
  { slug: "reynolds-senior-invitational", name: "Reynolds Senior Invitational", month: "October 2026", format: "54-hole stroke play" },
  { slug: "california-senior-amateur", name: "California Senior Amateur Championship", month: "November 2026", format: "stroke play + match play" },
  { slug: "east-west-cup-matches", name: "East West Cup Matches", month: "November 2026", format: "team matches" },
  { slug: "society-of-seniors-ralph-bogart", name: "Society of Seniors: Ralph Bogart", month: "November 2026", format: "54-hole stroke play" },
];

export function getSeniorMajorBySlug(slug: string): SeniorMajorEvent | null {
  return SENIOR_MAJOR_EVENTS_2026.find((e) => e.slug === slug) ?? null;
}

export function listSeniorMajorSlugs(): string[] {
  return SENIOR_MAJOR_EVENTS_2026.map((e) => e.slug);
}

export function listSeniorMajorsByMonth(): Array<{
  month: string;
  monthKey: string;
  events: SeniorMajorEvent[];
}> {
  const order = [
    "January 2026", "February 2026", "March 2026", "March/April 2026",
    "April 2026", "May 2026", "June 2026", "July 2026",
    "August 2026", "August/September 2026", "September 2026",
    "October 2026", "November 2026", "December 2026",
  ];
  const groups = new Map<string, SeniorMajorEvent[]>();
  for (const e of SENIOR_MAJOR_EVENTS_2026) {
    const arr = groups.get(e.month) || [];
    arr.push(e);
    groups.set(e.month, arr);
  }
  const out: Array<{ month: string; monthKey: string; events: SeniorMajorEvent[] }> = [];
  for (const m of order) {
    const events = groups.get(m);
    if (!events || !events.length) continue;
    const monthKey = m.split(" ")[0].slice(0, 3).toLowerCase();
    out.push({ month: m, monthKey, events });
  }
  return out;
}
