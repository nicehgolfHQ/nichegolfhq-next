import type { Tournament } from "@/lib/tournaments/types";

export function TournamentHero({ tournament }: { tournament: Tournament }) {
  const dates = tournament.dates2026 ?? tournament.typicalDates;

  return (
    <section className="text-center">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
        {tournament.name}
      </h1>
      <div className="mt-4 text-sm text-white/50">
        {[tournament.course, tournament.location, dates]
          .filter(Boolean)
          .join(" \u2022 ")}
      </div>
      {tournament.prestige ? (
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm italic text-white/60">
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
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg"
          >
            <span>Live Scoring</span>
            <span aria-hidden>&rarr;</span>
          </a>
        </div>
      ) : null}
    </section>
  );
}
