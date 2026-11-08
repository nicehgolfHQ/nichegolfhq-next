import board from "@/data/hubs/gasparilla-2026.json";
import publicBoard from "@/data/hubs/gasparilla-2026.public.json";
import { gasparillaMainSnapshot } from "@/data/hubs/gasparilla-public";

/**
 * Official final boards for the 71st Gasparilla Invitational.
 * Public Golf Genius pages for rounds 1, 2, and 3 return this same cumulative board.
 * A missing round is null. A status token such as WD stays a status, and it is not zero.
 * The senior board is an award filter. Those players are already in the main field.
 * Provenance fields stay on the data. The hub renders the Chicago retrieval time only.
 */

const ROUND_COUNT = 3;
const OFFICIAL_URL = "https://pcgc-71stgasparillainvitational.golfgenius.com/pages/11889495109525324281";

export type GasparillaStatus = "ranked" | "CUT" | "WD" | "DQ";

export type GasparillaSourceRow = {
  position: string;
  name: string;
  affiliation: string;
  toPar: string;
  rounds: string[];
  total: string;
  status: GasparillaStatus;
  sourceAggregateId: string;
  sourcePlayerURL: string;
};

export type GasparillaBoard = {
  competition: "main" | "senior";
  divisionLabel: string;
  roundIndex: number;
  sourceURL: string;
  rawSHA256: string;
  rowCount: number;
  statusCounts: Record<string, number>;
  rows: GasparillaSourceRow[];
};

export const GASPARILLA_OFFICIAL_RESULTS_URL = OFFICIAL_URL;
export const GASPARILLA_RETRIEVED_AT = board.retrievedAtAmericaChicago;
export const GASPARILLA_UPDATED_LABEL = "Updated Nov 8, 2026, 8:55 a.m. CT";

export function gasparillaBoards(): { main: GasparillaBoard; senior: GasparillaBoard } {
  return { main: board.main as GasparillaBoard, senior: board.senior as GasparillaBoard };
}

function displayedRounds(rounds: string[]): string {
  const cells = rounds.map((value) => (/^\d+$/.test(value) ? String(Number(value)) : value));
  while (cells.length < ROUND_COUNT) cells.push("");
  return cells.join(",");
}

export function assertGasparillaBoard(): void {
  if (board.officialResultsURL !== OFFICIAL_URL) throw new Error("Official Gasparilla link changed");
  if (board.retrievedAtAmericaChicago !== "2026-11-08T08:55:00.101979-06:00") {
    throw new Error("Gasparilla retrieval time changed");
  }
  if (board.timezone !== "America/Chicago") throw new Error("Gasparilla timezone changed");
  const { main, senior } = gasparillaBoards();
  if (main.roundIndex !== 3 || senior.roundIndex !== 3) throw new Error("Canonical board is not the final round index");
  expectCounts(main, 144, { ranked: 72, CUT: 68, WD: 3, DQ: 1 });
  expectCounts(senior, 24, { ranked: 6, CUT: 16, WD: 2 });
  const mainByName = new Map<string, GasparillaSourceRow>();
  for (const row of main.rows) {
    if (mainByName.has(row.name)) throw new Error(`Duplicate main name ${row.name}`);
    mainByName.set(row.name, row);
    checkRow(row, 70);
  }
  for (const row of senior.rows) {
    checkRow(row, 70);
    const mainRow = mainByName.get(row.name);
    if (!mainRow) throw new Error(`Senior award player is not in the tournament field: ${row.name}`);
    if (JSON.stringify(mainRow.rounds) !== JSON.stringify(row.rounds) || mainRow.total !== row.total || mainRow.toPar !== row.toPar || mainRow.status !== row.status) {
      throw new Error(`Senior award scores differ from the tournament row: ${row.name}`);
    }
    if (mainRow.sourceAggregateId === row.sourceAggregateId) {
      throw new Error(`Senior award row reused the tournament aggregate id: ${row.name}`);
    }
  }
  checkTies(main.rows);
  checkTies(senior.rows);
  const publicText = JSON.stringify(publicBoard);
  if (publicText.includes("sourcePlayerURL") || publicText.includes("sourceAggregateId") || publicText.includes("rawSHA256")) {
    throw new Error("Public Gasparilla board includes provenance");
  }
  for (const [key, source] of [["main", main], ["senior", senior]] as const) {
    const published = publicBoard[key].rows;
    if (published.length !== source.rows.length) throw new Error(`Public ${key} board dropped rows`);
    published.forEach((row, index) => {
      const official = source.rows[index];
      if (!official || row.name !== official.name || row.position !== official.position || row.total !== official.total || row.toPar !== official.toPar || row.status !== official.status || JSON.stringify(row.rounds) !== JSON.stringify(official.rounds)) {
        throw new Error(`Public ${key} row ${index} does not match the official board`);
      }
    });
  }
  const display = gasparillaMainSnapshot();
  if (!display.complete || display.rows.length !== 144 || display.award?.rows.length !== 24) {
    throw new Error("Display snapshot dropped rows");
  }
  const hayes = display.rows[0];
  if (hayes?.name !== "Hayes Brown" || hayes.place !== "1" || hayes.total !== 208 || hayes.rounds.join(",") !== "67,73,68") {
    throw new Error("Hayes Brown final card changed");
  }
  const peyton = display.rows.find((row) => row.name === "Peyton White");
  if (!peyton || peyton.rounds.join(",") !== "72,70,67" || peyton.total !== 209) {
    throw new Error("Peyton White still has the recap subset");
  }
  const awardLeader = display.award?.rows[0];
  const mainFrazier = display.rows.find((row) => row.name === "Jeff Frazier");
  if (awardLeader?.name !== "Jeff Frazier" || awardLeader.place !== "1" || awardLeader.total !== 220) {
    throw new Error("Low Senior award leader changed");
  }
  if (!mainFrazier || mainFrazier.place === "1") throw new Error("Senior award place was collapsed into the tournament place");
  const wd = display.rows.find((row) => row.name === "Mike Finster");
  if (!wd || wd.status !== "WD" || wd.total !== "WD" || wd.toPar !== "-" || displayedRounds(["75", "WD"]) !== wd.rounds.map((value) => value ?? "").join(",")) {
    throw new Error("WD status was converted");
  }
  const dq = display.rows.find((row) => row.name === "Jamie Miller");
  if (!dq || dq.status !== "DQ" || dq.total !== "DQ" || dq.rounds.join(",") !== "81,DQ,") {
    throw new Error("DQ status was converted");
  }
  if (display.rows.some((row) => row.rounds.includes(0) || row.total === 0)) throw new Error("A blank round was stored as zero");
}

