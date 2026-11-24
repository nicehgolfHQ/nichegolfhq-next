"use client";

import { useState } from "react";
import { teeTimeLabel, type AjgaLeaderboard, type AjgaLeaderboardRow } from "@/lib/ajgaLeaderboard";

const PREVIEW_ROWS = 10;

/** "3:42 PM CT". Event-local time keeps the stamp honest for readers in any zone. */
function updatedLabel(iso: string, timeZone: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(date);
  const zone = new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone }).format(date);
  return `${day}, ${time}${zone ? ` ${zone.replace(/^C[SD]T$/, "CT").replace(/^E[SD]T$/, "ET")}` : ""}`;
}

function underPar(value: string) {
  return /^-\d/.test(value);
}

function ScoreToPar({ value, strong }: { value: string; strong?: boolean }) {
  return (
    <span className={`tabular-nums ${strong ? "font-semibold" : ""} ${underPar(value) ? "text-emerald-800" : "text-zinc-900"}`}>
      {value}
    </span>
  );
}

function LivePill({ final = false }: { final?: boolean }) {
  if (final) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
        Final
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      Live
    </span>
  );
}

function DivisionToggle({
  labels,
  active,
  onChange,
}: {
  labels: string[];
  active: number;
  onChange: (index: number) => void;
}) {
  if (labels.length < 2) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Division">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          aria-pressed={active === index}
          onClick={() => onChange(index)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
            active === index ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SourceLink({ board, label = `Full leaderboard on ${board.source ?? "AJGA"}` }: { board: AjgaLeaderboard; label?: string }) {
  return (
    <a
      href={board.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
    >
      {label}
      <span aria-hidden>&rarr;</span>
    </a>
  );
}

function LeaderboardTable({ rows, roundLabels, caption }: { rows: AjgaLeaderboardRow[]; roundLabels: string[]; caption: string }) {
  return (
    <div
      tabIndex={0}
      aria-label={caption}
      className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
    >
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            <th className="px-3 py-3 font-semibold">Pos</th>
            <th className="px-3 py-3 font-semibold">Player</th>
            <th className="px-3 py-3 font-semibold">To par</th>
            <th className="px-3 py-3 font-semibold">Thru</th>
            <th className="px-3 py-3 font-semibold">Today</th>
            {roundLabels.map((label) => (
              <th key={label} className="px-3 py-3 font-semibold">{label}</th>
            ))}
            <th className="px-3 py-3 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.pos}-${row.name}-${index}`} className="border-b border-zinc-100 last:border-b-0">
              <td className="px-3 py-3 font-semibold tabular-nums">{row.pos}</td>
              <td className="px-3 py-3">
                <span className="font-semibold">{row.name}</span>
                {row.hometown ? <span className="mt-1 block text-xs text-zinc-500">{row.hometown}</span> : null}
              </td>
              <td className="px-3 py-3"><ScoreToPar value={row.toPar} strong /></td>
              {row.teeTime ? (
                <td colSpan={2} className="whitespace-nowrap px-3 py-3 text-center text-zinc-500">
                  {teeTimeLabel(row.teeTime)}
                </td>
              ) : (
                <>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-zinc-600">{row.thru}</td>
                  <td className="px-3 py-3"><ScoreToPar value={row.today} /></td>
                </>
              )}
              {row.rounds.map((score, roundIndex) => (
                <td key={roundIndex} className="px-3 py-3 tabular-nums">{score ?? ""}</td>
              ))}
              <td className="px-3 py-3 font-semibold tabular-nums">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Scoring tab: the full live board, by division. */
export function LiveLeaderboard({
  board,
  timeZone,
  final = false,
}: {
  board: AjgaLeaderboard;
  timeZone: string;
  /** The event is over: label the board Final and drop the refresh wording. */
  final?: boolean;
}) {
  const [division, setDivision] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const active = board.divisions[division] ?? board.divisions[0];
  const rows = expanded ? active.rows : active.rows.slice(0, PREVIEW_ROWS);
  const updated = updatedLabel(board.fetchedAt, timeZone);

  return (
    <section aria-labelledby="live-leaderboard-heading">
      <div className="text-center">
        <LivePill final={final} />
        <h2 id="live-leaderboard-heading" className="mt-3 font-serif text-3xl font-semibold">Leaderboard</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600">
          {final ? (
            <>Final results from {board.source ?? "the AJGA"}.</>
          ) : (
            <>
              {updated ? `Updated ${updated}. ` : ""}Scores from {board.source ?? "the AJGA"}. Refreshes every few minutes.
            </>
          )}
        </p>
      </div>

      <div className="mt-5">
        <DivisionToggle
          labels={board.divisions.map((item) => item.label)}
          active={division}
          onChange={(index) => {
            setDivision(index);
            setExpanded(false);
          }}
        />
      </div>

      <div className="mt-4">
        <LeaderboardTable rows={rows} roundLabels={active.roundLabels} caption={`${active.label} leaderboard`} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {active.rows.length > PREVIEW_ROWS ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            {expanded ? `Show top ${PREVIEW_ROWS}` : `Show all ${active.rows.length} ${active.label.toLowerCase()}`}
          </button>
        ) : null}
        <SourceLink board={board} />
      </div>
    </section>
  );
}

/** Overview tab: the top of each division, with a jump to the full board. */
export function LiveLeadersCard({
  board,
  timeZone,
  onViewAll,
  final = false,
}: {
  board: AjgaLeaderboard;
  timeZone: string;
  onViewAll: () => void;
  final?: boolean;
}) {
  const updated = updatedLabel(board.fetchedAt, timeZone);
  return (
    <section aria-labelledby="live-leaders-heading" className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LivePill final={final} />
          <h2 id="live-leaders-heading" className="font-serif text-xl font-semibold">Leaders</h2>
        </div>
        {updated && !final ? <p className="text-xs text-zinc-500">Updated {updated}</p> : null}
      </div>
      <div className={`mt-4 grid gap-4 ${board.divisions.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {board.divisions.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">{item.label}</p>
            <ol className="mt-2 divide-y divide-zinc-100">
              {item.rows.slice(0, 5).map((row, index) => (
                <li key={`${row.pos}-${row.name}-${index}`} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-8 shrink-0 font-semibold tabular-nums text-zinc-500">{row.pos}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{row.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-zinc-500">{row.teeTime ? teeTimeLabel(row.teeTime) : row.thru}</span>
                  <span className="w-9 shrink-0 text-right"><ScoreToPar value={row.toPar} strong /></span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
        >
          Full leaderboard
        </button>
        <SourceLink board={board} label={`${board.source ?? "AJGA"} scoring`} />
      </div>
    </section>
  );
}
