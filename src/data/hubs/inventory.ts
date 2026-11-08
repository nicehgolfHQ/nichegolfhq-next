import { JUNIOR_MAJOR_EVENTS_2026 } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";
import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";

export type HubChannel = "midam" | "junior" | "senior";

/** Presentation family. Classified from the recorded format string, not the event name. */
export type HubFormat = "stroke" | "four-ball" | "four-ball-match" | "match" | "team-match" | "unspecified";

export type HubTemplate = "legacy" | "format-hub" | "ewing-dedicated";

export type CalendarStanding =
  | "played-in-2026"
  | "scheduled-2026"
  | "in-progress-2026"
  | "year-only-2026"
  | "rescheduled-out"
  | "unknown";

export type HubInventoryItem = {
  channel: HubChannel;
  slug: string;
  name: string;
  path: string;
  formatLabel: string | null;
  formatKind: HubFormat;
  scoringUrl: string | null;
  newsSlugs: string[];
  template: HubTemplate;
  batch: "batch-1" | "batch-2" | "batch-3" | "batch-4" | "batch-5" | "batch-6" | "batch-7" | "batch-8" | "batch-9" | "batch-10" | "batch-11" | "batch-12" | "batch-13" | "ewing" | null;
  calendar: CalendarStanding;
};

const CHANNEL_PATH: Record<HubChannel, string> = {
  midam: "midamgolfhq",
  junior: "juniorgolfhq",
  senior: "seniorgolfhq",
};

/** First reviewable migration. Dedicated Ewing hubs are already live and are not in this list. */
export const HUB_BATCH_1: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "gasparilla-invitational" },
  { channel: "midam", slug: "walter-j-travis-invitational" },
  { channel: "midam", slug: "east-vs-west-matches" },
  { channel: "junior", slug: "junior-orange-bowl" },
  { channel: "senior", slug: "society-of-seniors-spring-classic" },
];

/** Straightforward N-hole stroke play still on the 2026 calendar. Cuts, match play, and the 2027 Lupton reschedule stay off this list. */
export const HUB_BATCH_2: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "snedeker-memorial" },
  { channel: "midam", slug: "giles-invitational" },
  { channel: "midam", slug: "the-jupiter-invitational" },
  { channel: "midam", slug: "the-huddleston-cup" },
  { channel: "midam", slug: "sanger-invitational" },
  { channel: "midam", slug: "national-invitational-tournament" },
  { channel: "junior", slug: "ajga-simplify-boys-championship" },
  { channel: "junior", slug: "fortinet-stanford-invitational" },
  { channel: "junior", slug: "junior-invitational-sage-valley" },
  { channel: "junior", slug: "ajga-team-taylormade-invitational" },
  { channel: "junior", slug: "nelly-invitational" },
  { channel: "junior", slug: "ajga-wyndham-invitational" },
  { channel: "senior", slug: "gasparilla-invitational-senior-division" },
  { channel: "senior", slug: "jones-cup-senior-invitational" },
  { channel: "senior", slug: "society-of-seniors-senior-masters" },
  { channel: "senior", slug: "sunnehanna-senior-amateur" },
  { channel: "senior", slug: "senior-porter-cup" },
  { channel: "senior", slug: "california-senior-amateur" },
];

/** Checked 2026 stroke boards. Senior rows stay on an existing senior hub. */
export const HUB_BATCH_3: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "george-c-thomas-invitational" },
  { channel: "senior", slug: "george-c-thomas-invitational-senior-division" },
  { channel: "midam", slug: "trans-miss-mid-master-championship" },
  { channel: "midam", slug: "canadian-mens-mid-amateur" },
  { channel: "midam", slug: "the-berkeley-cup" },
  { channel: "midam", slug: "carlton-woods-invitational" },
  { channel: "senior", slug: "carlton-woods-senior-invitational" },
];

