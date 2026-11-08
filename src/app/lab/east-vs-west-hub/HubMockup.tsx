"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CUMULATIVE,
  MATCHES,
  OFFICIAL_SCORING_URL,
  SESSIONS,
  THROUGH_LABEL,
  VENUE_PHOTO,
  formatPoints,
  initials,
  players,
  saturdayRecord,
  teamOf,
  type SessionId,
  type Side,
  type VerifiedMatch,
} from "./data";

export type CoverageArticle = {
  href: string;
  title: string;
  date: string;
  summary: string;
  text: string;
};

const TABS = ["Overview", "Matches", "Players", "Coverage", "Event"] as const;
type Tab = (typeof TABS)[number];

function resultLabel(match: VerifiedMatch) {
  if (match.winner === null) return "Halved";
  return match.result;
}

function MatchRow({ match }: { match: VerifiedMatch }) {
  return (
    <article className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 md:p-5">
      <TeamSide names={match.east} side="East" won={match.winner === "East"} lost={match.winner === "West"} />
      <div className="flex items-center justify-between gap-3 border-y border-zinc-100 py-2 md:w-36 md:flex-col md:border-0 md:py-0">
        <p className="font-serif text-lg font-semibold text-zinc-950">{resultLabel(match)}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {match.winner === null ? "Split" : `${match.winner} wins`}
        </p>
      </div>
      <TeamSide names={match.west} side="West" won={match.winner === "West"} lost={match.winner === "East"} align="end" />
    </article>
  );
}

