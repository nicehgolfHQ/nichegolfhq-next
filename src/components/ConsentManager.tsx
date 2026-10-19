"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { loadSignedInPrivacy, saveAccountPrivacy } from "@/lib/privacy/accountConsent";
import {
  CONSENT_COOKIE,
  readDoNotSell,
  readStoredAnalyticsChoice,
  writeDoNotSell,
} from "@/lib/privacy/consentScript";
import { effectiveConsent, shouldPersistLoadedRestriction, type ConsentSignals } from "@/lib/privacy/effectiveConsent";
import { isOptInCountry } from "@/lib/privacy/regions";
import { getSupabase } from "@/lib/supabaseClient";

type ConsentState = "granted" | "denied";

function gpcOn(serverGpc: boolean): boolean {
  return serverGpc || (typeof navigator !== "undefined" && navigator.globalPrivacyControl === true);
}

function updateGtag(analytics: ConsentState) {
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ??
    function gtag() {
      // gtag.js reads the Arguments object, matching the official snippet.
      window.dataLayer?.push(arguments);
    };
  window.gtag = gtag as Window["gtag"];
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analytics,
  });
}

let booted = false;
let hydrating = false;
let forcingOff = false;
let sessionGpc = false;
let sessionEmailOptOut = false;
let sessionSignedIn = false;

function signalsFromBrowser(account: ConsentSignals["account"], emailOptOut: boolean): ConsentSignals {
  return {
    gpc: sessionGpc,
    emailOptOut,
    localAnalytics: readStoredAnalyticsChoice(),
    localSaleOptOut: readDoNotSell(),
    account,
  };
}

async function persistChoice(analytics: boolean, saleShareOptOut: boolean) {
  if (!sessionSignedIn) return;
  await saveAccountPrivacy({
    analyticsConsent: analytics && !sessionGpc && !sessionEmailOptOut,
    saleShareOptOut: saleShareOptOut || sessionGpc || sessionEmailOptOut,
    gpcSeen: sessionGpc,
  });
}

function applyAnalytics(allow: boolean) {
  const accepted = CookieConsent.acceptedCategory("analytics");
  if (accepted === allow) {
    updateGtag(allow ? "granted" : "denied");
    return;
  }
  forcingOff = true;
  if (allow) CookieConsent.acceptCategory("analytics");
  else CookieConsent.acceptCategory([], ["analytics"]);
  forcingOff = false;
  updateGtag(allow ? "granted" : "denied");
}

export function openCookieSettings() {
  try {
    CookieConsent.showPreferences();
  } catch {
    // The banner script has not finished booting yet.
  }
}

