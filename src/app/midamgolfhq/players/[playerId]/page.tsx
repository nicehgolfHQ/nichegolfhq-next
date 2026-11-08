import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { appearancesFor, getPlayer, PLAYERS } from "@/data/players/registry";
import { getMidAmTournamentBySlug } from "@/lib/tournaments/midam";

export function generateStaticParams() {
  return PLAYERS.map((player) => ({ playerId: player.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { playerId?: string } | Promise<{ playerId?: string }>;
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const player = getPlayer(resolved.playerId ?? "");
  if (!player) return { title: "Player | midamgolfHQ" };
  const description = `${player.name} on nichegolfHQ. Entries are limited to events where a source names this player.`;
  return {
    title: `${player.name} | midamgolfHQ`,
    description,
    alternates: { canonical: `/midamgolfhq/players/${player.id}` },
  };
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export default async function PlayerPage({
  params,
}: {
  params: { playerId?: string } | Promise<{ playerId?: string }>;
}) {
  const resolved = await Promise.resolve(params);
  const player = getPlayer(resolved.playerId ?? "");
  if (!player) notFound();
  const appearances = appearancesFor(player.id);

  return (
    <SiteShell>
      <style>{`
        body:has(.ewing-cup-hub) header.sticky { position: static; }
      `}</style>
      <article className="ewing-cup-hub mx-auto w-full max-w-3xl px-5 py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">Player</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 font-serif text-xl text-white" aria-hidden>
            {initials(player.name)}
          </span>
          <h1 className="font-serif text-4xl font-semibold">{player.name}</h1>
        </div>
        <ul className="mt-8 space-y-4">
          {appearances.map((row) => {
            const event = getMidAmTournamentBySlug(row.eventSlug);
            const partnerId = row.partnerIds?.[0];
            const partner = partnerId ? getPlayer(partnerId) : undefined;
            return (
              <li key={`${row.eventSlug}-${row.year}`} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{row.year}</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  <Link
                    href={row.sideLabel === "Senior" ? `/seniorgolfhq/${row.eventSlug}` : `/midamgolfhq/${row.eventSlug}`}
                    className="text-emerald-800 underline underline-offset-2"
                  >
                    {event?.name ?? row.eventSlug}
                  </Link>
                </h2>
                {row.sideLabel ? <p className="mt-2 text-sm text-zinc-700">{row.sideLabel}</p> : null}
                {partner ? (
                  <p className="mt-1 text-sm text-zinc-700">
                    Partner{" "}
                    <Link href={`/midamgolfhq/players/${partner.id}`} className="font-semibold text-emerald-800 underline underline-offset-2">
                      {partner.name}
                    </Link>
                  </p>
                ) : null}
                {row.result ? <p className="mt-2 text-sm">{row.result}</p> : <p className="mt-2 text-sm text-zinc-500">No result posted.</p>}
                <ul className="mt-3 space-y-1 text-xs text-zinc-500">
                  {row.sources.map((source) => (
                    <li key={source.checkedAt + source.title}>
                      {source.title}. Checked {source.checkedAt}. {source.established}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </article>
    </SiteShell>
  );
}
