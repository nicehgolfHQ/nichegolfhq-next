import { NextResponse } from "next/server";
import { listBriefDates, loadBrief } from "@/lib/briefs";

export const dynamic = "force-static";

export function GET() {
  const dates = listBriefDates();
  const sample = dates[0] ? loadBrief(dates[0]) : null;
  return NextResponse.json({
    datesCount: dates.length,
    dates,
    sample,
  });
}