/** Format-specific 2026 boards. Partial match sheets stay incomplete. */
export const HUB_BATCH_4: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "champions-cup-four-ball" },
  { channel: "midam", slug: "john-r-williams-four-ball" },
  { channel: "senior", slug: "john-r-williams-four-ball-senior-division" },
  { channel: "midam", slug: "the-valentine-invitational" },
  { channel: "senior", slug: "valentine-invitational" },
  { channel: "midam", slug: "cb-macdonald-invitational-tournament" },
  { channel: "senior", slug: "cb-macdonald-invitational-senior-division" },
  { channel: "midam", slug: "anderson-memorial-four-ball" },
  { channel: "senior", slug: "anderson-memorial-four-ball-senior-division" },
  { channel: "midam", slug: "the-farrell" },
];

/** Verified 2026 boards whose published format is not a plain stroke sheet. */
export const HUB_BATCH_5: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "european-mens-mid-amateur" },
  { channel: "midam", slug: "the-picard-cup" },
  { channel: "midam", slug: "tree-farm-invitational" },
];

/** 2026 hubs with published coverage and no official board. Lupton and Ewing stay off this list. */
export const HUB_BATCH_6: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "usga-womens-mid-am" },
  { channel: "midam", slug: "usga-mens-mid-am" },
  { channel: "midam", slug: "the-crump-cup" },
  { channel: "midam", slug: "the-stocker-cup" },
];

/** Senior divisions whose 2026 boards were checked on the public results page. */
export const HUB_BATCH_7: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "senior", slug: "huddleston-cup-senior-division" },
  { channel: "senior", slug: "giles-invitational-senior-division" },
  { channel: "senior", slug: "jupiter-invitational-senior-division" },
];

/** 2026 junior hubs with a checked boys board or published coverage and no full official board. */
export const HUB_BATCH_8: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "junior", slug: "elite-invitational" },
  { channel: "junior", slug: "dustin-johnson-world-junior" },
  { channel: "junior", slug: "us-girls-junior" },
  { channel: "junior", slug: "us-junior-amateur" },
  { channel: "junior", slug: "boys-junior-pga" },
  { channel: "junior", slug: "us-womens-amateur" },
];

/** 2026 junior boards taken from the events' own public results pages. */
export const HUB_BATCH_9: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "junior", slug: "western-junior" },
  { channel: "junior", slug: "womens-western-junior" },
];

/** 2026 junior hubs with a checked board or a published score. Upcoming events stay off this list. */
export const HUB_BATCH_10: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "junior", slug: "southern-junior-championship" },
  { channel: "junior", slug: "rolex-girls-junior" },
  { channel: "junior", slug: "junior-players-championship" },
  { channel: "junior", slug: "annika-invitational" },
  { channel: "junior", slug: "rlx-ralph-lauren-junior-classic" },
  { channel: "junior", slug: "wyndham-cup" },
  { channel: "junior", slug: "junior-solheim-cup" },
  { channel: "junior", slug: "junior-presidents-cup" },
];

/** Remaining 2026 junior hubs. Upcoming events stay without a 2026 champion or a field. */
export const HUB_BATCH_11: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "junior", slug: "north-south-junior" },
  { channel: "junior", slug: "us-amateur" },
  { channel: "junior", slug: "ajga-ping-invitational" },
  { channel: "junior", slug: "rolex-tournament-of-champions" },
  { channel: "junior", slug: "junior-jones-cup" },
];

/** Senior divisions whose 2026 public boards were checked. Lupton stays off this list. */
export const HUB_BATCH_12: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "senior", slug: "ojai-senior-cup" },
  { channel: "senior", slug: "trans-mississippi-senior-championship" },
  { channel: "senior", slug: "society-of-seniors-dale-morey" },
  { channel: "senior", slug: "golfweek-senior-desert-showdown" },
];

/** 2026 senior boards checked on the public results pages. Lupton stays off this list. */
export const HUB_BATCH_13: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "senior", slug: "reynolds-senior-invitational" },
  { channel: "senior", slug: "golfweek-senior-amateur-championship" },
  { channel: "senior", slug: "international-senior-individual-championship" },
  { channel: "senior", slug: "north-south-senior-mens-amateur" },
  { channel: "senior", slug: "society-of-seniors-ed-tutwiler-four-ball" },
  { channel: "senior", slug: "national-senior-hall-of-fame" },
];

