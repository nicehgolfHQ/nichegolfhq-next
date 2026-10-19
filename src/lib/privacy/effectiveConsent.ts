export type AccountPrivacy = {
  analyticsConsent: boolean;
  saleShareOptOut: boolean;
  gpcSeen: boolean;
};

export type ConsentSignals = {
  gpc: boolean;
  emailOptOut: boolean;
  /** null means this browser has no explicit analytics choice yet. */
  localAnalytics: boolean | null;
  localSaleOptOut: boolean;
  account: AccountPrivacy | null;
};

export type EffectiveConsent = {
  analytics: boolean;
  saleShareOptOut: boolean;
};

/**
 * The stricter signal wins. An account "allow" does not override GPC, an
 * email opt-out, or an explicit opt-out already stored in this browser.
 * An account choice does override the regional default when the browser
 * has not chosen yet.
 */
export function effectiveConsent(
  signals: ConsentSignals,
  regionalDefaultAnalytics: boolean
): EffectiveConsent {
  const accountDeniesAnalytics = signals.account?.analyticsConsent === false;
  const accountAllowsAnalytics = signals.account?.analyticsConsent === true;

  const saleShareOptOut =
    signals.gpc ||
    signals.emailOptOut ||
    signals.localSaleOptOut ||
    signals.account?.saleShareOptOut === true;

  let analytics: boolean;
  if (signals.gpc || signals.emailOptOut || signals.localAnalytics === false || accountDeniesAnalytics) {
    analytics = false;
  } else if (accountAllowsAnalytics || signals.localAnalytics === true) {
    analytics = true;
  } else {
    analytics = regionalDefaultAnalytics;
  }

  return { analytics, saleShareOptOut };
}

/** Write the account row only when a real restriction should travel to other devices. */
export function shouldPersistLoadedRestriction(signals: ConsentSignals): boolean {
  const explicit =
    signals.gpc || signals.emailOptOut || signals.localAnalytics === false || signals.localSaleOptOut;
  if (!explicit) return false;
  const account = signals.account;
  if (!account) return true;
  const deniesAnalytics = signals.gpc || signals.emailOptOut || signals.localAnalytics === false;
  const deniesSale = signals.gpc || signals.emailOptOut || signals.localSaleOptOut;
  if (deniesAnalytics && account.analyticsConsent) return true;
  if (deniesSale && !account.saleShareOptOut) return true;
  if (signals.gpc && !account.gpcSeen) return true;
  return false;
}