function expectCounts(boardFile: GasparillaBoard, count: number, statuses: Record<string, number>) {
  if (boardFile.rowCount !== count || boardFile.rows.length !== count) {
    throw new Error(`${boardFile.competition} row count is ${boardFile.rows.length}`);
  }
  const seen: Record<string, number> = {};
  for (const row of boardFile.rows) seen[row.status] = (seen[row.status] ?? 0) + 1;
  for (const [status, expected] of Object.entries(statuses)) {
    if (seen[status] !== expected || boardFile.statusCounts[status] !== expected) {
      throw new Error(`${boardFile.competition} ${status} count is ${seen[status]}`);
    }
  }
}

function checkRow(row: GasparillaSourceRow, par: number) {
  if (!row.name || !row.sourceAggregateId || !row.sourcePlayerURL) throw new Error(`Missing provenance for ${row.name}`);
  const numeric = row.rounds.filter((value) => /^\d+$/.test(value)).map(Number);
  if (row.status === "ranked" || row.status === "CUT") {
    if (numeric.length !== row.rounds.length) throw new Error(`${row.name} has a status token in a finishing round`);
    const sum = numeric.reduce((total, score) => total + score, 0);
    if (String(sum) !== row.total) throw new Error(`${row.name} rounds do not add up`);
    const diff = sum - par * numeric.length;
    const toPar = diff === 0 ? "E" : diff > 0 ? `+${diff}` : String(diff);
    if (toPar !== row.toPar) throw new Error(`${row.name} to-par is ${row.toPar}, expected ${toPar}`);
    if (row.status === "ranked" && numeric.length !== 3) throw new Error(`${row.name} finished without three rounds`);
    if (row.status === "CUT" && numeric.length !== 2) throw new Error(`${row.name} cut card has the wrong round count`);
  } else {
    if (row.total !== row.status || row.position !== row.status || row.toPar !== "-") {
      throw new Error(`${row.name} status was rewritten`);
    }
    if (numeric.length !== 1 || row.rounds.length !== 2 || row.rounds[1] !== row.status) {
      throw new Error(`${row.name} withdrawal card was rewritten`);
    }
  }
}

function checkTies(rows: GasparillaSourceRow[]) {
  const groups = new Map<string, GasparillaSourceRow[]>();
  for (const row of rows.filter((item) => item.status === "ranked")) {
    const group = groups.get(row.position) ?? [];
    group.push(row);
    groups.set(row.position, group);
  }
  for (const [place, group] of groups) {
    const tied = place.startsWith("T");
    if (tied && group.length < 2) throw new Error(`${place} is marked tied with one player`);
    if (!tied && group.length !== 1) throw new Error(`${place} has ${group.length} players without a tie mark`);
    if (new Set(group.map((row) => row.total)).size !== 1 || new Set(group.map((row) => row.toPar)).size !== 1) {
      throw new Error(`${place} ties do not share a total`);
    }
  }
}
