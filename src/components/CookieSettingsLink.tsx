"use client";

import { openCookieSettings } from "@/components/ConsentManager";

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="text-sm font-semibold text-white underline underline-offset-2 hover:text-white/70"
      onClick={() => openCookieSettings()}
    >
      Cookie Settings
    </button>
  );
}
