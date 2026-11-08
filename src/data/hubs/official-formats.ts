import boards from "@/data/hubs/official/format-batch.public.json";
import matches from "@/data/hubs/official/format-batch.matches.json";
import type { MatchSnapshot, ResultSnapshot, StrokeFinisher, StrokeSnapshot } from "@/data/hubs/batch1-results";

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
  complete?: boolean;
  rows: PublicRow[];
};

type MatchRecord = { flight: string; round: string; players: string[]; result: string };

function displayRow(row: PublicRow, roundCount: number): StrokeFinisher {
  const rounds: Array<number | string | null> = row.rounds.map((value) => {
    if (value === "") return null;
    return /^\d+$/.test(value) ? Number(value) : value;
  });
  while (roundCount > 0 && rounds.length < roundCount) rounds.push(null);
  return {
    place: row.position,
    name: row.name,
    players: row.players,
    hometown: row.affiliation || undefined,
    toPar: row.toPar,
    rounds,
    total: /^\d+$/.test(row.total) ? Number(row.total) : row.total,
    status: row.status,
  };
}

export function officialFormatSnapshot(slug: string): ResultSnapshot | null {
  const board = (boards.boards as PublicBoard[]).find((item) => item.slug === slug);
  if (board) {
    return {
      kind: "stroke",
      complete: board.complete !== false && board.scope !== "official-totals",
      scope: board.scope,
      roundCount: board.roundCount,
      rows: board.rows.map((row) => displayRow(row, board.roundCount)),
      sources: [{ record: "official-board" }],
    };
  }
  const matchRows = (matches as Record<string, MatchRecord[]>)[slug];
  if (!matchRows) return null;
  const snapshot: MatchSnapshot = {
    kind: "match",
    formatConfidence: "string-only",
    complete: false,
    qualifying: null,
    matches: matchRows.map((match) => ({
      flight: match.flight,
      round: match.round,
      result: match.result,
      players: match.players,
    })),
    sources: [{ record: "official-board" }],
  };
  return snapshot;
}
