import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FourBallBoard } from "../src/components/hubs/FourBallBoard";
import { EWING_SNAPSHOT, hasTimezoneOffset, verifyEwingSnapshot } from "../src/data/hubs/ewing-cup-four-ball";
import {
  auditScore,
  notPostedRound,
  progressKey,
  standings,
  totalCell,
  type FourBallScore,
  type FourBallTeam,
} from "../src/data/hubs/four-ball";

function score(partial: Partial<FourBallScore> & Pick<FourBallScore, "total">): FourBallScore {
  return {
    rounds: partial.rounds ?? [notPostedRound(), notPostedRound(), notPostedRound()],
    total: partial.total,
    toPar: partial.toPar ?? null,
    thru: partial.thru ?? null,
    officialPosition: partial.officialPosition ?? null,
  };
}

function team(id: string, division: FourBallTeam["division"], names: [string, string], value: FourBallScore | null): FourBallTeam {
  return { id, division, divisionLabel: division === "mid-am" ? "Mid-Amateur" : "Senior", names, score: value };
}

const twoRounds = (first: number, second: number, total: number): FourBallScore =>
  score({
    total,
    rounds: [
      { strokes: first, status: "complete" },
      { strokes: second, status: "complete" },
      notPostedRound(),
    ],
  });

const fixture: FourBallTeam[] = [
  team("fixture-a", "mid-am", ["Fixture Alpha", "Fixture Bravo"], twoRounds(68, 72, 140)),
  team("fixture-b", "mid-am", ["Fixture Charlie", "Fixture Delta"], twoRounds(70, 70, 140)),
  team("fixture-c", "senior", ["Fixture Echo", "Fixture Foxtrot"], score({
    total: null,
    rounds: [{ strokes: 35, status: "incomplete" }, notPostedRound(), notPostedRound()],
    thru: "9",
  })),
  team("fixture-d", "senior", ["Fixture Golf", "Fixture Hotel"], twoRounds(65, 65, 130)),
  team("fixture-e", "mid-am", ["Fixture India", "Fixture Juliet"], score({
    total: 70,
    rounds: [{ strokes: 70, status: "complete" }, notPostedRound(), notPostedRound()],
  })),
];

const rows = standings(fixture);
const order = rows.map((row) => row.id);
if (order.indexOf("fixture-a") > order.indexOf("fixture-d")) throw new Error("All view ranked a senior team ahead of the mid-am group");
const midPlaces = rows.filter((row) => row.division === "mid-am" && row.position === "T1");
if (midPlaces.length !== 2) throw new Error("Mid-am tie was not ranked inside the division");
const seniorLeader = rows.find((row) => row.id === "fixture-d");
if (seniorLeader?.position !== "1") throw new Error("Senior leader was ranked against Mid-Am");
const shortRound = rows.find((row) => row.id === "fixture-e");
if (shortRound?.position != null || shortRound?.rankNote !== "in_progress") throw new Error("Unequal completed rounds were ranked");
const incomplete = rows.find((row) => row.id === "fixture-c");
if (!incomplete || incomplete.position != null || incomplete.rankNote !== "in_progress") throw new Error("Incomplete team was ranked");
if (totalCell(incomplete.score) !== "") throw new Error("Missing total was rendered as a number");

const html = renderToStaticMarkup(createElement(FourBallBoard, { rows }));
for (const needle of ["Fixture Alpha", "Fixture Echo", "140", "T1", "35", "Not posted", "In progress"]) {
  if (!html.includes(needle)) throw new Error(`Fixture board missing ${needle}`);
}
if (html.includes(">0<")) throw new Error("Fixture board printed a fabricated zero");

const official = standings([
  team("off-a", "mid-am", ["Official One", "Official Two"], score({ ...twoRounds(70, 70, 140), officialPosition: "T4" })),
]);
if (official[0]?.position !== "T4" || official[0].rankNote !== "official") throw new Error("Official place was recomputed");