const EWING_DEDICATED: Array<{ channel: HubChannel; slug: string }> = [
  { channel: "midam", slug: "ewing-cup-four-ball" },
  { channel: "senior", slug: "ewing-cup-four-ball" },
];

export function classifyFormat(format?: string | null): HubFormat {
  const text = (format ?? "").toLowerCase();
  if (!text.trim()) return "unspecified";
  if (text.includes("team match") || (text.includes("foursomes") && text.includes("singles"))) return "team-match";
  if (text.includes("better ball") || text.includes("four-ball") || text.includes("four ball") || text.includes("4-ball") || text.includes("4 ball")) {
    return text.includes("match") ? "four-ball-match" : "four-ball";
  }
  if (text.includes("match")) return "match";
  if (text.includes("stroke")) return "stroke";
  return "unspecified";
}

/** Stroke rounds implied by an N-hole stroke or better-ball format. Match play returns none. */
export function strokeRoundCount(format: string | null | undefined, kind: HubFormat): number {
  if (kind !== "stroke" && kind !== "four-ball") return 0;
  const match = (format ?? "").toLowerCase().match(/(\d+)\s*-?\s*holes?/);
  if (!match) return 0;
  const holes = Number(match[1]);
  if (!Number.isFinite(holes) || holes < 18 || holes > 108 || holes % 18 !== 0) return 0;
  return holes / 18;
}

const AS_OF = "2026-11-08";

/** Separates a 2026 date from a reschedule, a bare year, or a missing date. */
export function classifyCalendar(
  input: {
    dates2026?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    liveStatus?: string | null;
  },
  asOf = AS_OF,
): CalendarStanding {
  const label = (input.dates2026 ?? "").replace(/[–—]/g, "-").trim();
  if (/reschedul/i.test(label) && /2027/.test(label)) return "rescheduled-out";
  if (/\b2027\b/.test(label) && !/2026/.test(label)) return "rescheduled-out";
  if (/^reschedul/i.test(label) || (/\bTBD\b/i.test(label) && !/2026/.test(label))) return "unknown";
  const start = input.startDate ?? "";
  const end = input.endDate || start;
  if (start.startsWith("2026") || (end && end.startsWith("2026"))) {
    if (input.liveStatus === "live" || (start <= asOf && end >= asOf)) return "in-progress-2026";
    if (input.liveStatus === "completed" || end < asOf) return "played-in-2026";
    if (start > asOf) return "scheduled-2026";
  }
  if (/\b2026\b/.test(label)) return "year-only-2026";
  return "unknown";
}

export function championLabel(resultYear: number, editionYear: number, standing: CalendarStanding): string {
  if (standing === "played-in-2026" && resultYear === editionYear) return `${resultYear} champion`;
  if (standing === "in-progress-2026" && resultYear === editionYear) return `${resultYear} leader`;
  return "Defending champion";
}

export function resultsTabLabel(kind: HubFormat): "Scoring" | "Matches" {
  if (kind === "match" || kind === "team-match" || kind === "four-ball-match") return "Matches";
  return "Scoring";
}

function batchFor(channel: HubChannel, slug: string): HubInventoryItem["batch"] {
  if (EWING_DEDICATED.some((item) => item.channel === channel && item.slug === slug)) return "ewing";
  if (HUB_BATCH_1.some((item) => item.channel === channel && item.slug === slug)) return "batch-1";
  if (HUB_BATCH_2.some((item) => item.channel === channel && item.slug === slug)) return "batch-2";
  if (HUB_BATCH_3.some((item) => item.channel === channel && item.slug === slug)) return "batch-3";
  if (HUB_BATCH_4.some((item) => item.channel === channel && item.slug === slug)) return "batch-4";
  if (HUB_BATCH_5.some((item) => item.channel === channel && item.slug === slug)) return "batch-5";
  if (HUB_BATCH_6.some((item) => item.channel === channel && item.slug === slug)) return "batch-6";
  if (HUB_BATCH_7.some((item) => item.channel === channel && item.slug === slug)) return "batch-7";
  if (HUB_BATCH_8.some((item) => item.channel === channel && item.slug === slug)) return "batch-8";
  if (HUB_BATCH_9.some((item) => item.channel === channel && item.slug === slug)) return "batch-9";
  if (HUB_BATCH_10.some((item) => item.channel === channel && item.slug === slug)) return "batch-10";
  if (HUB_BATCH_11.some((item) => item.channel === channel && item.slug === slug)) return "batch-11";
  if (HUB_BATCH_12.some((item) => item.channel === channel && item.slug === slug)) return "batch-12";
  if (HUB_BATCH_13.some((item) => item.channel === channel && item.slug === slug)) return "batch-13";
  return null;
}

