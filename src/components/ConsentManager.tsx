"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import { CONSENT_COOKIE, writeDoNotSell } from "@/lib/privacy/consentScript";
import { isOptInCountry } from "@/lib/privacy/regions";

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
let forcingOff = false;

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

    const gpc = gpcOn(serverGpc);
    const optIn = isOptInCountry(country);
    if (gpc) writeDoNotSell(true);

    const sync = () => {
      if (forcingOff) return;
      const accepted = CookieConsent.acceptedCategory("analytics");
      if (gpc && accepted) {
        forcingOff = true;
        CookieConsent.acceptCategory([], ["analytics"]);
        forcingOff = false;
        updateGtag("denied");
        return;
      }
      updateGtag(accepted && !gpc ? "granted" : "denied");
    };

    void CookieConsent.run({
      mode: optIn ? "opt-in" : "opt-out",
      autoShow: optIn && !gpc,
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
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: !optIn && !gpc,
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
                "We store a necessary cookie to remember this choice in this browser. If you allow analytics, Google Analytics tells us which pages are read. We do not run ads or sell personal information. <a href=\"/privacy\">Privacy policy</a>.",
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
                  description: gpc
                    ? "A Global Privacy Control signal is on, so analytics stays off in this browser. Cookie choices are saved in this browser only. To opt out across devices and from the newsletter, use the form on Your Privacy Choices."
                    : "Cookie choices are saved in this browser only. Visitors in the EEA, the UK, and Switzerland are asked before analytics runs. Everyone else can turn analytics off here. To opt out across devices and from the newsletter, submit the form on Your Privacy Choices with your email.",
                },
                {
                  title: "Necessary",
                  description:
                    "Remembers your cookie choice and, if you use it, your Do Not Sell or Share choice. These stay on.",
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
      onFirstConsent: sync,
      onConsent: sync,
      onChange: sync,
    }).then(sync);
  }, [country, serverGpc]);

  return null;
}
