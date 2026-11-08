"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Player, PlayerAppearance } from "@/data/players/types";
import {
  EWING_OFFICIAL,
  EWING_SNAPSHOT,
  type PlannedRound,
} from "@/data/hubs/ewing-cup-four-ball";

export type ChampionRow = { year: number; champion: string };

const TABS = ["Overview", "Scoring", "Field", "Event"] as const;
type Tab = (typeof TABS)[number];

function formatChecked(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function EwingCupHub({
  pastChampions,
  entrants,
}: {
  pastChampions: ChampionRow[];
  entrants: Array<Player & { appearances: PlayerAppearance[] }>;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [roundId, setRoundId] = useState<PlannedRound["id"]>("round-1");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const round = EWING_SNAPSHOT.rounds.find((item) => item.id === roundId) ?? EWING_SNAPSHOT.rounds[1];
  const checkedLabel = formatChecked(EWING_SNAPSHOT.checkedAt);
  const visibleEntrants = entrants.filter((player) =>
    player.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selected = entrants.find((player) => player.id === selectedId) ?? null;

  return (
    <div className="ewing-cup-hub bg-zinc-50 text-zinc-950">
      <div className="border-b border-emerald-200 bg-emerald-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3 text-sm text-emerald-950 md:flex-row md:items-center md:justify-between">
          <p>Verified read, not a live feed. Last checked {checkedLabel}.</p>
          <p>Field not published. Leaderboard not posted.</p>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-8 md:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">midamgolfHQ</p>
          <div className="mt-3 flex items-center gap-4">
            <Image src="/brand/midamgolfhq/Ewing Cup.jpeg" alt="" width={72} height={72} className="h-16 w-16 rounded-xl object-cover" />
            <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-6xl">Ewing Cup Four-Ball</h1>
          </div>
          <p className="mt-4 max-w-2xl text-base text-zinc-600 md:text-lg">
            Dallas Athletic Club, Dallas, Texas. Competition Nov. 13-15, 2026. Practice round Thursday, Nov. 12.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <StatusCard label="Field" value="Not published" />
            <StatusCard label="Leaderboard" value="Not posted" />
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            54-hole better ball. The event has not started, so this page has no scores.
          </p>
        </div>
      </section>

      <div className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-5 py-3" role="tablist" aria-label="Ewing Cup sections">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                tab === item ? "bg-zinc-950 text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:py-10">
        {tab === "Overview" && (
          <div className="grid gap-4 md:grid-cols-4">
            {EWING_SNAPSHOT.rounds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setRoundId(item.id);
                  setTab("Scoring");
                }}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-left hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{item.label}</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{item.course}</p>
                <p className="mt-2 text-sm text-emerald-800">{item.scored ? "No scores yet" : "No scoring round"}</p>
              </button>
            ))}
          </div>
        )}

        {tab === "Scoring" && (
          <div>
            <div className="flex flex-wrap gap-2 pb-4">
              {EWING_SNAPSHOT.rounds.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={round.id === item.id}
                  onClick={() => setRoundId(item.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                    round.id === item.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <h2 className="font-serif text-3xl font-semibold">{round.label}</h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-700">{round.detail}</p>
            <p className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-base leading-7 text-zinc-700">
              {round.scored
                ? "No team scores are available. A public leaderboard was not linked from the official site at the last check, and this round has not been played."
                : "Thursday is registration and a practice round. It is not a scored round."}
            </p>
            <a
              href={EWING_OFFICIAL.information}
              className="mt-4 inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
            >
              Official schedule
            </a>
          </div>
        )}

        {tab === "Field" && entrants.length === 0 && (
          <div className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-serif text-3xl font-semibold">2026 field</h2>
            <p className="mt-3 text-base leading-7 text-zinc-700">
              No entrants are on file. The official home page and tournament information loaded, and they did not name a 2026 field. The paths for players, field, entries, scoring, and leaderboard were not found.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              When a public list names players, each person gets a stable id and this page shows that record. A shared last name is not enough to merge two people.
            </p>
          </div>
        )}

        {tab === "Field" && entrants.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <label className="sr-only" htmlFor="ewing-player-search">Search players</label>
              <input
                id="ewing-player-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search players"
                className="w-full max-w-xs rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              />
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {visibleEntrants.map((player) => (
                  <li key={player.id}>
                    <button
                      type="button"
                      aria-pressed={selectedId === player.id}
                      onClick={() => setSelectedId(player.id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-950 font-serif text-sm text-white" aria-hidden>
                        {initials(player.name)}
                      </span>
                      <span className="font-semibold">{player.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <PlayerCard player={selected} />
          </div>
        )}

        {tab === "Event" && (
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Dallas Athletic Club</h2>
              <p className="mt-2 text-sm text-zinc-600">4111 Dallas Athletic Club Drive, Dallas, TX 75228</p>
              <dl className="mt-4 space-y-2 text-sm text-zinc-700">
                <div className="flex justify-between gap-4"><dt>Format on this site</dt><dd>54 holes better ball</dd></div>
                <div className="flex justify-between gap-4"><dt>Gold Course tee</dt><dd>Back</dd></div>
                <div className="flex justify-between gap-4"><dt>Par / yards</dt><dd>72 / 7,169</dd></div>
                <div className="flex justify-between gap-4"><dt>Rating / slope</dt><dd>75.1 / 142</dd></div>
              </dl>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Those course numbers are the Gold Course figures already published here. The official schedule sends Friday and Sunday to the Blue Course and Saturday to the Gold Course. Blue Course yardage was not on that page.
              </p>
              <a href="https://www.ewingcup.com/" className="mt-4 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-2">
                Apply on ewingcup.com
              </a>
            </section>
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Official champions, 2021-2025</h2>
              <p className="mt-2 text-sm text-zinc-600">From the tournament information page at the last check. 2023 was not played.</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-800">
                {EWING_SNAPSHOT.officialChampions.map((row) => (
                  <li key={`${row.year}-${row.division}`}>
                    <span className="font-semibold">{row.year}</span> {row.division}: {row.players}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 md:col-span-2">
              <h2 className="font-serif text-2xl font-semibold">Champions kept on nichegolfHQ</h2>
              <p className="mt-2 text-sm text-zinc-600">
                This is the list already published on the tournament record. It is one line per year and does not separate the senior division.
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                {pastChampions.map((row) => (
                  <li key={row.year} className="flex justify-between gap-3 border-b border-zinc-100 py-1">
                    <span className="font-semibold">{row.year}</span>
                    <span className="text-right">{row.champion}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold">{value}</p>
    </div>
  );
}

function PlayerCard({ player }: { player: (Player & { appearances: PlayerAppearance[] }) | null }) {
  if (!player) {
    return (
      <aside className="h-fit rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm leading-6 text-zinc-600">
        Select a player. The card shows initials and the events linked to that id. It does not add a bio or a headshot.
      </aside>
    );
  }
  return (
    <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 font-serif text-lg text-white" aria-hidden>
          {initials(player.name)}
        </span>
        <h2 className="font-serif text-2xl font-semibold">{player.name}</h2>
      </div>
      <ul className="mt-4 space-y-3 text-sm">
        {player.appearances.map((row) => (
          <li key={`${row.eventSlug}-${row.year}`}>
            <Link href={`/midamgolfhq/${row.eventSlug}`} className="font-semibold text-emerald-800 underline underline-offset-2">
              {row.year}
            </Link>
            {row.sideLabel ? <p>{row.sideLabel}</p> : null}
            {row.result ? <p>{row.result}</p> : null}
          </li>
        ))}
      </ul>
    </aside>
  );
}