function TeamSide({
  names,
  side,
  won,
  lost,
  align = "start",
}: {
  names: [string, string];
  side: Side;
  won: boolean;
  lost: boolean;
  align?: "start" | "end";
}) {
  return (
    <div className={align === "end" ? "md:text-right" : ""}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${side === "East" ? "text-emerald-800" : "text-zinc-500"}`}>
        {side}
      </p>
      <p className={`mt-1 text-base leading-6 ${won ? "font-semibold text-zinc-950" : lost ? "text-zinc-500" : "text-zinc-800"}`}>
        {names[0]}
        <span className="text-zinc-400"> and </span>
        {names[1]}
      </p>
    </div>
  );
}

export function HubMockup({ articles }: { articles: CoverageArticle[] }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [session, setSession] = useState<SessionId>("saturday-pm");
  const [teamFilter, setTeamFilter] = useState<"All" | Side>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const playerPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected || !playerPanel.current) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      playerPanel.current.scrollIntoView({ block: "start" });
    }
  }, [selected]);

  const roster = useMemo(() => {
    return players().filter((name) => {
      const team = teamOf(name);
      if (teamFilter !== "All" && team !== teamFilter) return false;
      return name.toLowerCase().includes(query.trim().toLowerCase());
    });
  }, [query, teamFilter]);

  const sessionMatches = MATCHES.filter((match) => match.session === session);
  const activeSession = SESSIONS.find((item) => item.id === session) ?? SESSIONS[2];

  function openSession(next: SessionId) {
    setSession(next);
    setTab("Matches");
  }

  function openPlayer(name: string) {
    setSelected(name);
    setTab("Players");
  }

  return (
    <div className="bg-zinc-50 text-zinc-950">
      <div className="border-b border-emerald-200 bg-emerald-50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3 text-sm text-emerald-950 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold">Concept for review.</span> Not live scores, and not the published hub.
          </p>
          <p>Verified through {THROUGH_LABEL}.</p>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-8 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] md:items-end md:py-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">midamgolfHQ</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
            East vs West
          </h1>
          <p className="mt-3 text-base text-zinc-600 md:text-lg">
            Maridoe Golf Club, Carrollton, Texas. Nov. 6-8, 2026.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <ScoreBlock side="East" points={CUMULATIVE.East} leading={false} />
            <ScoreBlock side="West" points={CUMULATIVE.West} leading />
          </div>
          <p className="mt-3 text-sm text-zinc-600">
            West leads by 3. Standing after Saturday afternoon foursomes. Sunday singles have not started.
          </p>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900">
          <div className="relative aspect-[16/10]">
            <Image
              src={VENUE_PHOTO.src}
              alt={VENUE_PHOTO.alt}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </figure>
      </section>

      <div className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-5 py-3">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tab === item}
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
            {SESSIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openSession(item.id)}
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-left hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{item.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
                <p className="mt-4 font-serif text-2xl font-semibold leading-tight text-zinc-950">
                  {item.East === null ? "Upcoming" : `East ${formatPoints(item.East)}`}
                </p>
                {item.West !== null && (
                  <p className="font-serif text-2xl font-semibold leading-tight text-zinc-950">
                    West {formatPoints(item.West)}
                  </p>
                )}
                <p className="mt-1 text-sm text-emerald-800">{item.status === "Final" ? "See matches" : "No scores yet"}</p>
              </button>
            ))}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:col-span-4">
              <h2 className="font-serif text-2xl font-semibold">How to read this</h2>
              <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-700">
                Scores here are a once-a-day verified record, not a live feed. Friday is the session total only. Saturday morning and afternoon list every supplied pairing. Sunday is still to come.
              </p>
            </div>
          </div>
        )}

        {tab === "Matches" && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {SESSIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={session === item.id}
                  onClick={() => setSession(item.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                    session === item.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-zinc-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl font-semibold">{activeSession.label}</h2>
                <p className="mt-1 text-sm text-zinc-600">{activeSession.detail}</p>
              </div>
              <p className="text-sm font-semibold text-zinc-800">
                {activeSession.East === null
                  ? "Not started"
                  : `East ${formatPoints(activeSession.East)}, West ${formatPoints(activeSession.West ?? 0)}`}
              </p>
            </div>
            {activeSession.note ? (
              <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-base leading-7 text-zinc-700">
                {activeSession.note}
              </p>
            ) : (
              <div className="space-y-3">
                {sessionMatches.map((match) => (
                  <MatchRow key={`${match.session}-${match.east.join("-")}`} match={match} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "Players" && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="order-2 lg:order-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="sr-only" htmlFor="player-search">Search players</label>
                <input
                  id="player-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search players"
                  className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 sm:max-w-xs"
                />
                <div className="flex gap-2">
                  {(["All", "East", "West"] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={teamFilter === item}
                      onClick={() => setTeamFilter(item)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                        teamFilter === item ? "bg-emerald-800 text-white" : "bg-white text-zinc-700 ring-1 ring-zinc-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-500">Saturday record only. Friday lineups are not in this verified set.</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {roster.map((name) => {
                  const record = saturdayRecord(name);
                  const team = teamOf(name);
                  const active = selected === name;
                  return (
                    <li key={name}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected(name)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                          active ? "border-emerald-800 bg-emerald-50" : "border-zinc-200 bg-white hover:border-zinc-400"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-950 font-serif text-sm text-white" aria-hidden>
                          {initials(name)}
                        </span>
                        <span>
                          <span className="block font-semibold text-zinc-950">{name}</span>
                          <span className="block text-sm text-zinc-500">
                            {team} · {record.w}-{record.l}-{record.h}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div ref={playerPanel} className="order-1 scroll-mt-40 lg:order-2">
              <PlayerBreakout name={selected} articles={articles} onPick={openPlayer} />
            </div>
          </div>
        )}

        {tab === "Coverage" && (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{article.date}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-zinc-950">{article.title}</h2>
                <p className="mt-2 text-base leading-7 text-zinc-600">{article.summary}</p>
              </Link>
            ))}
          </div>
        )}

        {tab === "Event" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Maridoe Golf Club</h2>
              <dl className="mt-4 space-y-2 text-sm text-zinc-700">
                <div className="flex justify-between gap-4"><dt>Dates</dt><dd>Nov. 6-8, 2026</dd></div>
                <div className="flex justify-between gap-4"><dt>Place</dt><dd>Carrollton, Texas</dd></div>
                <div className="flex justify-between gap-4"><dt>Format</dt><dd className="text-right">Team match play</dd></div>
                <div className="flex justify-between gap-4"><dt>Tee</dt><dd>Back</dd></div>
                <div className="flex justify-between gap-4"><dt>Par / yards</dt><dd>72 / 7,854</dd></div>
                <div className="flex justify-between gap-4"><dt>Rating / slope</dt><dd>79.6 / 155</dd></div>
              </dl>
              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Friday four-ball, Saturday morning and afternoon foursomes, Sunday singles. The singles draw is not in this verified set.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold">Where the scores live</h2>
              <p className="mt-3 text-base leading-7 text-zinc-700">
                This concept does not call a scoring feed. The published hub and the official scoring page stay as they are.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={OFFICIAL_SCORING_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                >
                  Official scoring on Golf Genius
                </a>
                <Link
                  href="/midamgolfhq/east-vs-west-matches"
                  className="inline-flex justify-center rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                >
                  Published tournament hub
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerBreakout({
  name,
  articles,
  onPick,
}: {
  name: string | null;
  articles: CoverageArticle[];
  onPick: (name: string) => void;
}) {
  if (!name) {
    return (
      <aside className="h-fit rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm leading-6 text-zinc-600 lg:sticky lg:top-36">
        Select a player to see Saturday pairings and any nichegolfHQ story that names them. No headshot, career record, or ranking is shown.
      </aside>
    );
  }
  const team = teamOf(name);
  const record = saturdayRecord(name);
  const ownMatches = MATCHES.filter((match) => match.east.includes(name) || match.west.includes(name));
  const coverage = articles.filter((article) => article.text.includes(name));
  return (
    <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 lg:sticky lg:top-36">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 font-serif text-lg text-white" aria-hidden>
          {initials(name)}
        </span>
        <div>
          <h2 className="font-serif text-2xl font-semibold">{name}</h2>
          <p className="text-sm text-zinc-500">{team} team</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-600">
        Saturday {record.w}-{record.l}-{record.h}. Wins, losses, halves from the verified matches only.
      </p>
      <ul className="mt-4 space-y-3">
        {ownMatches.map((match) => {
          const onEast = match.east.includes(name);
          const partner = (onEast ? match.east : match.west).find((player) => player !== name) ?? "";
          const opponents = onEast ? match.west : match.east;
          const outcome = match.winner === null ? "Halved" : match.winner === (onEast ? "East" : "West") ? "Won" : "Lost";
          return (
            <li key={`${match.session}-${name}`} className="rounded-xl bg-zinc-50 p-3 text-sm leading-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {match.session === "saturday-am" ? "Saturday morning" : "Saturday afternoon"} · {outcome}
              </p>
              <p className="mt-1 text-zinc-800">
                with{" "}
                <button
                  type="button"
                  onClick={() => onPick(partner)}
                  className="font-semibold text-emerald-800 underline underline-offset-2"
                >
                  {partner}
                </button>
              </p>
              <p className="text-zinc-600">vs {opponents[0]} and {opponents[1]}</p>
              <p className="font-semibold text-zinc-900">{resultLabel(match)}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border-t border-zinc-200 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Coverage</h3>
        {coverage.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">No published story names this player.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {coverage.map((article) => (
              <li key={article.href}>
                <Link href={article.href} className="text-sm font-semibold text-emerald-800 underline underline-offset-2">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function ScoreBlock({ side, points, leading }: { side: Side; points: number; leading: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${leading ? "border-emerald-800 bg-emerald-800 text-white" : "border-zinc-200 bg-white text-zinc-950"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${leading ? "text-emerald-100" : "text-emerald-800"}`}>{side}</p>
      <p className="mt-1 font-serif text-5xl font-semibold md:text-6xl">{points}</p>
      <p className={`text-sm ${leading ? "text-emerald-100" : "text-zinc-500"}`}>{leading ? "Leads" : "Trailing"}</p>
    </div>
  );
}
