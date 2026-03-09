import type { Tournament } from "@/lib/tournaments/types";

export function TournamentHowToPlay({ tournament }: { tournament: Tournament }) {
  const entries = tournament.howToPlay;
  if (!entries || entries.length === 0) return null;

  return (
    <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5">
      <h2 className="text-sm font-semibold tracking-tight text-zinc-950">
        How to play
      </h2>

      <div className="mt-4 space-y-3">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          >
            {entry.href ? (
              <a
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                {entry.label} &rarr;
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
        ))}
      </div>
    </section>
  );
}