function templateFor(batch: HubInventoryItem["batch"]): HubTemplate {
  if (batch === "ewing") return "ewing-dedicated";
  if (batch === "batch-1" || batch === "batch-2" || batch === "batch-3" || batch === "batch-4" || batch === "batch-5" || batch === "batch-6" || batch === "batch-7" || batch === "batch-8" || batch === "batch-9" || batch === "batch-10" || batch === "batch-11" || batch === "batch-12" || batch === "batch-13") return "format-hub";
  return "legacy";
}

type SourceEvent = {
  slug: string;
  name: string;
  format?: string;
  golfGeniusUrl?: string;
  news?: { slug: string }[];
};

function row(channel: HubChannel, event: SourceEvent & { dates2026?: string; startDate?: string; endDate?: string; liveStatus?: string; month?: string | number }): HubInventoryItem {
  const batch = batchFor(channel, event.slug);
  return {
    channel,
    slug: event.slug,
    name: event.name,
    path: `/${CHANNEL_PATH[channel]}/${event.slug}`,
    formatLabel: event.format ?? null,
    formatKind: classifyFormat(event.format),
    scoringUrl: event.golfGeniusUrl ?? null,
    newsSlugs: (event.news ?? []).map((article) => article.slug),
    template: templateFor(batch),
    batch,
    calendar: classifyCalendar(event),
  };
}

export function listHubInventory(): HubInventoryItem[] {
  return [
    ...MIDAM_TOURNAMENTS.map((event) => row("midam", event)),
    ...JUNIOR_MAJOR_EVENTS_2026.map((event) => row("junior", event)),
    ...SENIOR_MAJOR_EVENTS_2026.map((event) => row("senior", event)),
  ];
}

export function isFormatHub(channel: HubChannel, slug: string): boolean {
  return listHubInventory().some((item) => item.channel === channel && item.slug === slug && item.template === "format-hub");
}

export function inventorySummary(items: HubInventoryItem[] = listHubInventory()) {
  const byChannel = {
    midam: items.filter((item) => item.channel === "midam").length,
    junior: items.filter((item) => item.channel === "junior").length,
    senior: items.filter((item) => item.channel === "senior").length,
  };
  const byKind: Record<HubFormat, number> = {
    stroke: 0,
    "four-ball": 0,
    "four-ball-match": 0,
    match: 0,
    "team-match": 0,
    unspecified: 0,
  };
  for (const item of items) byKind[item.formatKind] += 1;
  return {
    total: items.length,
    byChannel,
    byKind,
    formatHub: items.filter((item) => item.template === "format-hub").length,
    ewingDedicated: items.filter((item) => item.template === "ewing-dedicated").length,
    legacy: items.filter((item) => item.template === "legacy").length,
    withScoringUrl: items.filter((item) => item.scoringUrl).length,
    withNews: items.filter((item) => item.newsSlugs.length > 0).length,
    calendar: {
      played: items.filter((item) => item.calendar === "played-in-2026").length,
      scheduled: items.filter((item) => item.calendar === "scheduled-2026").length,
      inProgress: items.filter((item) => item.calendar === "in-progress-2026").length,
      yearOnly: items.filter((item) => item.calendar === "year-only-2026").length,
      rescheduledOut: items.filter((item) => item.calendar === "rescheduled-out").length,
      unknown: items.filter((item) => item.calendar === "unknown").length,
    },
  };
}
