import type { HowToPlayEntry } from "@/lib/tournaments/types";

export function TournamentHowToPlay({ howToPlay }: { howToPlay?: HowToPlayEntry[] }) {
  const hasEntries = howToPlay && howToPlay.length > 0;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
      <h2 className="text-sm font-semibold tracking-tight text-zinc-950 text-center">
        How to play
      </h2>
      <div className="mt-4 space-y-3">
        {hasEntries ? (
          howToPlay.map((entry, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center"
            >
              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
                >
                  {entry.label}
                </a>
              ) : (
                <div className="text-sm font-semibold text-zinc-950">
                  {entry.label}
                </div>
              )}
              {entry.note ? (
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {entry.note}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center">
            <p className="text-sm text-zinc-400">
              Details coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
