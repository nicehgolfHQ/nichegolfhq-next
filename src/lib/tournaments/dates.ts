// Shared date formatting helpers for tournament UI.
// Source-of-truth fields are `startDate` / `endDate` (ISO "YYYY-MM-DD").

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

// Format an ISO date range as a human-readable string:
//   "May 28–30, 2026"      (same month)
//   "Aug 31 – Sep 2, 2026" (cross-month)
//   "May 28, 2026"         (single day or endDate omitted)
export function formatDateRange(
  startDate?: string,
  endDate?: string
): string | undefined {
  if (!startDate) return undefined;
  const start = parseIso(startDate);
  if (!start) return undefined;

  if (!endDate || endDate === startDate) {
    return `${MONTH_SHORT[start.m - 1]} ${start.d}, ${start.y}`;
  }
  const end = parseIso(endDate);
  if (!end) return `${MONTH_SHORT[start.m - 1]} ${start.d}, ${start.y}`;

  if (start.y === end.y && start.m === end.m) {
    return `${MONTH_SHORT[start.m - 1]} ${start.d}–${end.d}, ${start.y}`;
  }
  if (start.y === end.y) {
    return `${MONTH_SHORT[start.m - 1]} ${start.d} – ${MONTH_SHORT[end.m - 1]} ${end.d}, ${start.y}`;
  }
  return `${MONTH_SHORT[start.m - 1]} ${start.d}, ${start.y} – ${MONTH_SHORT[end.m - 1]} ${end.d}, ${end.y}`;
}

// Resolve a display string for an event: prefer the formatted ISO range,
// falling back to the legacy human-readable string (e.g., "June 2026").
export function resolveDatesLabel(
  startDate?: string,
  endDate?: string,
  fallback?: string
): string | undefined {
  return formatDateRange(startDate, endDate) ?? fallback;
}
