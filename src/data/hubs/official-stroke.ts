import data from "@/data/hubs/official/stroke-batch.public.json";
import type { StrokeFinisher, StrokeSnapshot } from "@/data/hubs/batch1-results";

/**
 * Public rows for verified 2026 mid-am stroke boards.
 * Provenance stays in official/stroke-batch.provenance.json and is not imported here.
 */

type PublicRow = {
  position: string;
  name: string;
  affiliation: string;
  toPar: string;
  rounds: string[];
  total: string;
  status: StrokeFinisher["status"];
};

type PublicBoard = {
  slug: string;
  divisionLabel: string;
  roundCount: number;
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
    hometown: row.affiliation || undefined,
    toPar: row.toPar,
    rounds,
    total: /^\d+$/.test(row.total) ? Number(row.total) : row.total,
    status: row.status,
  };
}

export function officialStrokeSnapshot(slug: string): StrokeSnapshot | null {
  const board = (data.boards as PublicBoard[]).find((item) => item.slug === slug);
  if (!board) return null;
  return {
    kind: "stroke",
    complete: true,
    scope: "official-final",
    roundCount: board.roundCount,
    rows: board.rows.map((row) => displayRow(row, board.roundCount)),
    sources: [{ record: "official-board" }],
  };
}
