import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { FourBallBoard } from "../src/components/hubs/FourBallBoard";
import { EWING_SNAPSHOT, hasTimezoneOffset, verifyEwingSnapshot } from "../src/data/hubs/ewing-cup-four-ball";
import { notPostedRound, standings, totalCell, type FourBallScore, type FourBallTeam } from "../src/data/hubs/four-ball";

function score(partial: Partial<FourBallScore> & Pick<FourBallScore, "total">): FourBallScore {
  return {
    rounds: partial.rounds ?? [notPostedRound(), notPostedRound(), notPostedRound()],
    total: partial.total,
    toPar: partial.toPar ?? null,
    thru: partial.thru ?? null,
  };
}

const fixture: FourBallTeam[] = [
  {
    id: "fixture-a",
    division: "mid-am",
    divisionLabel: "Mid-Amateur",
    names: ["Fixture Alpha", "Fixture Bravo"],
    score: score({
      total: 140,
      rounds: [
        { strokes: 68, status: "complete" },
        { strokes: 72, status: "complete" },
        notPostedRound(),
      ],
      thru: "36",
    }),
  },
  {
    id: "fixture-b",
    division: "mid-am",
    divisionLabel: "Mid-Amateur",
    names: ["Fixture Charlie", "Fixture Delta"],
    score: score({
      total: 140,
      rounds: [
        { strokes: 70, status: "complete" },
        { strokes: 70, status: "complete" },
        notPostedRound(),
      ],
      thru: "36",
    }),
  },
  {
    id: "fixture-c",
    division: "senior",
    divisionLabel: "Senior",
    names: ["Fixture Echo", "Fixture Foxtrot"],
    score: score({
      total: null,
      rounds: [
        { strokes: 35, status: "incomplete" },
        notPostedRound(),
        notPostedRound(),
      ],
      thru: "9",
    }),
  },
];

const rows = standings(fixture);
const tied = rows.filter((row) => row.position === "T1");
if (tied.length !== 2) throw new Error(`Expected two teams tied for first, got ${tied.map((row) => row.position).join(",")}`);
const incomplete = rows.find((row) => row.id === "fixture-c");
if (!incomplete || incomplete.position != null) throw new Error("Incomplete team with no total was ranked");
if (totalCell(incomplete.score) !== "") throw new Error("Missing total was rendered as a number");
if (incomplete.score?.rounds[0].strokes !== 35) throw new Error("Incomplete strokes were dropped");
if (incomplete.score.rounds[1].strokes != null) throw new Error("Unplayed round was filled");

const html = renderToStaticMarkup(createElement(FourBallBoard, { rows }));
for (const needle of ["Fixture Alpha", "Fixture Echo", "140", "T1", "35", "Not posted"]) {
  if (!html.includes(needle)) throw new Error(`Fixture board missing ${needle}`);
}
if (html.includes(">0<")) throw new Error("Fixture board printed a fabricated zero");

verifyEwingSnapshot();
if (!hasTimezoneOffset("2026-11-13T18:00:00-05:00")) throw new Error("DST offset -05:00 was rejected");
if (!hasTimezoneOffset("2026-11-07T19:04:00-06:00")) throw new Error("Standard offset -06:00 was rejected");
if (hasTimezoneOffset("2026-11-07T19:04:00")) throw new Error("Missing offset was accepted");
if (EWING_SNAPSHOT.teams.some((team) => team.score != null)) throw new Error("Live Ewing teams include a score");
if (html.includes("Fixture Alpha") && EWING_SNAPSHOT.teams.some((team) => team.names.includes("Fixture Alpha"))) {
  throw new Error("Fixture names leaked into the live snapshot");
}

console.log("four-ball tests ok");
