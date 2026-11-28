import { NEXT_EDITIONS } from "@/data/nextEditions";
import { formatDateRange } from "@/lib/tournaments/dates";

export type NextEditionChannel = "midam" | "junior" | "senior";

/**
 * "Next: Feb 18–20, 2027 · Palma Ceia Golf & Country Club" for events with
 * announced 2027 dates, or null. Skipped when the hub already shows 2027.
 */
export function nextEditionLine(
  channel: NextEditionChannel,
  slug: string,
  displayedStartDate?: string,
): string | null {
  const next = NEXT_EDITIONS[`${channel}/${slug}`];
  if (!next) return null;
  if (displayedStartDate && displayedStartDate >= next.startDate) return null;
  const dates = formatDateRange(next.startDate, next.endDate);
  if (!dates) return null;
  const label = next.pending2026 ? "2027 edition" : "Next";
  return `${label}: ${[dates, next.course].filter(Boolean).join(" \u00b7 ")}`;
}
