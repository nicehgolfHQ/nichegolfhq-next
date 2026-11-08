import data from "@/data/hubs/official/remaining-2026.public.json";
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
  rows?: PublicRow[];
  divisions?: PublicDivision[];
};

/** A PDF page header must never survive into a player name, country, or score token. */
const PAGE_HEADER = /Pos\s+Name|\bTo par\b|\bR1\b|\bR2\b|\bR3\b|\bTotal\b|RESULT LIST|\bPrinted\b|Page\s+\d|June\s+2026|European Golf/i;

function rejectPageHeader(value: string, where: string) {
  if (PAGE_HEADER.test(value)) throw new Error(`${where} contains a page header`);
}

function displayRow(row: PublicRow, roundCount: number): StrokeFinisher {
  for (const [label, value] of [
    ["place", row.position],
    ["name", row.name],
    ["country", row.affiliation],
    ["toPar", row.toPar],
    ["total", row.total],
    ...(row.players ?? []).map((player, index) => [`player ${index + 1}`, player] as const),
    ...row.rounds.map((round, index) => [`round ${index + 1}`, round] as const),
  ]) {
    rejectPageHeader(value, `${row.name} ${label}`);
  }
  const rounds: Array<number | string | null> = row.rounds.map((value) => {
    if (value === "") return null;
    return /^\d+$/.test(value) ? Number(value) : value;
  });
  while (rounds.length < roundCount) rounds.push(null);
  return {
    place: row.position,
    name: row.name,
    players: row.players,
    hometown: row.affiliation || undefined,
    toPar: row.toPar || undefined,
    rounds,
    total: /^\d+$/.test(row.total) ? Number(row.total) : row.total,
    status: row.status,
  };
}

export function officialRemainingSnapshot(slug: string): StrokeSnapshot | null {
  const board = (data.boards as PublicBoard[]).find((item) => item.slug === slug);
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
