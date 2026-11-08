"use client";

import { openCookieSettings } from "@/components/ConsentManager";

export function CookieSettingsLink({ className }: { className: string }) {
  return (
    <button type="button" className={className} onClick={() => openCookieSettings()}>
      Cookie Settings
    </button>
  );
}
