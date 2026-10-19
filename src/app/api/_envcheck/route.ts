import { NextRequest, NextResponse } from "next/server";
import { rejectPublicDebug } from "@/lib/debugAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const denied = rejectPublicDebug(request);
  if (denied) return denied;

  return NextResponse.json({
    ok: true,
    vercelEnv: process.env.VERCEL_ENV || null,
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
    hasContactToEmail: Boolean(process.env.CONTACT_TO_EMAIL),
    hasResendFrom: Boolean(process.env.RESEND_FROM),
  });
}
