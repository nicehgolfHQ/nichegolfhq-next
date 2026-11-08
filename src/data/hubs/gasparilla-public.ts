import board from "@/data/hubs/gasparilla-2026.public.json";
import type { ResultSource, StrokeFinisher, StrokeSnapshot } from "@/data/hubs/batch1-results";

/** Public rows only. Source URLs, hashes, and aggregate ids stay out of the client bundle. */

const ROUND_COUNT = 3;

type PublicRow = {
  position: string;
  name: string;
  affiliation: string;
  toPar: string;
  rounds: string[];
  total: string;
  status: "ranked" | "CUT" | "WD" | "DQ";
};

const sources: ResultSource[] = [{ record: "official-board" }];

export function gasparillaDisplayRow(row: PublicRow): StrokeFinisher {
  const rounds: Array<number | string | null> = row.rounds.map((value) => (/^\d+$/.test(value) ? Number(value) : value));
  while (rounds.length < ROUND_COUNT) rounds.push(null);
  return {
    place: row.position,
    name: row.name,
    hometown: row.affiliation,
    toPar: row.toPar,
    rounds,
    total: /^\d+$/.test(row.total) ? Number(row.total) : row.total,
    status: row.status,
  };
}

export function gasparillaMainSnapshot(): StrokeSnapshot {
  return {
    kind: "stroke",
    complete: true,
    scope: "official-overall",
    roundCount: ROUND_COUNT,
    rows: (board.main.rows as PublicRow[]).map(gasparillaDisplayRow),
    sources,
  };
}

export function gasparillaSeniorSnapshot(): StrokeSnapshot {
  return {
    kind: "stroke",
    complete: false,
    scope: "official-award",
    roundCount: ROUND_COUNT,
    rows: (board.senior.rows as PublicRow[]).map(gasparillaDisplayRow),
    sources,
  };
}