const mixed = standings([
  team("mix-official", "mid-am", ["Mix Official", "Mix Partner"], score({ ...twoRounds(70, 70, 140), officialPosition: "T4" })),
  team("mix-derived", "mid-am", ["Mix Derived", "Mix Other"], twoRounds(68, 68, 136)),
]);
const mixedOfficial = mixed.find((row) => row.id === "mix-official");
const mixedDerived = mixed.find((row) => row.id === "mix-derived");
if (mixedOfficial?.position !== "T4" || mixedOfficial.rankNote !== "official") throw new Error("Mixed board recomputed the official place");
if (mixedDerived?.position != null) throw new Error("Mixed board derived a place beside an official place");

const nineOfRoundOne = score({
  total: 40,
  thru: "9",
  rounds: [{ strokes: 40, status: "incomplete" }, notPostedRound(), notPostedRound()],
});
const nineOfRoundTwo = score({
  total: 110,
  thru: "9",
  rounds: [
    { strokes: 70, status: "complete" },
    { strokes: 40, status: "incomplete" },
    notPostedRound(),
  ],
});
if (progressKey(nineOfRoundOne) !== "partial:0:0:9") throw new Error(`Round 1 thru 9 key was ${progressKey(nineOfRoundOne)}`);
if (progressKey(nineOfRoundTwo) !== "partial:1:1:9") throw new Error(`Round 2 thru 9 key was ${progressKey(nineOfRoundTwo)}`);
if (progressKey(nineOfRoundOne) === progressKey(nineOfRoundTwo)) throw new Error("Nine holes of different rounds compared as one key");
const splitRounds = standings([
  team("thru-r1", "mid-am", ["Thru Round One", "Partner One"], nineOfRoundOne),
  team("thru-r2", "mid-am", ["Thru Round Two", "Partner Two"], nineOfRoundTwo),
]);
if (splitRounds.find((row) => row.id === "thru-r1")?.position != null) throw new Error("Round 1 thru 9 was ranked with round 2 thru 9");
if (splitRounds.find((row) => row.id === "thru-r2")?.position !== "1") throw new Error("The further round was not the only ranked card");

const pars = [72, 72, null];
const padded = auditScore(score({
  total: 140,
  thru: "18",
  rounds: [{ strokes: 70, status: "incomplete" }, notPostedRound(), notPostedRound()],
}), pars);
if (!padded.some((problem) => problem.includes("partial total"))) throw new Error("A partial total that pads a missing round was accepted");
const good = auditScore(twoRounds(70, 72, 142), pars);
if (good.length) throw new Error(`Valid total failed: ${good.join("; ")}`);
const bad = auditScore(twoRounds(70, 72, 150), pars);
if (!bad.some((problem) => problem.includes("does not match"))) throw new Error("Mismatched total was accepted");
const partial = auditScore(score({
  total: 35,
  rounds: [{ strokes: 35, status: "incomplete" }, notPostedRound(), notPostedRound()],
}), pars);
if (!partial.some((problem) => problem.includes("thru"))) throw new Error("Partial total without thru was accepted");
const toPar = auditScore({ ...twoRounds(70, 72, 142), toPar: -2 }, pars);
if (toPar.length) throw new Error(`Supported to-par failed: ${toPar.join("; ")}`);
const unsupported = auditScore({ ...twoRounds(70, 72, 142), toPar: -2 }, [null, 72, null]);
if (!unsupported.some((problem) => problem.includes("to-par"))) throw new Error("To-par without Blue par was accepted");

verifyEwingSnapshot();
if (!hasTimezoneOffset("2026-11-13T18:00:00-05:00")) throw new Error("DST offset -05:00 was rejected");
if (!hasTimezoneOffset("2026-11-07T19:04:00-06:00")) throw new Error("Standard offset -06:00 was rejected");
if (hasTimezoneOffset("2026-11-07T19:04:00")) throw new Error("Missing offset was accepted");
if (EWING_SNAPSHOT.leaderboardStatus === "source_pending" && EWING_SNAPSHOT.teams.some((team) => team.score != null)) {
  throw new Error("Pre-event snapshot includes a score");
}
if (EWING_SNAPSHOT.teams.some((team) => team.names.includes("Fixture Alpha"))) throw new Error("Fixture names leaked into the live snapshot");

