import type { Tournament } from "@/lib/tournaments/types";

function Fact({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-center">
      <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export function TournamentQuickFacts({ tournament }: { tournament: Tournament }) {
  const hasAny =
    Boolean(tournament.format) ||
    Boolean(tournament.fieldSize) ||
    Boolean(tournament.eligibility) ||
    Boolean(tournament.founded);

  if (!hasAny) return null;

  return (
    <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Fact label="Format" value={tournament.format} />
      <Fact label="Field" value={tournament.fieldSize} />
      <Fact label="Eligibility" value={tournament.eligibility} />
      <Fact label="Founded" value={tournament.founded} />
    </section>
  );
}
