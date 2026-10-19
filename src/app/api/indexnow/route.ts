import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { submitUrls, urlsForThisHost } from "@/lib/indexnow";

function authorized(request: NextRequest): boolean {
  const secret = process.env.INDEXNOW_SECRET;
  if (!secret) return false;
  const provided = request.headers.get("x-indexnow-secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !Array.isArray((body as { urls?: unknown }).urls)
  ) {
    return NextResponse.json(
      { error: "Request body must include a urls array" },
      { status: 400 }
    );
  }

  const { urls } = body as { urls: unknown[] };

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "urls array must not be empty" },
      { status: 400 }
    );
  }

  if (urls.length > 1000) {
    return NextResponse.json(
      { error: "urls array must not exceed 1000 entries" },
      { status: 400 }
    );
  }

  if (!urls.every((u) => typeof u === "string")) {
    return NextResponse.json(
      { error: "All urls entries must be strings" },
      { status: 400 }
    );
  }

  const accepted = urlsForThisHost(urls as string[]);
  if (accepted.length === 0) {
    return NextResponse.json(
      { error: "No URLs were on https://www.nichegolfhq.com" },
      { status: 400 }
    );
  }

  await submitUrls(accepted);

  return NextResponse.json({ ok: true, submitted: accepted.length });
}
