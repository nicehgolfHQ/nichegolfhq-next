import type { Tournament } from "@/lib/tournaments/types";

export function TournamentHero({ tournament }: { tournament: Tournament }) {
  const dates = tournament.dates2026 ?? tournament.typicalDates;

  return (
    <section className="text-center">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
        {tournament.name}
      </h1>
      <div className="mt-4 text-sm text-zinc-500">
        {[tournament.course, tournament.location, dates]
          .filter(Boolean)
          .join(" \u2022 ")}
      </div>
      {tournament.prestige ? (
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm italic text-zinc-500">
            &ldquo;{tournament.prestige}&rdquo;
          </div>
        </div>
      ) : null}
      {tournament.golfGeniusUrl ? (
        <div className="mt-8">
          <a
            href={tournament.golfGeniusUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg"
          >
            <span>Live Scoring</span>
            <span aria-hidden>&rarr;</span>
          </a>
        </div>
      ) : null}
    </section>
  );
}
