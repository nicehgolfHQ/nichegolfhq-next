import { NextResponse } from "next/server";
import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "@/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "@/lib/seniorMajors";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";

export const dynamic = "force-dynamic";

function serializeMidam() {
  return MIDAM_TOURNAMENTS.map((t) => ({
    brand: "midam",
    slug: t.slug,
    name: t.name,
    month: t.month,
    dates2026: t.dates2026 ?? null,
    typicalDates: t.typicalDates ?? null,
    course: t.course ?? null,
    location: t.location ?? null,
    coursePar: t.coursePar ?? null,
    courseYardage: t.courseYardage ?? null,
    courseRating: t.courseRating ?? null,
    courseSlope: t.courseSlope ?? null,
    courseDesigner: t.courseDesigner ?? null,
    format: t.format ?? null,
    fieldSize: t.fieldSize ?? null,
    eligibility: t.eligibility ?? null,
    overview: t.overview ?? null,
    prestige: t.prestige ?? null,
    founded: t.founded ?? null,
    url: `https://www.nichegolfhq.com/midamgolfhq/${t.slug}`,
  }));
}

function serializeJuniors() {
  return JUNIOR_MAJOR_EVENTS_2026.map((e) => ({
    brand: "juniors",
    slug: e.slug,
    name: e.name,
    month: e.month,
    course: e.course ?? null,
    location: e.location ?? null,
    coursePar: e.coursePar ?? null,
    courseYardage: e.courseYardage ?? null,
    courseDesigner: e.courseDesigner ?? null,
    format: e.format ?? null,
    fieldSize: e.fieldSize ?? null,
    eligibility: e.eligibility ?? null,
    overview: e.overview ?? null,
    url: `https://www.nichegolfhq.com/juniorgolfhq/${e.slug}`,
  }));
}

function serializeSeniors() {
  return SENIOR_MAJOR_EVENTS_2026.map((e) => ({
    brand: "seniors",
    slug: e.slug,
    name: e.name,
    month: e.month,
    course: e.course ?? null,
    location: e.location ?? null,
    coursePar: e.coursePar ?? null,
    courseYardage: e.courseYardage ?? null,
    courseDesigner: e.courseDesigner ?? null,
    format: e.format ?? null,
    fieldSize: e.fieldSize ?? null,
    eligibility: e.eligibility ?? null,
    overview: e.overview ?? null,
    url: `https://www.nichegolfhq.com/seniorgolfhq/${e.slug}`,
  }));
}

export function GET(request: Request) {
  const ip = getClientIp(request);
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests", message: "Rate limit exceeded. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand")?.toLowerCase() ?? null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tournaments: any[];

  if (brand === "midam") {
    tournaments = serializeMidam();
  } else if (brand === "juniors") {
    tournaments = serializeJuniors();
  } else if (brand === "seniors") {
    tournaments = serializeSeniors();
  } else {
    tournaments = [...serializeMidam(), ...serializeJuniors(), ...serializeSeniors()];
  }

  return NextResponse.json(
    {
      version: "1.0",
      description: "nichegolfHQ tournament data. Brands: midam, juniors, seniors. Filter with ?brand=midam|juniors|seniors.",
      count: tournaments.length,
      tournaments,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
