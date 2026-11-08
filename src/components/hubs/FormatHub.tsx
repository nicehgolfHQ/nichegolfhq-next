"use client";

import Image from "next/image";
import { useState } from "react";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import { TournamentResults } from "@/components/tournaments/TournamentResults";
import { classifyFormat, resultsTabLabel, strokeRoundCount, type HubChannel } from "@/data/hubs/inventory";
import { resolveDatesLabel } from "@/lib/tournaments/dates";
import type { Tournament } from "@/lib/tournaments/types";

const CHANNEL_LABEL: Record<HubChannel, string> = {
  midam: "midamgolfHQ",
  junior: "juniorgolfHQ",
  senior: "seniorgolfHQ",
};

const CHANNEL_PATH: Record<HubChannel, string> = {
  midam: "midamgolfhq",
  junior: "juniorgolfhq",
  senior: "seniorgolfhq",
};

type Panel = "Overview" | "Scoring" | "Matches" | "Field" | "Event" | "Coverage";

export function FormatHub({ tournament, channel }: { tournament: Tournament; channel: HubChannel }) {
  const kind = classifyFormat(tournament.format);
  const resultsLabel = resultsTabLabel(kind);
  const rounds = strokeRoundCount(tournament.format, kind);
  const hasNews = (tournament.news ?? []).length > 0;
  const tabs: Panel[] = ["Overview", resultsLabel, "Field", "Event", ...(hasNews ? (["Coverage"] as Panel[]) : [])];
  const [tab, setTab] = useState<Panel>("Overview");
  const [round, setRound] = useState(1);
  const dates = resolveDatesLabel(tournament.startDate, tournament.endDate, tournament.dates2026 ?? tournament.typicalDates);
  const place = [tournament.course, tournament.location].filter(Boolean).join(" · ");
  const scoringUrl = tournament.golfGeniusUrl;
  const scoringLabel = tournament.golfGeniusUrlLabel ?? "Live scoring";

  return (
    <div className="bg-zinc-50 text-zinc-950">
      <section className="mx-auto w-full max-w-6xl px-5 py-8 text-center md:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{CHANNEL_LABEL[channel]}</p>
        {tournament.logo ? (
          <Image src={tournament.logo} alt="" width={72} height={72} className="mx-auto mt-3 h-16 w-auto rounded-xl object-cover" />
        ) : null}
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-center font-serif text-4xl font-semibold tracking-tight md:text-6xl">
          {tournament.name}
        </h1>
        {place ? <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-zinc-600 md:text-lg">{place}</p> : null}
        {dates ? <p className="mt-2 text-base font-semibold text-zinc-900">{dates}</p> : null}
        {scoringUrl ? (
          <div className="mt-4 flex justify-center">
            <a
              href={scoringUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
            >
              {scoringLabel}
            </a>
          </div>
        ) : null}
        {tournament.format ? <p className="mx-auto mt-3 max-w-2xl text-balance text-sm leading-6 text-zinc-600">{tournament.format}</p> : null}
      </section>

      <div className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-2 px-5 py-3" role="tablist" aria-label={`${tournament.name} sections`}>
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
        <div hidden={tab !== "Overview"}>
          <OverviewPanel tournament={tournament} rounds={rounds} />
        </div>
        <div hidden={tab !== resultsLabel}>
          <ResultsPanel tournament={tournament} kind={kind} rounds={rounds} round={round} setRound={setRound} />
        </div>
        <div hidden={tab !== "Field"}>
          <p className="text-center text-sm text-zinc-600">No players posted</p>
        </div>
        <div hidden={tab !== "Event"}>
          <EventPanel tournament={tournament} />
        </div>
        {hasNews ? (
          <div hidden={tab !== "Coverage"}>
            <TournamentNews news={tournament.news} articleHrefPrefix={`/${CHANNEL_PATH[channel]}/${tournament.slug}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function OverviewPanel({ tournament, rounds }: { tournament: Tournament; rounds: number }) {
  const facts = [
    tournament.fieldSize ? { label: "Field", value: tournament.fieldSize } : null,
    tournament.eligibility ? { label: "Eligibility", value: tournament.eligibility } : null,
    tournament.founded ? { label: "Founded", value: String(tournament.founded) } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const defending = [...(tournament.pastResults ?? [])].sort((a, b) => b.year - a.year)[0];

  return (
    <div>
      {rounds > 0 ? (
        <div className={`grid grid-cols-1 gap-4 ${rounds >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : rounds === 3 ? "md:grid-cols-3" : rounds === 2 ? "md:grid-cols-2" : ""}`}>
          {Array.from({ length: rounds }, (_, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Round {index + 1}</p>
              {tournament.course ? <p className="mt-2 font-serif text-2xl font-semibold">{tournament.course}</p> : null}
              <p className="mt-2 text-sm text-emerald-800">No scores yet</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Format</p>
          <p className="mt-2 font-serif text-2xl font-semibold">{tournament.format}</p>
        </div>
      )}

      {facts.length > 0 || defending ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{fact.label}</p>
              <p className="mt-1 text-sm font-semibold">{fact.value}</p>
            </div>
          ))}
          {defending ? (
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Defending champion</p>
              <p className="mt-1 text-sm font-semibold">{defending.champion}</p>
              <p className="mt-1 text-xs text-zinc-500">{defending.year}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {tournament.overview ? (
        <p className="mx-auto mt-8 max-w-3xl text-left text-base leading-7 text-zinc-700">{tournament.overview}</p>
      ) : null}

      {(tournament.howToPlay ?? []).length > 0 ? (
        <section className="mx-auto mt-8 max-w-xl text-center">
          <h2 className="font-serif text-2xl font-semibold">How to play</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {tournament.howToPlay!.map((entry) =>
              entry.href ? (
                <a
                  key={entry.label}
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                >
                  {entry.label}
                </a>
              ) : (
                <p key={entry.label} className="text-sm font-semibold text-zinc-800">
                  {entry.label}
                </p>
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ResultsPanel({
  tournament,
  kind,
  rounds,
  round,
  setRound,
}: {
  tournament: Tournament;
  kind: ReturnType<typeof classifyFormat>;
  rounds: number;
  round: number;
  setRound: (round: number) => void;
}) {
  const scoringUrl = tournament.golfGeniusUrl;
  const scoringLabel = tournament.golfGeniusUrlLabel ?? "Live scoring";
  const heading = kind === "stroke" || kind === "four-ball" ? `Round ${round}` : resultsTabLabel(kind);

  return (
    <div>
      {rounds > 1 ? (
        <div className="flex flex-wrap justify-center gap-2 pb-4">
          {Array.from({ length: rounds }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={round === index + 1}
              onClick={() => setRound(index + 1)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                round === index + 1 ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white"
              }`}
            >
              Round {index + 1}
            </button>
          ))}
        </div>
      ) : null}
      <h2 className="text-center font-serif text-3xl font-semibold">{heading}</h2>
      <p className="mt-3 text-center text-sm text-zinc-600">{kind === "match" || kind === "team-match" || kind === "four-ball-match" ? "No matches posted" : "No scores yet"}</p>
      {scoringUrl ? (
        <div className="mt-4 flex justify-center">
          <a
            href={scoringUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            {scoringLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
}

function EventPanel({ tournament }: { tournament: Tournament }) {
  const facts = [
    tournament.course ? { label: "Course", value: tournament.course } : null,
    tournament.location ? { label: "Location", value: tournament.location } : null,
    tournament.courseTeeName ? { label: "Tee", value: tournament.courseTeeName } : null,
    tournament.coursePar ? { label: "Par", value: String(tournament.coursePar) } : null,
    tournament.courseYardage ? { label: "Yardage", value: `${tournament.courseYardage.toLocaleString()} yards` } : null,
    tournament.courseRating ? { label: "Rating", value: String(tournament.courseRating) } : null,
    tournament.courseSlope ? { label: "Slope", value: String(tournament.courseSlope) } : null,
    tournament.courseDesigner ? { label: "Designer", value: tournament.courseDesigner } : null,
    tournament.courseYear ? { label: "Opened", value: String(tournament.courseYear) } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <h2 className="font-serif text-2xl font-semibold">{tournament.course ?? tournament.name}</h2>
        {facts.length > 0 ? (
          <dl className="mt-4 space-y-3 text-sm text-zinc-700">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{fact.label}</dt>
                <dd className="mt-1 text-balance">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>
      <TournamentResults tournament={tournament} />
    </div>
  );
}
