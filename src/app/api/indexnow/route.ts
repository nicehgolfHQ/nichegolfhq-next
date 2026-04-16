import { NextRequest, NextResponse } from "next/server";
import { submitUrls } from "@/lib/indexnow";

export async function POST(request: NextRequest) {
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

  await submitUrls(urls as string[]);

  return NextResponse.json({ ok: true, submitted: urls.length });
}
