import { getSupabase } from "@/lib/supabaseClient";
import type { AccountPrivacy } from "@/lib/privacy/effectiveConsent";

export type SignedInPrivacy = {
  signedIn: boolean;
  accessToken: string | null;
  account: AccountPrivacy | null;
  emailOptOut: boolean;
};

export async function loadSignedInPrivacy(): Promise<SignedInPrivacy> {
  const empty: SignedInPrivacy = { signedIn: false, accessToken: null, account: null, emailOptOut: false };
  const supabase = getSupabase();
  if (!supabase) return empty;

  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const userId = session?.user?.id;
  const accessToken = session?.access_token ?? null;
  if (!userId || !accessToken) return empty;

  let account: AccountPrivacy | null = null;
  const prefs = await supabase
    .from("privacy_preferences")
    .select("analytics_consent,sale_share_opt_out,gpc_seen")
    .eq("user_id", userId)
    .maybeSingle();
  if (!prefs.error && prefs.data) {
    account = {
      analyticsConsent: prefs.data.analytics_consent === true,
      saleShareOptOut: prefs.data.sale_share_opt_out === true,
      gpcSeen: prefs.data.gpc_seen === true,
    };
  }

  let emailOptOut = false;
  try {
    const res = await fetch("/api/privacy-preferences", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const body = (await res.json()) as { emailOptOut?: boolean };
      emailOptOut = body.emailOptOut === true;
    }
  } catch {
    emailOptOut = false;
  }

  return { signedIn: true, accessToken, account, emailOptOut };
}

export async function saveAccountPrivacy(prefs: {
  analyticsConsent: boolean;
  saleShareOptOut: boolean;
  gpcSeen: boolean;
}): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;
  if (!userId) return;

  const { error } = await supabase.from("privacy_preferences").upsert({
    user_id: userId,
    analytics_consent: prefs.analyticsConsent,
    sale_share_opt_out: prefs.saleShareOptOut,
    gpc_seen: prefs.gpcSeen,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("privacy preferences save failed");
}
