import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026, type JuniorMajorEvent } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026, type SeniorMajorEvent } from "@/lib/seniorMajors";
import type { Tournament } from "@/lib/tournaments/types";
import { resolveDatesLabel } from "@/lib/tournaments/dates";

export type TickerChannel = "junior" | "midam" | "senior";

export interface TickerCard {
  channel: TickerChannel;
  channelLabel: string;
  status: "live" | "next";
  name: string;
  venueLine?: string;
  datesLabel?: string;
  hubHref: string;
  golfGeniusUrl?: string;
}

/* ── Date-string parsing ─────────────────────────────────────────────
   Handles the shapes used in MIDAM/JUNIOR/SENIOR data files:
   - "Aug 18–21, 2026"           (specific range)
   - "August 2026"               (whole month)
   - "March/April 2026"          (multi-month span)
   - "Rescheduled – TBD"         (skipped → null)
   ────────────────────────────────────────────────────────────────── */

const MONTH_NAMES: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function lastDayOfMonth(year: number, monthIdx: number): number {
  return new Date(year, monthIdx + 1, 0).getDate();
}

export function parseDateRange(input?: string): { start: Date; end: Date } | null {
  if (!input) return null;
  const cleaned = input.replace(/[–—]/g, "-").trim();
  if (/^Rescheduled/i.test(cleaned) || /TBD/i.test(cleaned)) return null;

  // "Aug 18-21, 2026"
  const range = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2})\s*-\s*(\d{1,2})\s*,?\s*(\d{4})$/);
  if (range) {
    const m = MONTH_NAMES[range[1].toLowerCase()];
    if (m === undefined) return null;
    const y = parseInt(range[4], 10);
    return {
      start: new Date(y, m, parseInt(range[2], 10)),
      end: new Date(y, m, parseInt(range[3], 10), 23, 59, 59),
    };
  }

  // "Aug 18, 2026" (single day)
  const single = cleaned.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (single) {
    const m = MONTH_NAMES[single[1].toLowerCase()];
    if (m === undefined) return null;
    const y = parseInt(single[3], 10);
    const d = parseInt(single[2], 10);
    return { start: new Date(y, m, d), end: new Date(y, m, d, 23, 59, 59) };
  }

  // "Month/Month YYYY"
  const dual = cleaned.match(/^([A-Za-z]+)\s*\/\s*([A-Za-z]+)\s+(\d{4})$/);
  if (dual) {
    const m1 = MONTH_NAMES[dual[1].toLowerCase()];
    const m2 = MONTH_NAMES[dual[2].toLowerCase()];
    if (m1 === undefined || m2 === undefined) return null;
    const y = parseInt(dual[3], 10);
    return {
      start: new Date(y, m1, 1),
      end: new Date(y, m2, lastDayOfMonth(y, m2), 23, 59, 59),
    };
  }

  // "Month YYYY"
  const monthOnly = cleaned.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthOnly) {
    const m = MONTH_NAMES[monthOnly[1].toLowerCase()];
    if (m === undefined) return null;
    const y = parseInt(monthOnly[2], 10);
    return {
      start: new Date(y, m, 1),
      end: new Date(y, m, lastDayOfMonth(y, m), 23, 59, 59),
    };
  }

  return null;
}

/* ── Status resolver ────────────────────────────────────────────────
   Manual `liveStatus` always wins:
     "live"      → NOW PLAYING
     "next"      → UP NEXT
     "completed" → excluded from date-based fallback
   Otherwise:
     today within [start,end] → NOW PLAYING
     earliest start > today    → UP NEXT
   ────────────────────────────────────────────────────────────────── */

interface ResolverEvent<E> {
  event: E;
  liveStatus?: "live" | "next" | "completed" | "upcoming";
  dateString?: string;
  startDate?: string;
  endDate?: string;
}

// Parse "YYYY-MM-DD" to local Date at start-of-day. End date gets +1 day
// minus 1 second so a same-day single round event is inclusive.
function isoToRange(
  startIso?: string,
  endIso?: string
): { start: Date; end: Date } | null {
  if (!startIso) return null;
  const sm = startIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!sm) return null;
  const start = new Date(Number(sm[1]), Number(sm[2]) - 1, Number(sm[3]));
  const endStr = endIso ?? startIso;
  const em = endStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!em) return null;
  const end = new Date(Number(em[1]), Number(em[2]) - 1, Number(em[3]), 23, 59, 59);
  return { start, end };
}

