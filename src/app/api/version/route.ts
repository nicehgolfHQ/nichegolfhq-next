import { NextRequest, NextResponse } from "next/server";
import { rejectPublicDebug } from "@/lib/debugAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = rejectPublicDebug(request);
  if (denied) return denied;

  return NextResponse.json({
    now: new Date().toISOString(),
    vercel: {
      env: process.env.VERCEL_ENV || null,
      url: process.env.VERCEL_URL || null,
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      gitCommitRef: process.env.VERCEL_GIT_COMMIT_REF || null,
      gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
    },
  });
}
