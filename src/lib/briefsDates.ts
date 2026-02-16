// Date helpers for Daily Briefs (UTC / ISO-week based)

export function parseYmd(date: unknown): { y: number; m: number; d: number } | null {
  if (typeof date !== "string") return null;
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

export function ymdToDateUtc(date: unknown): Date | null {
  const p = parseYmd(date);
  if (!p) return null;
  return new Date(Date.UTC(p.y, p.m - 1, p.d));
}

export function formatLongDate(date: unknown): string {
  if (typeof date !== "string") return "";
  const dt = ymdToDateUtc(date);
  if (!dt) return date;
  const y = dt.getUTCFullYear();
  const d = dt.getUTCDate();
  const month = dt.toLocaleString("en-US", { month: "long", timeZone: "UTC" });

  const mod10 = d % 10;
  const mod100 = d % 100;
  const suffix = mod10 === 1 && mod100 !== 11 ? "st" : mod10 === 2 && mod100 !== 12 ? "nd" : mod10 === 3 && mod100 !== 13 ? "rd" : "th";

  return `${month} ${d}${suffix}, ${y}`;
}

// ISO week utilities
// Returns week key like: 2026-W07
export function isoWeekKeyFromYmd(date: unknown): string {
  if (typeof date !== "string") return "";
  const dt = ymdToDateUtc(date);
  if (!dt) return date;

  // Copy date and shift to Thursday in current week per ISO.
  const tmp = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  const day = tmp.getUTCDay() || 7; // Mon=1..Sun=7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);

  const isoYear = tmp.getUTCFullYear();

  // Week 1 is the week with Jan 4th.
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const yearStartDay = yearStart.getUTCDay() || 7;
  const firstThursday = new Date(Date.UTC(isoYear, 0, 1 + (4 - yearStartDay)));

  const diffMs = tmp.getTime() - firstThursday.getTime();
  const week = 1 + Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

export function isoWeekStartEndFromKey(weekKey: unknown): { start: string; end: string } | null {
  if (typeof weekKey !== "string") return null;
  const m = weekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const w = Number(m[2]);
  if (!y || !w) return null;

  // ISO week: Monday start.
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7; // Mon=1..Sun=7
  const week1Monday = new Date(Date.UTC(y, 0, 4 - (jan4Day - 1)));

  const startDt = new Date(week1Monday);
  startDt.setUTCDate(startDt.getUTCDate() + (w - 1) * 7);
  const endDt = new Date(startDt);
  endDt.setUTCDate(endDt.getUTCDate() + 6);

  const toYmd = (d: Date) => {
    const yy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  };

  return { start: toYmd(startDt), end: toYmd(endDt) };
}