function resolveActiveEvent<E>(
  events: ResolverEvent<E>[],
  today: Date
): { event: E; status: "live" | "next" } | null {
  const explicitLive = events.find((e) => e.liveStatus === "live");
  if (explicitLive) return { event: explicitLive.event, status: "live" };

  const explicitNext = events.find((e) => e.liveStatus === "next");
  if (explicitNext) return { event: explicitNext.event, status: "next" };

  const withDates = events
    .filter((e) => e.liveStatus !== "completed")
    .map((e) => ({
      ...e,
      range: isoToRange(e.startDate, e.endDate) ?? parseDateRange(e.dateString),
    }))
    .filter((e): e is ResolverEvent<E> & { range: { start: Date; end: Date } } => e.range !== null);

  const inProgress = withDates.find(
    ({ range }) => today >= range.start && today <= range.end
  );
  if (inProgress) return { event: inProgress.event, status: "live" };

  const upcoming = withDates
    .filter(({ range }) => range.start > today)
    .sort((a, b) => a.range.start.getTime() - b.range.start.getTime());
  if (upcoming.length) return { event: upcoming[0].event, status: "next" };

  return null;
}

/* ── Channel-specific card builders ─────────────────────────────── */

function venueLineFor(course?: string, location?: string): string | undefined {
  const parts = [course, location].filter(Boolean);
  return parts.length ? parts.join(" • ") : undefined;
}

function midamCard(today: Date): TickerCard | null {
  const events: ResolverEvent<Tournament>[] = MIDAM_TOURNAMENTS.map((t) => ({
    event: t,
    liveStatus: t.liveStatus,
    dateString: t.dates2026,
    startDate: t.startDate,
    endDate: t.endDate,
  }));
  const resolved = resolveActiveEvent(events, today);
  if (!resolved) return null;
  const t = resolved.event;
  return {
    channel: "midam",
    channelLabel: "MID-AM",
    status: resolved.status,
    name: t.name,
    venueLine: venueLineFor(t.course, t.location),
    datesLabel: resolveDatesLabel(t.startDate, t.endDate, t.dates2026),
    hubHref: `/midamgolfhq/${t.slug}`,
    golfGeniusUrl: t.golfGeniusUrl,
  };
}

function juniorCard(today: Date): TickerCard | null {
  const todayIso = today.toISOString().slice(0, 10);
  const events: ResolverEvent<JuniorMajorEvent>[] = JUNIOR_MAJOR_EVENTS_2026.map((e) => ({
    event: e,
    // Drop the manual override once endsOn passes so the next event takes over automatically.
    liveStatus: e.endsOn && e.endsOn < todayIso ? undefined : e.liveStatus,
    dateString: e.dates2026 ?? e.month,
    startDate: e.startDate,
    endDate: e.endDate,
  }));
  const resolved = resolveActiveEvent(events, today);
  if (!resolved) return null;
  const e = resolved.event;
  return {
    channel: "junior",
    channelLabel: "JUNIORS",
    status: resolved.status,
    name: e.name,
    venueLine: venueLineFor(e.course, e.location),
    datesLabel: resolveDatesLabel(e.startDate, e.endDate, e.dates2026 ?? e.month),
    hubHref: `/juniorgolfhq/${e.slug}`,
  };
}

function seniorCard(today: Date): TickerCard | null {
  const events: ResolverEvent<SeniorMajorEvent>[] = SENIOR_MAJOR_EVENTS_2026.map((e) => ({
    event: e,
    liveStatus: e.liveStatus,
    dateString: e.dates2026 ?? e.month,
    startDate: e.startDate,
    endDate: e.endDate,
  }));
  const resolved = resolveActiveEvent(events, today);
  if (!resolved) return null;
  const e = resolved.event;
  return {
    channel: "senior",
    channelLabel: "SENIOR",
    status: resolved.status,
    name: e.name,
    venueLine: venueLineFor(e.course, e.location),
    datesLabel: resolveDatesLabel(e.startDate, e.endDate, e.dates2026 ?? e.month),
    hubHref: `/seniorgolfhq/${e.slug}`,
  };
}

export function getTickerCards(today: Date = new Date()): TickerCard[] {
  return [juniorCard(today), midamCard(today), seniorCard(today)].filter(
    (c): c is TickerCard => c !== null
  );
}
