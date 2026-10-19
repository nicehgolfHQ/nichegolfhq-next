import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(req: Request): string {
  const header = req.headers.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
}

export async function GET(req: Request) {
  const token = bearer(req);
  if (!token) return NextResponse.json({ emailOptOut: false });

  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ emailOptOut: false });

  const { data, error } = await supabase.auth.getUser(token);
  const email = data.user?.email?.trim().toLowerCase() ?? "";
  if (error || !email) return NextResponse.json({ emailOptOut: false });

  const optOut = await supabase
    .from("privacy_opt_outs")
    .select("scope")
    .eq("email", email)
    .in("scope", ["all", "sale-share"])
    .limit(1);

  if (optOut.error) {
    console.error("privacy preferences: opt-out lookup failed", optOut.error.message);
    return NextResponse.json({ emailOptOut: false });
  }

  return NextResponse.json({ emailOptOut: (optOut.data?.length ?? 0) > 0 });
}
