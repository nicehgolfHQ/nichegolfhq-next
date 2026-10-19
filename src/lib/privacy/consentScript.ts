import { OPT_IN_COUNTRIES } from "@/lib/privacy/regions";

export const CONSENT_COOKIE = "ng_cc";
export const DO_NOT_SELL_COOKIE = "ng_dns";

export function readStoredAnalyticsChoice(): boolean | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie ? document.cookie.split("; ") : [];
  for (const part of parts) {
    if (!part.startsWith(`${CONSENT_COOKIE}=`)) continue;
    try {
      const parsed = JSON.parse(decodeURIComponent(part.slice(CONSENT_COOKIE.length + 1))) as {
        categories?: unknown;
      };
      if (!parsed || !Array.isArray(parsed.categories)) return null;
      return parsed.categories.includes("analytics");
    } catch {
      return null;
    }
  }
  return null;
}

export function readDoNotSell(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((part) => part === `${DO_NOT_SELL_COOKIE}=1`);
}

export function writeDoNotSell(optedOut: boolean) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${DO_NOT_SELL_COOKIE}=${optedOut ? "1" : "0"}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

/**
 * Inline snippet that must run before gtag.js. EEA/UK/CH visitors start
 * with every storage type denied. Everywhere else, analytics is granted
 * unless the visitor already rejected it or a GPC signal is present.
 * Ad storage stays denied everywhere: the site does not run Google Ads.
 */
export function consentDefaultScript(serverGpc: boolean): string {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
var gpc = ${serverGpc ? "true" : "false"} || navigator.globalPrivacyControl === true;
var storedAnalytics = null;
try {
  var parts = document.cookie ? document.cookie.split("; ") : [];
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf("${CONSENT_COOKIE}=") !== 0) continue;
    var parsed = JSON.parse(decodeURIComponent(parts[i].slice(${CONSENT_COOKIE.length + 1})));
    if (parsed && Array.isArray(parsed.categories)) {
      storedAnalytics = parsed.categories.indexOf("analytics") !== -1;
    }
  }
} catch (e) {}
var analyticsDefault = (gpc || storedAnalytics === false) ? "denied" : "granted";
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted",
  wait_for_update: 2000,
  region: ${JSON.stringify(OPT_IN_COUNTRIES)}
});
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: analyticsDefault,
  functionality_storage: "granted",
  personalization_storage: "denied",
  security_storage: "granted"
});
if (storedAnalytics === true && !gpc) {
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted"
  });
}
`.trim();
}
