"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SponsorStrip } from "@/components/tournaments/SponsorStrip";
import { TournamentNews } from "@/components/tournaments/TournamentNews";
import { TournamentResults } from "@/components/tournaments/TournamentResults";
import { resultSnapshot, scopeLabel, snapshotNames, type ResultSnapshot, type StrokeSnapshot } from "@/data/hubs/batch1-results";
import { championLabel, classifyCalendar, classifyFormat, resultsTabLabel, strokeRoundCount, type HubChannel } from "@/data/hubs/inventory";
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

/** Public scope lines. These do not add scores. */
const RESULTS_NOTE: Record<string, string> = {
  "sanger-invitational": "Full results unavailable here.",
  "the-stocker-cup": "Full results unavailable here. See Coverage.",
  "the-crump-cup": "The posted sheet is pairings and tee times, not match results.",
  "usga-mens-mid-am": "Full results unavailable here. See Coverage.",
  "usga-womens-mid-am": "Full results unavailable here. See Coverage.",
  "elite-invitational": "Girls results unavailable here.",
  "us-junior-amateur": "Full results unavailable here.",
  "us-girls-junior": "Full results unavailable here.",
  "us-womens-amateur": "Full results unavailable here.",
  "boys-junior-pga": "Full results unavailable here.",
  "wyndham-cup": "Full results unavailable here.",
  "junior-presidents-cup": "Full results unavailable here.",
  "dustin-johnson-world-junior": "Full results unavailable here. See Coverage.",
};

