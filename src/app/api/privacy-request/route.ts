import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { OPT_OUT_SCOPE, parsePrivacyRequest, rateLimitPrivacyRequest } from "@/lib/privacy/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  access: "Access",
  delete: "Delete",
  correct: "Correct",
  "opt-out": "Opt out",
};

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") || "0");
  if (length > 20000) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Missing request." }, { status: 400 });
  }

  const parsed = parsePrivacyRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (!rateLimitPrivacyRequest(clientKey(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }
  if (parsed.value.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM;
  const toEmail = process.env.PRIVACY_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  if (!resendKey || !fromEmail || !toEmail) {
    return NextResponse.json({ ok: false, error: "Privacy email is not configured." }, { status: 500 });
  }

  const headerGpc = req.headers.get("sec-gpc") === "1";
  const gpc = headerGpc || parsed.value.gpc;
  const userAgent = (req.headers.get("user-agent") || "").slice(0, 400);
  const { type, email, name, state, details } = parsed.value;

  try {
    const supabase = getSupabaseServer();
    if (!supabase) {
      console.error("privacy request: Supabase is not configured; emailing only");
    } else {
      const { error } = await supabase.from("privacy_requests").insert({
        type,
        email,
        name,
        state,
        details,
        user_agent: userAgent || null,
        gpc,
      });
      if (error) {
        console.error("privacy request: privacy_requests insert failed", error.message);
      }
      if (type === "opt-out") {
        const optOut = await supabase.from("privacy_opt_outs").insert({
          email,
          scope: OPT_OUT_SCOPE,
        });
        if (optOut.error) {
          console.error("privacy request: privacy_opt_outs insert failed", optOut.error.message);
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown database error";
    console.error("privacy request: database write failed", message);
  }

  const resend = new Resend(resendKey);
  const label = TYPE_LABEL[type] ?? type;
  const staff = await resend.emails.send({
    from: `nichegolfHQ <${fromEmail}>`,
    to: [toEmail],
    replyTo: email,
    subject: `Privacy request: ${label}`,
    text: [
      `Type: ${label}`,
      `Name: ${name || "(not provided)"}`,
      `Email: ${email}`,
      `State: ${state}`,
      `GPC: ${gpc ? "yes" : "no"}`,
      `User-Agent: ${userAgent || "(none)"}`,
      "",
      details || "(no details)",
    ].join("\n"),
  });

  if (staff.error) {
    return NextResponse.json({ ok: false, error: "Could not send the request." }, { status: 502 });
  }

  const confirmation = await resend.emails.send({
    from: `nichegolfHQ <${fromEmail}>`,
    to: [email],
    subject: "We received your privacy request",
    text: [
      "We received your nichegolfHQ privacy request.",
      "",
      `Request type: ${label}`,
      "We will respond within 45 days.",
      "",
      type === "opt-out"
        ? "Your opt-out covers sale or sharing of personal information and the newsletter. It is tied to this email address, so it can apply across devices once we process it. Browser cookie choices stay on each device until then."
        : "If you also want to opt out across devices and from the newsletter, submit the form again and choose Opt out.",
      "",
      "Submit another request at https://www.nichegolfhq.com/privacy-choices",
    ].join("\n"),
  });

  if (confirmation.error) {
    console.error("privacy request: confirmation email failed", confirmation.error.message);
  }

  return NextResponse.json({ ok: true });
}
