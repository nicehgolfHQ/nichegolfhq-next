"use client";

export function KetchPreferencesLink({
  label = "Cookie Preferences",
}: {
  label?: string;
}) {
  return (
    <a
      href="#"
      className="text-sm font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
      onClick={(e) => {
        e.preventDefault();
        // Ketch loads globally; guard for early clicks.
        const ketch = (window as any).ketch;
        if (typeof ketch === "function") {
          ketch("showPreferences");
        }
      }}
    >
      {label}
    </a>
  );
}