export function FormatHub({ tournament, channel }: { tournament: Tournament; channel: HubChannel }) {
  const kind = classifyFormat(tournament.format);
  const resultsLabel = resultsTabLabel(kind);
  const standing = classifyCalendar(tournament);
  const snapshot = resultSnapshot(tournament.slug);
  const rounds = snapshot?.kind === "stroke" ? snapshot.roundCount : strokeRoundCount(tournament.format, kind);
  const hasNews = (tournament.news ?? []).length > 0;
  const tabs: Panel[] = ["Overview", resultsLabel, "Field", "Event", ...(hasNews ? (["Coverage"] as Panel[]) : [])];
  const [tab, setTab] = useState<Panel>("Overview");
  const [round, setRound] = useState(() =>
    snapshot?.kind === "stroke" && snapshot.scope !== "published-finishers" ? snapshot.roundCount : 1,
  );
  const [division, setDivision] = useState(0);
  const dates = resolveDatesLabel(tournament.startDate, tournament.endDate, tournament.dates2026 ?? tournament.typicalDates);
  const place = [tournament.course, tournament.location].filter(Boolean).join(" · ");
  const names = snapshot ? snapshotNames(snapshot) : [];

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
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ScoringAccess tournament={tournament} />
          {tournament.golfGeniusUrl && tournament.tournamentWebsite ? (
            <a
              href={tournament.tournamentWebsite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800"
            >
              {tournament.tournamentWebsiteLabel ?? "Tournament website"}
            </a>
          ) : null}
        </div>
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
          <OverviewPanel tournament={tournament} rounds={rounds} standing={standing} />
        </div>
        <div hidden={tab !== resultsLabel}>
          <ResultsPanel
            tournament={tournament}
            snapshot={snapshot}
            rounds={rounds}
            round={round}
            setRound={setRound}
            channel={channel}
            division={division}
            setDivision={setDivision}
          />
        </div>
        <div hidden={tab !== "Field"}>
          <FieldPanel snapshot={snapshot} names={names} />
        </div>
        <div hidden={tab !== "Event"}>
          <EventPanel tournament={tournament} standing={standing} snapshot={snapshot} />
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

function ScoringAccess({ tournament }: { tournament: Tournament }) {
  if (tournament.golfGeniusUrl) {
    const label = tournament.golfGeniusUrlLabel ?? (tournament.golfGeniusCode ? `Live scoring · ${tournament.golfGeniusCode}` : "Live scoring");
    return (
      <a
        href={tournament.golfGeniusUrl}
        target="_blank"
        rel="noreferrer"
        title={tournament.golfGeniusCode ? `Golf Genius ID: ${tournament.golfGeniusCode}` : undefined}
        className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
      >
        {label}
      </a>
    );
  }
  if (tournament.golfGeniusCode) {
    return (
      <span
        className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white"
        title={`Golf Genius ID: ${tournament.golfGeniusCode}`}
      >
        Live scoring · {tournament.golfGeniusCode}
      </span>
    );
  }
  if (tournament.tournamentWebsite) {
    return (
      <a
        href={tournament.tournamentWebsite}
        target="_blank"
        rel="noreferrer"
        className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800"
      >
        {tournament.tournamentWebsiteLabel ?? "Tournament website"}
      </a>
    );
  }
  return null;
}

function OverviewPanel({
  tournament,
  rounds,
  standing,
}: {
  tournament: Tournament;
  rounds: number;
  standing: ReturnType<typeof classifyCalendar>;
}) {
  const facts = [
    tournament.fieldSize ? { label: "Field", value: tournament.fieldSize } : null,
    tournament.eligibility ? { label: "Eligibility", value: tournament.eligibility } : null,
    tournament.founded ? { label: "Founded", value: String(tournament.founded) } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const latest = [...(tournament.pastResults ?? [])].sort((a, b) => b.year - a.year)[0];

  return (
    <div>
      {rounds > 0 && standing === "scheduled-2026" ? (
        <div className={`grid grid-cols-1 gap-4 ${rounds >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : rounds === 3 ? "md:grid-cols-3" : rounds === 2 ? "md:grid-cols-2" : ""}`}>
          {Array.from({ length: rounds }, (_, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Round {index + 1}</p>
              {tournament.course ? <p className="mt-2 font-serif text-2xl font-semibold">{tournament.course}</p> : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Format</p>
          <p className="mt-2 font-serif text-2xl font-semibold">{tournament.format}</p>
        </div>
      )}

      {facts.length > 0 || latest ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{fact.label}</p>
              <p className="mt-1 max-w-md text-sm font-semibold">{fact.value}</p>
            </div>
          ))}
          {latest ? (
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{championLabel(latest.year, 2026, standing)}</p>
              <p className="mt-1 text-sm font-semibold">{latest.champion}</p>
              <p className="mt-1 text-xs text-zinc-500">{latest.year}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {tournament.overview ? (
        <p className="mx-auto mt-8 max-w-3xl text-left text-base leading-7 text-zinc-700">{tournament.overview}</p>
      ) : null}

      {tournament.slug === "the-crump-cup" ? (
        <div className="mx-auto mt-8 max-w-xl">
          <SponsorStrip sponsorName="IBT Golf Travel" sponsorUrl="https://ibt-golf.com" attribution="Supported by" discountCode="IBTNicheGolfHQ" />
        </div>
      ) : null}
      {tournament.slug === "usga-mens-mid-am" || tournament.slug === "the-farrell" ? (
        <div className="mx-auto mt-8 max-w-xl">
          <SponsorStrip sponsorName="PuttView Books" sponsorUrl="https://puttviewbooks.com/" attribution="Supported by" />
        </div>
      ) : null}

      {(tournament.howToPlay ?? []).length > 0 ? (
        <section className="mx-auto mt-8 max-w-xl text-center">
          <h2 className="font-serif text-2xl font-semibold">How to play</h2>
          <ul className="mt-4 space-y-3">
            {tournament.howToPlay!.map((entry) => (
              <li key={entry.label}>
                {entry.href ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                  >
                    {entry.label}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-zinc-800">{entry.label}</p>
                )}
                {entry.note ? <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-zinc-600">{entry.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function ResultsPanel({
  tournament,
  snapshot,
  rounds,
  round,
  setRound,
  channel,
  division,
  setDivision,
}: {
  tournament: Tournament;
  snapshot: ResultSnapshot | null;
  rounds: number;
  round: number;
  setRound: (round: number) => void;
  channel: HubChannel;
  division: number;
  setDivision: (division: number) => void;
}) {
  const stroke = snapshot?.kind === "stroke" ? snapshot : null;
  const resultsNote = RESULTS_NOTE[tournament.slug];
  const divisions = stroke?.divisions && stroke.divisions.length > 0 ? stroke.divisions : null;
  const activeRows = divisions ? divisions[division]?.rows ?? divisions[0].rows : stroke?.rows ?? [];
  const roundScores = activeRows.some((row) => row.rounds.some((score) => score != null));
  return (
    <div>
      {stroke || (!snapshot && editionResult(tournament)) ? (
        <>
          {divisions ? (
            <div className="mb-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Division">
              {divisions.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={division === index}
                  onClick={() => setDivision(index)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                    division === index ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          {roundScores && rounds > 1 ? (
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
          <h2 className="text-center font-serif text-3xl font-semibold">{snapshot ? scopeLabel(snapshot) : "Selected results"}</h2>
          {resultsNote ? <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-600">{resultsNote}</p> : null}
          {stroke?.stageLabel ? <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-600">{stroke.stageLabel}</p> : null}
          <div className="mt-4">
            {stroke ? (
              divisions ? (
                divisions.map((item, index) => (
                  <div key={item.label} hidden={division !== index} data-division={item.label}>
                    <StrokeTable snapshot={stroke} rows={item.rows} highlight={roundScores ? round - 1 : -1} />
                  </div>
                ))
              ) : (
                <StrokeTable snapshot={stroke} rows={stroke.rows} highlight={roundScores ? round - 1 : -1} />
              )
            ) : (
              <ChampionTable tournament={tournament} />
            )}
          </div>
        </>
      ) : null}
      {snapshot?.kind === "match" ? <MatchTable snapshot={snapshot} /> : null}
      {snapshot?.kind === "team-match" ? <TeamTable snapshot={snapshot} /> : null}
      {snapshot?.sources.some((source) => source.articleSlug && source.label) ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {snapshot.sources.map((source) =>
            source.articleSlug && source.label ? (
              <Link
                key={source.articleSlug}
                href={`/${CHANNEL_PATH[channel]}/${tournament.slug}/${source.articleSlug}`}
                className="text-sm font-semibold text-emerald-800 underline underline-offset-2"
              >
                {source.label}
              </Link>
            ) : null,
          )}
        </div>
      ) : null}
      {!snapshot && !editionResult(tournament) ? (
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold">Results</h2>
          <p className="mt-3 text-sm text-zinc-600">{resultsNote ?? "Results unavailable here"}</p>
          <div className="mt-4 flex justify-center">
            <ScoringAccess tournament={tournament} />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-center">
          <ScoringAccess tournament={tournament} />
        </div>
      )}
    </div>
  );
}

function editionResult(tournament: Tournament) {
  return (tournament.pastResults ?? []).find((result) => result.year === 2026);
}

function ChampionTable({ tournament }: { tournament: Tournament }) {
  const result = editionResult(tournament);
  if (!result) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Selected results</caption>
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-3 py-3 font-semibold">Place</th>
            <th className="px-3 py-3 font-semibold">Player</th>
            <th className="px-3 py-3 font-semibold">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-zinc-100">
            <td className="px-3 py-3 font-semibold">1</td>
            <td className="px-3 py-3 font-semibold">{result.champion}</td>
            <td className="px-3 py-3">{result.score ?? ""}</td>
          </tr>
          {result.runnerUp ? (
            <tr>
              <td className="px-3 py-3 font-semibold">Runner-up</td>
              <td className="px-3 py-3" colSpan={2}>{result.runnerUp}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function StrokeTable({ snapshot, rows, highlight }: { snapshot: StrokeSnapshot; rows: StrokeSnapshot["rows"]; highlight: number }) {
  const hasRounds = rows.some((row) => row.rounds.some((score) => score != null));
  const hasDivision = rows.some((row) => row.division);
  const hasTeams = rows.some((row) => row.players && row.players.length > 1);
  const hasToPar = rows.some((row) => row.toPar);
  const pointsFirst = snapshot.scoring === "stableford-points" && snapshot.columnOrder === "total-then-rounds";
  const roundHeaders = hasRounds
    ? Array.from({ length: snapshot.roundCount }, (_, index) => (
        <th key={index} className={`px-3 py-3 font-semibold ${highlight === index ? "text-zinc-950" : ""}`}>
          R{index + 1}
        </th>
      ))
    : null;
  const totalHeader = <th className="px-3 py-3 font-semibold">Total</th>;
  const caption =
    snapshot.scope === "official-overall"
      ? "Overall results"
      : snapshot.scope === "official-final"
        ? "Final results"
        : snapshot.scope === "official-award"
          ? "Low Senior award"
          : snapshot.scope === "official-totals"
            ? "Qualifying totals"
            : snapshot.scope === "official-points"
              ? "Stableford points"
              : snapshot.scope === "official-partial"
                ? snapshot.stageLabel ?? "Partial results"
                : "Published finishers. Blank rounds were not in the source.";
  return (
    <div tabIndex={0} aria-label={caption} className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-3 py-3 font-semibold">Place</th>
            {hasDivision ? <th className="px-3 py-3 font-semibold">Division</th> : null}
            <th className="px-3 py-3 font-semibold">{hasTeams ? "Team" : "Player"}</th>
            {pointsFirst ? totalHeader : null}
            {roundHeaders}
            {hasToPar ? <th className="px-3 py-3 font-semibold">To par</th> : null}
            {pointsFirst ? null : totalHeader}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.division ?? ""}-${row.name}`} className="border-b border-zinc-100">
              <td className="px-3 py-3 font-semibold">{row.place}</td>
              {hasDivision ? <td className="px-3 py-3">{row.division}</td> : null}
              <td className="px-3 py-3">
                {row.players && row.players.length > 1 ? (
                  row.players.map((player) => (
                    <span key={player} className="block font-semibold">{player}</span>
                  ))
                ) : (
                  <span className="font-semibold">{row.name}</span>
                )}
                {row.hometown ? <span className="mt-1 block text-xs text-zinc-500">{row.hometown}</span> : null}
                {row.detail ? <span className="mt-1 block text-xs text-zinc-500">{row.detail}</span> : null}
              </td>
              {pointsFirst ? <td className="px-3 py-3 font-semibold tabular-nums">{row.total ?? ""}</td> : null}
              {hasRounds
                ? row.rounds.map((score, index) => (
                    <td key={index} className={`px-3 py-3 tabular-nums ${highlight === index ? "bg-emerald-50 font-semibold" : ""}`}>
                      {score ?? ""}
                    </td>
                  ))
                : null}
              {hasToPar ? <td className="px-3 py-3 tabular-nums">{row.toPar ?? ""}</td> : null}
              {pointsFirst ? null : <td className="px-3 py-3 font-semibold tabular-nums">{row.total ?? ""}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QualifyingBoard({ board }: { board: NonNullable<Extract<ResultSnapshot, { kind: "match" }>["qualifyingBoard"]> }) {
  return (
    <div className="mt-4">
      <h3 className="text-center font-serif text-2xl font-semibold">{board.label}</h3>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{board.label}</caption>
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
            <tr>
              <th className="px-3 py-3 font-semibold">Place</th>
              <th className="px-3 py-3 font-semibold">Player</th>
              {Array.from({ length: board.roundCount }, (_, index) => (
                <th key={index} className="px-3 py-3 font-semibold">R{index + 1}</th>
              ))}
              <th className="px-3 py-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {board.rows.map((row) => (
              <tr key={row.name} className="border-b border-zinc-100">
                <td className="px-3 py-3 font-semibold">{row.place}</td>
                <td className="px-3 py-3">
                  <span className="font-semibold">{row.name}</span>
                  {row.hometown ? <span className="mt-1 block text-xs text-zinc-500">{row.hometown}</span> : null}
                </td>
                {row.rounds.slice(0, board.roundCount).map((score, index) => (
                  <td key={index} className="px-3 py-3 tabular-nums">{score ?? ""}</td>
                ))}
                <td className="px-3 py-3 font-semibold tabular-nums">{row.total ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatchTable({ snapshot }: { snapshot: Extract<ResultSnapshot, { kind: "match" }> }) {
  return (
    <div>
      <h2 className="text-center font-serif text-3xl font-semibold">{snapshot.qualifyingBoard ? "Match play" : scopeLabel(snapshot)}</h2>
      <p className="mt-2 text-center text-sm text-zinc-600">Recorded format: Match play</p>
      {snapshot.qualifyingBoard ? (
        <QualifyingBoard board={snapshot.qualifyingBoard} />
      ) : snapshot.qualifying ? (
        <p className="mt-4 text-center text-sm font-semibold">Qualifying medalist: {snapshot.qualifying.medalist}</p>
      ) : null}
      <ul className="mx-auto mt-4 max-w-2xl space-y-2 text-sm">
        {snapshot.matches.map((match) => (
          <li key={`${match.flight}-${match.round}-${match.result}`} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {match.flight} · {match.round}
            </p>
            <p className="mt-1 text-center font-semibold">{match.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamTable({ snapshot }: { snapshot: Extract<ResultSnapshot, { kind: "team-match" }> }) {
  return (
    <div>
      <h2 className="text-center font-serif text-3xl font-semibold">{scopeLabel(snapshot)}</h2>
      <div className="mx-auto mt-4 max-w-xl overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Session scores</caption>
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
            <tr>
              <th className="px-3 py-3 text-center font-semibold">Session</th>
              <th className="px-3 py-3 text-center font-semibold">East</th>
              <th className="px-3 py-3 text-center font-semibold">West</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.sessions.map((session) => (
              <tr key={session.session} className="border-b border-zinc-100">
                <td className="px-3 py-3 text-center">{session.session}</td>
                <td className="px-3 py-3 text-center font-semibold tabular-nums">{session.east}</td>
                <td className="px-3 py-3 text-center font-semibold tabular-nums">{session.west}</td>
              </tr>
            ))}
            <tr>
              <td className="px-3 py-3 text-center font-semibold">{snapshot.cumulative.label}</td>
              <td className="px-3 py-3 text-center font-semibold tabular-nums">{snapshot.cumulative.east}</td>
              <td className="px-3 py-3 text-center font-semibold tabular-nums">{snapshot.cumulative.west}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="mt-8 text-center font-serif text-2xl font-semibold">Friday four-ball</h3>
      <ul className="mx-auto mt-4 max-w-2xl space-y-2 text-sm">
        {snapshot.matches.map((match) => (
          <li key={match.result} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-center">
            {match.result}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FieldPanel({ snapshot, names }: { snapshot: ResultSnapshot | null; names: string[] }) {
  if (snapshot?.kind === "stroke" && snapshot.divisions && snapshot.divisions.length === 1) {
    const item = snapshot.divisions[0];
    return (
      <div>
        <h2 className="text-center font-serif text-3xl font-semibold">{item.label}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[...item.rows].sort((a, b) => a.name.localeCompare(b.name)).map((player) => (
            <li key={player.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">
              {player.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (snapshot?.kind === "stroke" && snapshot.divisions && snapshot.divisions.length > 1) {
    const primary = new Set(snapshot.divisions[0].rows.map((row) => row.name));
    const separate = snapshot.divisions.slice(1).some((item) => item.rows.some((row) => !primary.has(row.name)));
    if (separate) {
      return (
        <div>
          <h2 className="text-center font-serif text-3xl font-semibold">Field</h2>
          {snapshot.divisions.map((item) => (
            <section key={item.label} className="mt-6">
              <h3 className="text-center font-serif text-2xl font-semibold">{item.label}</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[...item.rows].sort((a, b) => a.name.localeCompare(b.name)).map((player) => (
                  <li key={`${item.label}-${player.name}`} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">
                    {player.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      );
    }
  }
  if (snapshot?.kind === "stroke" && (snapshot.scope === "official-final" || snapshot.scope === "official-overall" || snapshot.scope === "official-partial" || snapshot.scope === "official-totals" || snapshot.scope === "official-points")) {
    const players = [...snapshot.rows]
      .flatMap((row) => (row.players?.length ? row.players.map((name) => ({ name, hometown: undefined as string | undefined })) : [{ name: row.name, hometown: row.hometown }]))
      .sort((a, b) => a.name.localeCompare(b.name));
    return (
      <div>
        <h2 className="text-center font-serif text-3xl font-semibold">Field</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-600">Tournament field, listed alphabetically.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {players.map((player) => (
            <li key={player.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm">
              <span className="font-semibold">{player.name}</span>
              {player.hometown ? <span className="mt-1 block text-xs text-zinc-500">{player.hometown}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (snapshot?.kind === "stroke" && snapshot.scope === "official-award") {
    return (
      <div>
        <h2 className="text-center font-serif text-3xl font-semibold">Low Senior award</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {snapshot.rows.map((player) => (
            <li key={player.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm">
              <span className="font-semibold">{player.name}</span>
              {player.hometown ? <span className="mt-1 block text-xs text-zinc-500">{player.hometown}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (snapshot?.kind === "match" && snapshot.qualifyingBoard?.rows.length) {
    const players = [...snapshot.qualifyingBoard.rows].sort((a, b) => a.name.localeCompare(b.name));
    return (
      <div data-field-panel>
        <h2 className="text-center font-serif text-3xl font-semibold">Field</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-600">Tournament field, listed alphabetically.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {players.map((player) => (
            <li key={player.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">
              {player.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (names.length === 0) {
    return (
      <div className="text-center">
        <h2 className="font-serif text-3xl font-semibold">Field</h2>
        <p className="mt-3 text-sm text-zinc-600">Field unavailable here</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-center font-serif text-3xl font-semibold">Named players</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {names.map((name) => (
          <li key={name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventPanel({
  tournament,
  standing,
  snapshot,
}: {
  tournament: Tournament;
  standing: ReturnType<typeof classifyCalendar>;
  snapshot: ResultSnapshot | null;
}) {
  const divisionFacts =
    snapshot?.kind === "stroke"
      ? (snapshot.divisions ?? []).flatMap((division) => [
          division.par != null ? { label: `${division.label} par`, value: String(division.par) } : null,
          division.yardage != null ? { label: `${division.label} yardage`, value: `${division.yardage.toLocaleString()} yards` } : null,
        ]).filter((fact): fact is { label: string; value: string } => Boolean(fact))
      : [];
  const facts = [
    tournament.course ? { label: "Course", value: tournament.course } : null,
    tournament.location ? { label: "Location", value: tournament.location } : null,
    tournament.courseTeeName ? { label: "Tee", value: tournament.courseTeeName } : null,
    divisionFacts.some((fact) => fact.label.endsWith(" par")) ? null : tournament.coursePar ? { label: "Par", value: String(tournament.coursePar) } : null,
    divisionFacts.some((fact) => fact.label.endsWith(" yardage")) ? null : tournament.courseYardage ? { label: "Yardage", value: `${tournament.courseYardage.toLocaleString()} yards` } : null,
    tournament.courseRating ? { label: "Rating", value: String(tournament.courseRating) } : null,
    tournament.courseSlope ? { label: "Slope", value: String(tournament.courseSlope) } : null,
    tournament.courseDesigner ? { label: "Designer", value: tournament.courseDesigner } : null,
    tournament.courseYear ? { label: "Opened", value: String(tournament.courseYear) } : null,
    ...divisionFacts,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const latest = [...(tournament.pastResults ?? [])].sort((a, b) => b.year - a.year)[0];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <h2 className="font-serif text-2xl font-semibold">{tournament.course ?? tournament.name}</h2>
        {latest ? <p className="mt-2 text-sm text-zinc-600">{championLabel(latest.year, 2026, standing)}: {latest.champion}</p> : null}
        {facts.length > 0 ? (
          <dl data-event-facts className="mt-4 space-y-3 text-sm text-zinc-700">
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