export function ConsentManager({
  country,
  serverGpc,
}: {
  country: string;
  serverGpc: boolean;
}) {
  useEffect(() => {
    if (booted) return;
    booted = true;
    const optIn = isOptInCountry(country);
    const regionalDefault = !optIn;

    const applySignals = async (signals: ConsentSignals, reason: "load" | "change") => {
      sessionEmailOptOut = signals.emailOptOut;
      const decision = effectiveConsent(signals, regionalDefault);
      if (decision.saleShareOptOut) writeDoNotSell(true);
      hydrating = true;
      applyAnalytics(decision.analytics);
      hydrating = false;
      if (reason === "change" && sessionSignedIn) {
        await persistChoice(decision.analytics, decision.saleShareOptOut);
      } else if (reason === "load" && sessionSignedIn && shouldPersistLoadedRestriction(signals)) {
        await persistChoice(decision.analytics, decision.saleShareOptOut);
      }
    };

    const onUserChange = () => {
      if (hydrating || forcingOff) return;
      const accepted = CookieConsent.acceptedCategory("analytics");
      if ((sessionGpc || sessionEmailOptOut) && accepted) {
        forcingOff = true;
        CookieConsent.acceptCategory([], ["analytics"]);
        forcingOff = false;
        updateGtag("denied");
        if (sessionSignedIn) void persistChoice(false, true);
        return;
      }
      updateGtag(accepted && !sessionGpc && !sessionEmailOptOut ? "granted" : "denied");
      if (!sessionSignedIn) return;
      void persistChoice(accepted, readDoNotSell() || sessionGpc || sessionEmailOptOut);
    };

    void (async () => {
      sessionGpc = gpcOn(serverGpc);
      const signedIn = await loadSignedInPrivacy();
      sessionSignedIn = signedIn.signedIn;
      sessionEmailOptOut = signedIn.emailOptOut;
      const signals = signalsFromBrowser(signedIn.account, signedIn.emailOptOut);
      const decision = effectiveConsent(signals, regionalDefault);
      if (decision.saleShareOptOut) writeDoNotSell(true);
      hydrating = true;

      const showBanner =
        optIn &&
        !decision.analytics &&
        signals.localAnalytics === null &&
        !signals.account &&
        !signals.emailOptOut &&
        !signals.gpc;

      await CookieConsent.run({
        mode: optIn ? "opt-in" : "opt-out",
        autoShow: showBanner,
        hideFromBots: true,
        disablePageInteraction: false,
        cookie: {
          name: CONSENT_COOKIE,
          expiresAfterDays: 182,
          sameSite: "Lax",
          secure: window.location.protocol === "https:",
        },
        guiOptions: {
          consentModal: {
            layout: "box",
            position: "bottom left",
            equalWeightButtons: true,
          },
          preferencesModal: {
            layout: "box",
            equalWeightButtons: true,
          },
        },
        categories: {
          necessary: { enabled: true, readOnly: true },
          analytics: {
            enabled: decision.analytics,
            autoClear: {
              cookies: [{ name: /^_ga/ }, { name: "_gid" }, { name: "_gat" }],
            },
          },
        },
        language: {
          default: "en",
          translations: {
            en: {
              consentModal: {
                title: "Cookies on nichegolfHQ",
                description:
                  "We store a necessary cookie to remember this choice. If you allow analytics, Google Analytics tells us which pages are read. We do not run ads or sell personal information. Signed-in choices are saved to your account. <a href=\"/privacy\">Privacy policy</a>.",
                acceptAllBtn: "Accept analytics",
                acceptNecessaryBtn: "Reject analytics",
                showPreferencesBtn: "Manage choices",
                footer: "<a href=\"/privacy-choices\">Your Privacy Choices</a>",
              },
              preferencesModal: {
                title: "Cookie settings",
                acceptAllBtn: "Accept analytics",
                acceptNecessaryBtn: "Reject analytics",
                savePreferencesBtn: "Save choices",
                closeIconLabel: "Close",
                sections: [
                  {
                    title: "How this works",
                    description: sessionGpc
                      ? "A Global Privacy Control signal is on, so analytics stays off. That opt-out is kept even if an older account setting allowed analytics."
                      : "If you are not signed in, this choice stays in this browser. If you are signed in, it is saved to your account and applied on your other devices. A browser opt-out or Global Privacy Control signal is not replaced by an older account setting that allowed analytics. To opt out of the newsletter as well, use the form on Your Privacy Choices.",
                  },
                  {
                    title: "Necessary",
                    description: "Remembers your cookie choice and a Do Not Sell or Share choice. These stay on.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Analytics",
                    description:
                      "Google Analytics 4. Google signals and ads personalization are off. Advertising storage stays denied.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
          },
        },
        onFirstConsent: onUserChange,
        onConsent: () => {
          if (!hydrating) onUserChange();
        },
        onChange: onUserChange,
      });

      await applySignals(signals, "load");

      const supabase = getSupabase();
      supabase?.auth.onAuthStateChange(() => {
        void (async () => {
          const next = await loadSignedInPrivacy();
          sessionSignedIn = next.signedIn;
          sessionEmailOptOut = next.emailOptOut;
          await applySignals(signalsFromBrowser(next.account, next.emailOptOut), "load");
        })();
      });
    })();
  }, [country, serverGpc]);

  return null;
}
