import { NextRequest, NextResponse } from "next/server";
import { listBriefDates, loadBrief } from "@/lib/briefs";
import { rejectPublicDebug } from "@/lib/debugAuth";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const denied = rejectPublicDebug(request);
  if (denied) return denied;

  const dates = listBriefDates();
  const sample = dates[0] ? loadBrief(dates[0]) : null;
  return NextResponse.json({
    datesCount: dates.length,
    dates,
    sample,
  });
}
