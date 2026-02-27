import type { Tournament } from "@/lib/tournaments/types";

export function TournamentHero({ tournament }: { tournament: Tournament }) {
  const dates = tournament.dates2026 ?? tournament.typicalDates;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-8">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">{tournament.name}</h1>
      <div className="mt-3 text-sm text-zinc-600">
        {tournament.course} • {tournament.location}
        {dates ? ` • ${dates}` : ""}
      </div>
      {tournament.prestige ? (
        <div className="mt-5 max-w-3xl">
          <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm italic text-zinc-800">“{tournament.prestige}”</div>
        </div>
      ) : null}
    </section>
  );
}
