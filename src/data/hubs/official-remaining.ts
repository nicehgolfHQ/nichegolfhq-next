import data from "@/data/hubs/official/remaining-2026.public.json";
import type { StrokeFinisher, StrokeSnapshot } from "@/data/hubs/batch1-results";

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

type PublicBoard = {
  slug: string;
  roundCount: number;
  scope: StrokeSnapshot["scope"];
  scoring?: StrokeSnapshot["scoring"];
  columnOrder?: StrokeSnapshot["columnOrder"];
  complete?: boolean;
  rows: PublicRow[];
};

function displayRow(row: PublicRow, roundCount: number): StrokeFinisher {
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
  return {
    kind: "stroke",
    complete: board.complete !== false,
    scope: board.scope,
    scoring: board.scoring,
    columnOrder: board.columnOrder,
    roundCount: board.roundCount,
    rows: board.rows.map((row) => displayRow(row, board.roundCount)),
    sources: [{ record: "official-board" }],
  };
}