const midAm = EWING_SNAPSHOT.teams.filter((team) => team.division === "mid-am");
if (midAm.length !== 32) throw new Error(`Expected 32 mid-am teams, got ${midAm.length}`);
for (const team of midAm) {
  const score = team.score;
  if (!score || score.rounds[0]?.status !== "complete" || score.rounds[0].strokes == null) {
    throw new Error(`${team.names.join(" + ")} is missing a completed round 1`);
  }
  if (score.rounds[1]?.status !== "not_posted" || score.rounds[1].strokes != null) {
    throw new Error(`${team.names.join(" + ")} has a posted round 2 before that round was played`);
  }
  if (score.rounds[2]?.status !== "not_posted" || score.rounds[2].strokes != null) {
    throw new Error(`${team.names.join(" + ")} has a posted final round before that round was played`);
  }
  if (score.total !== score.rounds[0].strokes) throw new Error(`${team.names.join(" + ")} total does not match round 1`);
}
const midAmBoard = standings(midAm, "mid-am");
if (midAmBoard[0]?.names.join(" + ") !== "Robbie Keyes + Michael Sass") throw new Error("Round 1 leader was not first");
if (midAmBoard[0]?.position !== "1" || midAmBoard[0].rankNote !== "official") throw new Error("Round 1 leader place was not official");
if (midAmBoard.some((row) => row.rankNote !== "official" || !row.position)) throw new Error("A mid-am team was missing its official place");
if (midAmBoard.at(-1)?.names.join(" + ") !== "Marcus Jones + Tate Oakley" || midAmBoard.at(-1)?.position !== "32") {
  throw new Error("Round 1 last place was not 32nd");
}
if (midAmBoard.map((row) => row.position).join(",") !== "1,2,T3,T3,5,T6,T6,T6,T9,T9,T9,T9,T9,T14,T14,T14,T14,T18,T18,T18,T18,T18,T23,T23,T23,T26,T26,28,T29,T29,T29,32") {
  throw new Error("Round 1 official place order changed");
}
if (midAmBoard[5]?.names.join(" + ") !== "Jonathan Keane + Andrew Grice") throw new Error("T6 official order should start with Keane and Grice");

const senior = EWING_SNAPSHOT.teams.filter((team) => team.division === "senior");
if (senior.length !== 20) throw new Error(`Expected 20 senior teams, got ${senior.length}`);
for (const team of senior) {
  const score = team.score;
  if (!score || score.rounds[0]?.status !== "complete" || score.rounds[0].strokes == null) {
    throw new Error(`${team.names.join(" + ")} is missing a completed round 1`);
  }
  if (score.rounds[1]?.status !== "not_posted" || score.rounds[1].strokes != null) {
    throw new Error(`${team.names.join(" + ")} has a posted round 2 before that round was played`);
  }
  if (score.rounds[2]?.status !== "not_posted" || score.rounds[2].strokes != null) {
    throw new Error(`${team.names.join(" + ")} has a posted final round before that round was played`);
  }
  if (score.total !== score.rounds[0].strokes) throw new Error(`${team.names.join(" + ")} total does not match round 1`);
}
const seniorBoard = standings(senior, "senior");
if (seniorBoard[0]?.names.join(" + ") !== "Kirk Johnson + Tray Tyner") throw new Error("Senior round 1 leader was not first");
if (seniorBoard[0]?.position !== "1" || seniorBoard[0].rankNote !== "official") throw new Error("Senior round 1 leader place was not official");
if (seniorBoard.some((row) => row.rankNote !== "official" || !row.position)) throw new Error("A senior team was missing its official place");
if (seniorBoard.at(-1)?.names.join(" + ") !== "Mark Crisco + Rick Piersall" || seniorBoard.at(-1)?.position !== "20") {
  throw new Error("Senior round 1 last place was not 20th");
}
if (seniorBoard.map((row) => row.position).join(",") !== "1,T2,T2,T2,T5,T5,7,T8,T8,10,T11,T11,T13,T13,T13,T16,T16,T18,T18,20") {
  throw new Error("Senior round 1 official place order changed");
}
if (senior.some((team) => team.names.includes("Mike Felker"))) throw new Error("Mike Felker is still listed after the official substitution");

console.log("four-ball tests ok");
