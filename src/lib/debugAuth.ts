import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Debug routes stay in the repo for local checks, but they 404 in public
 * unless DEBUG_API_TOKEN is set and sent as `x-debug-token`.
 */
export function rejectPublicDebug(request: NextRequest): NextResponse | null {
  const secret = process.env.DEBUG_API_TOKEN;
  if (!secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const provided = request.headers.get("x-debug-token") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return null;
}
