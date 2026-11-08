"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Player, PlayerAppearance } from "@/data/players/types";
import { roundHasScores, standings } from "@/data/hubs/four-ball";
import { EWING_OFFICIAL, EWING_SNAPSHOT } from "@/data/hubs/ewing-cup-four-ball";
import { FourBallBoard } from "./FourBallBoard";

export type ChampionRow = { year: number; champion: string };

export type HubArticle = { href: string; title: string; date: string; summary: string };

type Tab = "Overview" | "Scoring" | "Field" | "Event";

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

export function EwingCupHub({
  division,
  channelLabel,
  pastChampions,
  entrants,
  articles,
}: {
  division: "mid-am" | "senior";
  channelLabel: "midamgolfHQ" | "seniorgolfHQ";
  pastChampions: ChampionRow[];
  entrants: Array<Player & { appearances: PlayerAppearance[] }>;
  articles: HubArticle[];
}) {
  const tabs: Tab[] = ["Overview", "Scoring", "Field", "Event"];
  const [tab, setTab] = useState<Tab>("Overview");
  const [roundId, setRoundId] = useState<(typeof EWING_SNAPSHOT.rounds)[number]["id"]>("round-1");
  const [query, setQuery] = useState("");
  const sideLabel = division === "mid-am" ? "Mid-Amateur" : "Senior";
  const round = EWING_SNAPSHOT.rounds.find((item) => item.id === roundId) ?? EWING_SNAPSHOT.rounds[0];
  const divisionTeams = EWING_SNAPSHOT.teams.filter((team) => team.division === division);
  const visibleEntrants = useMemo(() => {
    return entrants.filter((player) => {
      const appearance = player.appearances.find((row) => row.eventSlug === "ewing-cup-four-ball");
      if (appearance?.sideLabel !== sideLabel) return false;
      return player.name.toLowerCase().includes(query.trim().toLowerCase());
    });
  }, [entrants, query, sideLabel]);
  const board = standings(
    divisionTeams.map((team) => ({
      id: team.id,
      division: team.division,
      divisionLabel: team.divisionLabel,
      names: team.names,
      score: team.score,
    })),
    division,
  );

  return (
    <div className="ewing-cup-hub bg-zinc-50 text-zinc-950">
      <section className="mx-auto w-full max-w-6xl px-5 py-8 text-center md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{channelLabel}</p>
        <Image src="/brand/midamgolfhq/Ewing Cup.jpeg" alt="" width={72} height={72} className="mx-auto mt-3 h-16 w-16 rounded-xl object-cover" />
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-center font-serif text-4xl font-semibold tracking-tight md:text-6xl">
          Ewing Cup Four-Ball
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-zinc-600 md:text-lg">
          Dallas Athletic Club, Dallas, Texas. Nov. 13-15, 2026.
        </p>
        <div className="mt-4 flex justify-center">
          <LiveScoringButton url={EWING_SNAPSHOT.scoringUrl} />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-6 text-zinc-600">
          {division === "mid-am" ? "54-hole better ball, mid-amateur division." : "54-hole better ball, senior division."}
        </p>
      </section>

      <div className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-2 px-5 py-3" role="tablist" aria-label="Ewing Cup sections">
          {tabs.map((item) => (
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
          <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {EWING_SNAPSHOT.rounds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setRoundId(item.id);
                  setTab("Scoring");
                }}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-center hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{item.label}</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{item.course}</p>
                <p className="mt-2 text-sm text-emerald-800">
                  {roundHasScores(divisionTeams, EWING_SNAPSHOT.rounds.findIndex((round) => round.id === item.id) as 0 | 1 | 2)
                    ? "Scores posted"
                    : "No scores yet"}
                </p>
              </button>
            ))}
          </div>
          <section className="mx-auto mt-8 max-w-xl text-center">
            <h2 className="font-serif text-2xl font-semibold">How to play</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">The official Apply page requires a password.</p>
            <a
              href={EWING_OFFICIAL.apply}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
            >
              Application information
            </a>
          </section>
          {articles.length > 0 ? (
            <div className="mt-8 grid gap-4">
              {articles.map((article) => (
                <Link key={article.href} href={article.href} className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-emerald-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{article.date}</p>
                  <h2 className="mt-2 font-serif text-2xl font-semibold">{article.title}</h2>
                  {article.summary ? <p className="mt-2 text-base leading-7 text-zinc-600">{article.summary}</p> : null}
                </Link>
              ))}
            </div>
          ) : null}
          </>
        )}

        {tab === "Scoring" && (
          <div>
            <div className="flex flex-wrap justify-center gap-2 pb-4">
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
            <h2 className="text-center font-serif text-3xl font-semibold">{round.label}</h2>
            {round.publicLine ? <p className="mt-2 text-center text-base text-zinc-700">{round.publicLine}</p> : null}
            <div className="mt-4">
              <FourBallBoard rows={board} />
            </div>
            <div className="mt-4 flex justify-center">
              <a
                href={EWING_OFFICIAL.information}
                className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                Official schedule
              </a>
            </div>
          </div>
        )}

        {tab === "Field" && (
          <div>
            <div className="flex justify-center">
              <label className="sr-only" htmlFor="ewing-player-search">Search players</label>
              <input
                id="ewing-player-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search players"
                className="w-full max-w-xs rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              />
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {visibleEntrants.map((player) => {
                const appearance = player.appearances.find(
                  (row) => row.eventSlug === "ewing-cup-four-ball" && row.sideLabel === sideLabel,
                );
                const partner = appearance?.partnerIds?.[0]
                  ? entrants.find((item) => item.id === appearance.partnerIds?.[0])
                  : undefined;
                return (
                  <li key={player.id}>
                    <Link
                      href={`/midamgolfhq/players/${player.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-950 font-serif text-sm text-white" aria-hidden>
                        {initials(player.name)}
                      </span>
                      <span>
                        <span className="block font-semibold text-zinc-950">{player.name}</span>
                        <span className="block text-sm text-zinc-500">
                          {appearance?.sideLabel}
                          {partner ? ` with ${partner.name}` : ""}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {tab === "Event" && (
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-center">
              <h2 className="font-serif text-2xl font-semibold">Dallas Athletic Club</h2>
              <p className="mt-2 text-sm text-zinc-600">4111 Dallas Athletic Club Drive, Dallas, TX 75228</p>
              <dl className="mt-4 space-y-3 text-sm text-zinc-700">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Format</dt>
                  <dd className="mt-1">54 holes better ball</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Gold Course</dt>
                  <dd className="mt-1 text-balance">Back tees, par 72, 7,169 yards, 75.1 / 142</dd>
                </div>
              </dl>
            </section>
            {pastChampions.length ? (
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-center font-serif text-2xl font-semibold">Past winners</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {pastChampions.map((row) => (
                  <li key={row.year} className="flex justify-between gap-3 border-b border-zinc-100 py-1">
                    <span className="font-semibold">{row.year}</span>
                    <span className="text-right">{row.champion}</span>
                  </li>
                ))}
              </ul>
            </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function LiveScoringButton({ url }: { url: string | null }) {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full bg-emerald-800 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        Live scoring
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="inline-flex cursor-not-allowed rounded-full border border-zinc-300 bg-zinc-100 px-3.5 py-1.5 text-sm font-semibold text-zinc-400"
    >
      Live scoring
    </button>
  );
}

