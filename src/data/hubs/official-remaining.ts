import data from "@/data/hubs/official/remaining-2026.public.json";
import juniorBatch from "@/data/hubs/official/junior-batch-2026.json";
import seniorBatch from "@/data/hubs/official/senior-batch-2026.json";
import seniorBatch2 from "@/data/hubs/official/senior-batch-2-2026.json";
import westernWomen from "@/data/hubs/official/womens-western-2026.json";
import type { MatchSnapshot, StrokeFinisher, StrokeSnapshot } from "@/data/hubs/batch1-results";

type PublicRow = {
  position: string;
  name: string;
  players?: string[];
  affiliation: string;
  toPar: string;
  rounds: string[];
  total: string;
  status: StrokeFinisher["status"];
};

type PublicDivision = { label: string; par?: number; yardage?: number; rows: PublicRow[] };

type PublicBoard = {
  slug: string;
  roundCount: number;
  scope: StrokeSnapshot["scope"];
  scoring?: StrokeSnapshot["scoring"];
  columnOrder?: StrokeSnapshot["columnOrder"];
  complete?: boolean;
  stageLabel?: string;
  rows?: PublicRow[];
  divisions?: PublicDivision[];
};

/** A PDF page header must never survive into a player name, country, or score token. */
const PAGE_HEADER = /Pos\s+Name|\bTo par\b|\bR1\b|\bR2\b|\bR3\b|\bTotal\b|RESULT LIST|\bPrinted\b|Page\s+\d|June\s+2026|European Golf/i;

function rejectPageHeader(value: string, where: string) {
  if (PAGE_HEADER.test(value)) throw new Error(`${where} contains a page header`);
}

/** Official pages sometimes store an apostrophe as &#39;. Keep that ASCII apostrophe. */
function decodeOfficialText(value: string): string {
  return value
    .replace(/&#39;|&#x27;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&amp;/gi, "&")
    .trim();
}

function displayRow(row: PublicRow, roundCount: number): StrokeFinisher {
  const position = decodeOfficialText(row.position);
  const name = decodeOfficialText(row.name);
  const affiliation = decodeOfficialText(row.affiliation);
  const toPar = decodeOfficialText(row.toPar);
  const total = decodeOfficialText(row.total);
  const players = row.players?.map((player) => decodeOfficialText(player));
  const sourceRounds = row.rounds.map((round) => decodeOfficialText(round));
  for (const [label, value] of [
    ["place", position],
    ["name", name],
    ["country", affiliation],
    ["toPar", toPar],
    ["total", total],
    ...(players ?? []).map((player, index) => [`player ${index + 1}`, player] as const),
    ...sourceRounds.map((round, index) => [`round ${index + 1}`, round] as const),
  ]) {
    rejectPageHeader(value, `${name} ${label}`);
  }
  const rounds: Array<number | string | null> = sourceRounds.map((value) => {
    if (value === "") return null;
    return /^\d+$/.test(value) ? Number(value) : value;
  });
  while (rounds.length < roundCount) rounds.push(null);
  return {
    place: position,
    name,
    players,
    hometown: affiliation || undefined,
    toPar: toPar || undefined,
    rounds,
    total: /^\d+$/.test(total) ? Number(total) : total,
    status: row.status,
  };
}

export function officialRemainingSnapshot(slug: string): StrokeSnapshot | null {
  const board = ([...data.boards, ...juniorBatch.boards, ...seniorBatch.boards, ...seniorBatch2.boards] as PublicBoard[]).find((item) => item.slug === slug);
  if (!board) return null;
  const divisions = board.divisions?.map((division) => ({
    label: division.label,
    par: division.par,
    yardage: division.yardage,
    rows: division.rows.map((row) => displayRow(row, board.roundCount)),
  }));
  const sourceRows = divisions?.[0]?.rows ?? (board.rows ?? []).map((row) => displayRow(row, board.roundCount));
  return {
    kind: "stroke",
    complete: board.complete !== false,
    scope: board.scope,
    scoring: board.scoring,
    columnOrder: board.columnOrder,
    roundCount: board.roundCount,
    stageLabel: board.stageLabel,
    rows: sourceRows,
    divisions,
    sources: [{ record: "official-board" }],
  };
}

export function womensWesternSnapshot(): MatchSnapshot | null {
  const qualifyingRows = (westernWomen.qualifying.rows as PublicRow[]).map((row) => displayRow(row, westernWomen.qualifying.roundCount));
  return {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: { medalist: qualifyingRows[0]?.name ?? "" },
    qualifyingBoard: {
      label: westernWomen.qualifying.label,
      roundCount: westernWomen.qualifying.roundCount,
      rows: qualifyingRows,
    },
    matches: westernWomen.matches,
    sources: [{ record: "official-board" }],
  };
}
