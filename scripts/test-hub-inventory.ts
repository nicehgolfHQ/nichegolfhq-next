import { readFileSync } from "node:fs";
import { toTournament } from "../src/lib/tournaments/seniorTournament";
import { PLAYERS, PLAYER_APPEARANCES } from "../src/data/players/registry";
import { MIDAM_TOURNAMENTS } from "../src/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "../src/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "../src/lib/seniorMajors";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EwingCupHub } from "../src/components/hubs/EwingCupHub";
import { FormatHub } from "../src/components/hubs/FormatHub";
import { resultSnapshot, snapshotNames } from "../src/data/hubs/batch1-results";
import { assertGasparillaBoard, GASPARILLA_OFFICIAL_RESULTS_URL } from "../src/data/hubs/gasparilla-2026";
import { SOURCE_ACCESS } from "../src/data/hubs/source-access";
import dispute from "../src/data/hubs/official/farrell-final-dispute.json";
import { officialFormatSnapshot } from "../src/data/hubs/official-formats";
import { officialRemainingSnapshot, womensWesternSnapshot } from "../src/data/hubs/official-remaining";
import remainingAudit from "../src/data/hubs/official/remaining-2026.provenance.json";
import remainingBoards from "../src/data/hubs/official/remaining-2026.public.json";
import juniorBatch from "../src/data/hubs/official/junior-batch-2026.json";
import seniorBatch from "../src/data/hubs/official/senior-batch-2026.json";
import seniorBatch2 from "../src/data/hubs/official/senior-batch-2-2026.json";
import seniorBatch3 from "../src/data/hubs/official/senior-batch-3-2026.json";
import { officialStrokeSnapshot } from "../src/data/hubs/official-stroke";
import provenance from "../src/data/hubs/official/stroke-batch.provenance.json";
import provenance3 from "../src/data/hubs/official/stroke-batch-3.provenance.json";
import type { Tournament } from "../src/lib/tournaments/types";
import {
  HUB_BATCH_1,
  HUB_BATCH_2,
  HUB_BATCH_3,
  HUB_BATCH_4,
  HUB_BATCH_5,
  HUB_BATCH_6,
  HUB_BATCH_7,
  HUB_BATCH_8,
  HUB_BATCH_9,
  HUB_BATCH_10,
  HUB_BATCH_11,
  HUB_BATCH_12,
  HUB_BATCH_13,
  HUB_BATCH_14,
  HUB_BATCH_15,
  championLabel,
  classifyCalendar,
  classifyFormat,
  inventorySummary,
  isFormatHub,
  listHubInventory,
  strokeRoundCount,
} from "../src/data/hubs/inventory";

const items = listHubInventory();
const summary = inventorySummary(items);

if (summary.total !== MIDAM_TOURNAMENTS.length + JUNIOR_MAJOR_EVENTS_2026.length + SENIOR_MAJOR_EVENTS_2026.length) {
  throw new Error("Inventory dropped or duplicated a listed 2026 event");
}
if (summary.byChannel.midam !== MIDAM_TOURNAMENTS.length) throw new Error("Mid-am count drifted");
if (summary.byChannel.junior !== JUNIOR_MAJOR_EVENTS_2026.length) throw new Error("Junior count drifted");
if (summary.byChannel.senior !== SENIOR_MAJOR_EVENTS_2026.length) throw new Error("Senior count drifted");
if (summary.formatHub !== HUB_BATCH_1.length + HUB_BATCH_2.length + HUB_BATCH_3.length + HUB_BATCH_4.length + HUB_BATCH_5.length + HUB_BATCH_6.length + HUB_BATCH_7.length + HUB_BATCH_8.length + HUB_BATCH_9.length + HUB_BATCH_10.length + HUB_BATCH_11.length + HUB_BATCH_12.length + HUB_BATCH_13.length + HUB_BATCH_14.length + HUB_BATCH_15.length) {
  throw new Error("Format hub count drifted");
}
if (HUB_BATCH_2.length !== 18) throw new Error("Batch 2 size drifted");
if (summary.ewingDedicated !== 2) throw new Error("Ewing dedicated hubs drifted");
if (summary.legacy !== summary.total - summary.formatHub - summary.ewingDedicated) throw new Error("Legacy remainder drifted");

const slugs = new Set<string>();
for (const item of items) {
  const key = `${item.channel}:${item.slug}`;
  if (slugs.has(key)) throw new Error(`Duplicate inventory row ${key}`);
  slugs.add(key);
  if (!item.path.startsWith(`/${item.channel === "midam" ? "midamgolfhq" : item.channel === "junior" ? "juniorgolfhq" : "seniorgolfhq"}/`)) {
    throw new Error(`Path drifted for ${key}`);
  }
}

for (const event of [...MIDAM_TOURNAMENTS, ...JUNIOR_MAJOR_EVENTS_2026, ...SENIOR_MAJOR_EVENTS_2026]) {
  const row = items.find((item) => item.slug === event.slug && item.name === event.name);
  if (!row) throw new Error(`Missing inventory row for ${event.slug}`);
  const news = event.news ?? [];
  if (row.newsSlugs.length !== news.length) throw new Error(`News count drifted for ${event.slug}`);
  for (const article of news) {
    if (!row.newsSlugs.includes(article.slug)) throw new Error(`News slug ${article.slug} dropped from ${event.slug}`);
  }
}

for (const item of [...HUB_BATCH_1, ...HUB_BATCH_2]) {
  if (!isFormatHub(item.channel, item.slug)) throw new Error(`${item.slug} is not on the format hub`);
  const row = items.find((entry) => entry.channel === item.channel && entry.slug === item.slug);
  if (!row) throw new Error(`Batch slug missing ${item.slug}`);
  if (row.template !== "format-hub") throw new Error(`${item.slug} template drifted`);
}

if (isFormatHub("midam", "ewing-cup-four-ball") || isFormatHub("senior", "ewing-cup-four-ball")) {
  throw new Error("Ewing was pulled onto the generic format hub");
}
if (isFormatHub("midam", "john-t-lupton-memorial")) throw new Error("Rescheduled Lupton was migrated as stroke");
for (const item of HUB_BATCH_2) {
  const row = items.find((entry) => entry.channel === item.channel && entry.slug === item.slug);
  if (row?.formatKind !== "stroke") throw new Error(`${item.slug} is not straightforward stroke`);
  if (row.calendar === "rescheduled-out" || row.calendar === "unknown") throw new Error(`${item.slug} is not a 2026 playing`);
}

const expectedKind: Record<string, string> = {
  "gasparilla-invitational": "stroke",
  "walter-j-travis-invitational": "match",
  "east-vs-west-matches": "team-match",
  "junior-orange-bowl": "stroke",
  "society-of-seniors-spring-classic": "stroke",
};
for (const [slug, kind] of Object.entries(expectedKind)) {
  const row = items.find((item) => item.slug === slug);
  if (row?.formatKind !== kind) throw new Error(`${slug} classified as ${row?.formatKind}, expected ${kind}`);
}

if (classifyFormat("Match play better ball") !== "four-ball-match") throw new Error("Anderson-style format misclassified");
if (classifyFormat("4-ball") !== "four-ball") throw new Error("4-ball format misclassified");
if (classifyFormat("54 holes stroke play") !== "stroke") throw new Error("Stroke format misclassified");
if (strokeRoundCount("54 holes stroke play", "stroke") !== 3) throw new Error("54 holes was not 3 rounds");
if (strokeRoundCount("72-hole stroke play, no cut", "stroke") !== 4) throw new Error("72 holes was not 4 rounds");
if (strokeRoundCount("Match play", "match") !== 0) throw new Error("Match play invented stroke rounds");
if (strokeRoundCount("Team match play", "team-match") !== 0) throw new Error("Team match invented stroke rounds");

if (classifyCalendar({ dates2026: "Rescheduled – 2027" }) !== "rescheduled-out") throw new Error("A 2027 reschedule was kept in 2026");
if (classifyCalendar({ startDate: "2026-02-19", endDate: "2026-02-21" }, "2026-11-08") !== "played-in-2026") {
  throw new Error("A February finish was not played");
}
if (classifyCalendar({ startDate: "2026-11-13", endDate: "2026-11-15" }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("A later November start was treated as played");
}
if (classifyCalendar({ startDate: "2026-11-06", endDate: "2026-11-08", liveStatus: "completed" }, "2026-11-08") !== "played-in-2026") {
  throw new Error("A completed event on its last day stayed in progress");
}
if (classifyCalendar({ startDate: "2026-11-06", endDate: "2026-11-08", liveStatus: "live" }, "2026-11-08") !== "in-progress-2026") {
  throw new Error("A live event on its last day was marked played");
}
if (classifyCalendar({}) !== "unknown") throw new Error("A blank date was classified");
const lupton = items.find((item) => item.slug === "john-t-lupton-memorial");
const gasparilla = items.find((item) => item.slug === "gasparilla-invitational");
if (lupton?.calendar !== "rescheduled-out") throw new Error(`Lupton calendar is ${lupton?.calendar}`);
if (gasparilla?.calendar !== "played-in-2026") throw new Error(`Gasparilla calendar is ${gasparilla?.calendar}`);
if (summary.calendar.rescheduledOut < 1 || summary.calendar.rescheduledOut >= summary.total) {
  throw new Error("Rescheduled count is not a real subset");
}
if (championLabel(2026, 2026, "played-in-2026") !== "2026 champion") throw new Error("Completed edition winner was called defending");
if (championLabel(2025, 2026, "scheduled-2026") !== "Defending champion") throw new Error("Prior winner was not defending");

for (const slug of ["junior-orange-bowl", "society-of-seniors-spring-classic", "walter-j-travis-invitational", "east-vs-west-matches"]) {
  const snapshot = resultSnapshot(slug);
  if (!snapshot) throw new Error(`${slug} has no sourced snapshot`);
  if (snapshot.complete) throw new Error(`${slug} snapshot claims a complete field`);
  if (snapshot.sources.length === 0) throw new Error(`${slug} snapshot has no source`);
}
assertGasparillaBoard();
const travis = resultSnapshot("walter-j-travis-invitational");
if (travis?.kind !== "match" || travis.formatConfidence !== "string-only" || !travis.qualifying) {
  throw new Error("Travis snapshot does not keep qualifying separate from the format string");
}
const couture = travis.matches.filter((match) => match.result.startsWith("Rob Couture def."));
if (couture.filter((match) => match.round === "Quarterfinal").length !== 1) throw new Error("Couture has more than one quarterfinal");
if (!couture.some((match) => match.round === "Round of 16" && match.result.includes("Saladino"))) {
  throw new Error("Couture vs Saladino is not the opening match");
}
if (!couture.some((match) => match.round === "Quarterfinal" && match.result.includes("Abbondandolo"))) {
  throw new Error("Couture vs Abbondandolo lost its stated quarterfinal");
}
const hunter = travis.matches.filter((match) => match.result.startsWith("John Hunter def."));
if (hunter.some((match) => match.round === "Quarterfinal")) throw new Error("Hunter was given a quarterfinal the source did not name");
if (!hunter.some((match) => match.round === "Round of 16" && match.result.includes("Parziale"))) {
  throw new Error("Hunter vs Parziale is not the opening match");
}
if (!hunter.some((match) => match.round === "Saturday" && match.result.includes("Deraney"))) {
  throw new Error("Hunter vs Deraney was given a stage the source did not name");
}

const east = resultSnapshot("east-vs-west-matches");
if (east?.kind !== "team-match") throw new Error("East vs West snapshot missing");
const eastNames = east.kind === "team-match" ? snapshotNames(east) : [];
if (eastNames.some((name) => /\band\b/i.test(name))) throw new Error("A pairing was stored as one player");
const sposaMatch = east.kind === "team-match" ? east.matches.find((match) => match.result.startsWith("Mike Sposa and Todd White")) : undefined;
if (sposaMatch?.players.join("|") !== "Mike Sposa|Todd White|Bryan Hoops|Trae Cassell") throw new Error("Friday partners were not stored as separate players");
for (const senior of ["Mike Sposa", "Todd White", "Doug Hanzel", "Bob Royak", "Mike McCoy", "Gene Elliott", "Bryan Hoops", "Jason Pridmore"]) {
  if (eastNames.includes(senior)) throw new Error(`${senior} was listed in the mid-am field`);
}
if (!eastNames.includes("Scott Harvey") || !eastNames.includes("Andrew Bailey") || !eastNames.includes("Parker Edens")) {
  throw new Error("Mid-am singles players were dropped from the field");
}

function renderHub(tournament: Tournament, channel: "midam" | "junior" | "senior") {
  return renderToStaticMarkup(createElement(FormatHub, { tournament, channel }));
}

const sosHtml = renderHub(
  {
    slug: "society-of-seniors-spring-classic",
    name: "Society of Seniors: Spring Classic",
    channel: "senior",
    month: 2,
    startDate: "2026-02-09",
    endDate: "2026-02-11",
    pastResults: [{ year: 2026, champion: "William Mallon" }],
  },
  "senior",
);
if (!sosHtml.includes("William Mallon")) throw new Error("Champion-only snapshot did not render");
if (!sosHtml.includes("Selected results")) throw new Error("Partial stroke scope label missing");
if (sosHtml.includes(">Round 1<")) throw new Error("Champion-only snapshot rendered a round control");

const orangeHtml = renderHub(
  {
    slug: "junior-orange-bowl",
    name: "Junior Orange Bowl",
    channel: "junior",
    month: 1,
    startDate: "2026-01-03",
    endDate: "2026-01-06",
  },
  "junior",
);
if (!orangeHtml.includes("Selected results")) throw new Error("Orange Bowl partial board has no scope label");
if (!orangeHtml.includes("Tomas Restrepo")) throw new Error("Orange Bowl finisher missing");

const travisHtml = renderHub(
  {
    slug: "walter-j-travis-invitational",
    name: "The Walter J. Travis Invitational",
    channel: "midam",
    month: 5,
    format: "Match play",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
  },
  "midam",
);
if (!travisHtml.includes("Selected matches")) throw new Error("Travis partial matches have no scope label");
const saladinoCard = travisHtml.slice(Math.max(0, travisHtml.indexOf("Joe Saladino") - 240), travisHtml.indexOf("Joe Saladino") + 20);
if (!saladinoCard.includes("Round of 16") || saladinoCard.includes("Quarterfinal")) {
  throw new Error("Saladino was not rendered as the opening match");
}
const deraneyCard = travisHtml.slice(Math.max(0, travisHtml.indexOf("Joseph Deraney") - 240), travisHtml.indexOf("Joseph Deraney") + 20);
if (deraneyCard.includes("Quarterfinal") || !deraneyCard.includes("Saturday")) {
  throw new Error("Deraney was given a quarterfinal label");
}

const eastHtml = renderHub(
  {
    slug: "east-vs-west-matches",
    name: "East vs West Matches",
    channel: "midam",
    month: 11,
    liveStatus: "live",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
  },
  "midam",
);
if (eastHtml.includes(">Mike Sposa</li>") || eastHtml.includes(">Doug Hanzel</li>")) throw new Error("A senior was rendered in the mid-am field");
if (!eastHtml.includes(">Scott Harvey</li>") || !eastHtml.includes(">Andrew Bailey</li>")) throw new Error("Mid-am singles were not rendered as separate players");
if (!eastHtml.includes("Mike Sposa and Todd White def. Bryan Hoops and Trae Cassell, 5 and 3")) throw new Error("Friday four-ball result was dropped");
if (!eastHtml.includes("Final, all divisions") || !eastHtml.includes("19.50") || !eastHtml.includes("25.50") || !eastHtml.includes("Sunday singles, all divisions") || !eastHtml.includes("7.50")) {
  throw new Error("East vs West final was not shown as the all-division total");
}
if (!eastHtml.includes("Sunday singles, mid-amateur") || !eastHtml.includes("Bobby Massa def. Scott Harvey, 7 and 6") || eastHtml.includes("Mike McCoy def.")) {
  throw new Error("Mid-am singles were mixed with the senior singles");
}

const championOnly = renderHub(
  {
    slug: "the-stocker-cup",
    name: "The Stocker Cup",
    channel: "midam",
    month: 3,
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    pastResults: [{ year: 2026, champion: "Brett Patterson" }],
  },
  "midam",
);
if (!championOnly.includes("Brett Patterson")) throw new Error("Stored 2026 champion did not render");
if (!championOnly.includes("Selected results")) throw new Error("Champion-only board has no scope label");
if (championOnly.includes(">Round 1<")) throw new Error("Champion-only board rendered a round control");
if (championOnly.includes("No scores yet") || championOnly.includes("No players posted")) {
  throw new Error("Finished event implies nothing was posted");
}

const nitHtml = renderHub(
  {
    slug: "national-invitational-tournament",
    name: "National Invitational Tournament",
    channel: "midam",
    month: 11,
    liveStatus: "live",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    golfGeniusUrl: "https://idp.golfgenius.com/auth/sign_in?client_id=example",
    golfGeniusCode: "NIT2026",
  },
  "midam",
);
if (!nitHtml.includes("Live scoring · NIT2026")) throw new Error("Golf Genius code was dropped");
if (!nitHtml.includes("idp.golfgenius.com")) throw new Error("Login-bound scoring URL was dropped");
if (!nitHtml.includes("Sam Jackson") || !nitHtml.includes(">138<")) throw new Error("NIT 36-hole leader did not render");
if (!nitHtml.includes("Hunter Hamrick") || !nitHtml.includes(">140<")) throw new Error("Hamrick total missing");
if (!nitHtml.includes("Jackson King") || !nitHtml.includes(">141<")) throw new Error("King total missing");
if (!nitHtml.includes("Alan Coshatt") || !nitHtml.includes("Ethan Hagood") || !nitHtml.includes("Hunter Hawkins")) {
  throw new Error("Tied fourth was dropped");
}
if (!nitHtml.includes("Through 36 holes") || !nitHtml.includes("Selected results")) throw new Error("NIT board looks final");
if (!nitHtml.includes("Round 2 recap")) throw new Error("Round 2 recap is not linked from scoring");
if (nitHtml.includes("2026 champion")) throw new Error("NIT leader was labeled the 2026 champion");

const nitWithDefending = renderHub(
  {
    slug: "national-invitational-tournament",
    name: "National Invitational Tournament",
    channel: "midam",
    month: 11,
    liveStatus: "live",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    pastResults: [{ year: 2025, champion: "Ryan Terry" }],
  },
  "midam",
);
if (!nitWithDefending.includes("Defending champion")) throw new Error("Ryan Terry is not labeled the defending champion");
if (!nitWithDefending.includes("Ryan Terry")) throw new Error("Ryan Terry dropped off the hub");

const sangerHtml = renderHub(
  {
    slug: "sanger-invitational",
    name: "Sanger Invitational",
    channel: "midam",
    month: 6,
    startDate: "2026-06-01",
    endDate: "2026-06-03",
  },
  "midam",
);
if (!sangerHtml.includes("Full results unavailable here.")) throw new Error("Sanger results tab is blank");
if (!sangerHtml.includes("Field unavailable here")) throw new Error("Sanger field tab is blank");
if (sangerHtml.includes("No scores yet") || sangerHtml.includes("No players posted") || sangerHtml.includes("golfgenius.com")) {
  throw new Error("Sanger implies an official empty board or a made-up link");
}

const gasparillaHtml = renderHub(
  {
    slug: "gasparilla-invitational",
    name: "Gasparilla Invitational",
    channel: "midam",
    month: 2,
    startDate: "2026-02-19",
    endDate: "2026-02-21",
    coursePar: 70,
    golfGeniusUrl: GASPARILLA_OFFICIAL_RESULTS_URL,
    pastResults: [{ year: 2026, champion: "Hayes Brown" }],
  },
  "midam",
);
const gasparillaBoard = resultSnapshot("gasparilla-invitational");
if (gasparillaBoard?.kind !== "stroke" || !gasparillaBoard.complete || gasparillaBoard.rows.length !== 144) {
  throw new Error("Gasparilla hub is not the full tournament board");
}
const gasparillaText = gasparillaHtml.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
for (const row of gasparillaBoard.rows) {
  if (!gasparillaText.includes(row.name)) throw new Error(`Missing tournament player ${row.name}`);
}
if (!gasparillaHtml.includes("Overall results")) throw new Error("Gasparilla overall board has no scope label");
if (gasparillaHtml.includes("Low Senior award") || gasparillaHtml.includes("Updated Nov 8, 2026") || gasparillaHtml.includes("Round buttons highlight")) {
  throw new Error("Mid-am Gasparilla hub shows the senior award or a public provenance note");
}
if (gasparillaBoard.scope !== "official-overall" || gasparillaBoard.award || gasparillaBoard.rows.length !== 144) {
  throw new Error("Overall board was reduced to a mid-am-only field");
}
if (!gasparillaHtml.includes(">Peyton White<") || !gasparillaHtml.includes(">209<") || !gasparillaHtml.includes(">72<")) {
  throw new Error("Peyton White recap subset is still on the board");
}
if (!gasparillaHtml.includes(">WD<") || !gasparillaHtml.includes(">DQ<") || !gasparillaHtml.includes(">CUT<")) {
  throw new Error("CUT, WD, or DQ status missing");
}
if (gasparillaHtml.includes("144 players") || gasparillaHtml.includes("24 players") || gasparillaHtml.includes("sourceAggregateId")) {
  throw new Error("Internal field count or provenance leaked");
}
if (gasparillaHtml.includes("/players/") || gasparillaHtml.includes("tournaments2/details")) {
  throw new Error("Unverified player profile or per-row source URL was rendered");
}
if (!gasparillaHtml.includes(GASPARILLA_OFFICIAL_RESULTS_URL)) throw new Error("Stored official link missing");
const frazierAt = gasparillaHtml.indexOf("Jeff Frazier");
const frazierCard = gasparillaHtml.slice(Math.max(0, frazierAt - 90), frazierAt);
if (frazierAt < 0 || frazierCard.includes(">1<")) throw new Error("Jeff Frazier overall place was replaced with the award place");

const seniorHtml = renderHub(
  {
    slug: "gasparilla-invitational-senior-division",
    name: "Gasparilla Invitational (Senior Division)",
    channel: "senior",
    month: 2,
    startDate: "2026-02-19",
    endDate: "2026-02-21",
    golfGeniusUrl: GASPARILLA_OFFICIAL_RESULTS_URL,
    pastResults: [{ year: 2026, champion: "Jeff Frazier" }],
  },
  "senior",
);
if (!seniorHtml.includes("Low Senior award") || !seniorHtml.includes("Jeff Frazier") || !seniorHtml.includes(">220<")) {
  throw new Error("Senior hub is missing the Low Senior award");
}
if (seniorHtml.includes("also in the tournament field") || seniorHtml.includes("Updated Nov 8, 2026") || seniorHtml.includes("Round buttons highlight") || seniorHtml.includes("Overall results")) {
  throw new Error("Senior hub explains the award or repeats the overall board");
}
if (seniorHtml.includes("144 players") || seniorHtml.includes("24 players")) throw new Error("Senior hub publishes a field count");
const seniorBoard = resultSnapshot("gasparilla-invitational-senior-division");
if (seniorBoard?.kind !== "stroke" || seniorBoard.complete || seniorBoard.rows.length !== 24) {
  throw new Error("Senior hub snapshot is not the award filter");
}

const audited = new Set(SOURCE_ACCESS.filter((item) => item.channel === "midam").map((item) => item.slug));
for (const event of MIDAM_TOURNAMENTS) {
  if (!audited.has(event.slug)) throw new Error(`No scoring audit for ${event.slug}`);
}
if (audited.size !== MIDAM_TOURNAMENTS.length) throw new Error("Mid-am scoring audit has an extra or duplicate slug");
const mounted = [
  "gasparilla-invitational",
  "giles-invitational",
  "the-jupiter-invitational",
  "the-huddleston-cup",
  "snedeker-memorial",
  "george-c-thomas-invitational",
  "trans-miss-mid-master-championship",
  "canadian-mens-mid-amateur",
  "the-berkeley-cup",
  "carlton-woods-invitational",
  "champions-cup-four-ball",
  "john-r-williams-four-ball",
  "the-valentine-invitational",
  "european-mens-mid-amateur",
  "the-picard-cup",
  "tree-farm-invitational",
];
for (const item of SOURCE_ACCESS.filter((entry) => entry.channel === "midam")) {
  const expectsFull = mounted.includes(item.slug);
  if (expectsFull !== (item.completeness === "full")) {
    throw new Error(`${item.slug} completeness is ${item.completeness}`);
  }
}

for (const board of provenance.boards) {
  const snapshot = officialStrokeSnapshot(board.slug);
  if (!snapshot || snapshot.rows.length !== board.rows.length || snapshot.complete !== board.mounted) {
    throw new Error(`${board.slug} public board does not match provenance`);
  }
  board.rows.forEach((row, index) => {
    const shown = snapshot.rows[index];
    const rounds = row.rounds.map((value) => (value === "" ? null : /^\d+$/.test(value) ? Number(value) : value));
    while (rounds.length < snapshot.roundCount) rounds.push(null);
    if (!shown || shown.name !== row.name || shown.place !== row.position || String(shown.total ?? "") !== row.total || shown.toPar !== row.toPar || shown.rounds.join(",") !== rounds.join(",")) {
      throw new Error(`${board.slug} row ${index} changed`);
    }
  });
  if (snapshot.rows.some((row) => /\band\b|\+/.test(row.name))) throw new Error(`${board.slug} stored a pairing as one player`);
}

const jupiter = officialStrokeSnapshot("the-jupiter-invitational");
const mitchell = jupiter?.rows.find((row) => row.name === "Matt Mitchell");
const jallos = jupiter?.rows.find((row) => row.name === "Nick Jallos");
if (!jupiter || jupiter.rows[0]?.name !== "Jon Weiss" || jupiter.rows[0]?.total !== 205 || mitchell?.total !== "DNF" || mitchell.rounds.join(",") !== "74,79,DNF") {
  throw new Error("Jupiter dropped Matt Mitchell's DNF round token");
}
if (jallos?.rounds.join(",") !== "77,85,") throw new Error("Nick Jallos was given a round token the source cell did not post");
let preservedTokens = 0;
for (const board of provenance.boards) {
  const snapshot = officialStrokeSnapshot(board.slug);
  if (!snapshot) throw new Error(`${board.slug} snapshot missing during token audit`);
  board.rows.forEach((row, index) => {
    row.rounds.forEach((value, round) => {
      if (value !== "" && !/^\d+$/.test(value)) {
        preservedTokens += 1;
        if (snapshot.rows[index]?.rounds[round] !== value) {
          throw new Error(`${board.slug} dropped ${row.name} round token ${value}`);
        }
      }
    });
  });
}
if (preservedTokens < 1) throw new Error("Non-numeric round token audit did not run");
const giles = officialStrokeSnapshot("giles-invitational");
if (giles?.rows[0]?.name !== "Brett Patterson" || giles.rows[0]?.total !== 209 || giles.rows.length !== 60) {
  throw new Error("Giles board leader changed");
}
const jupiterHtml = renderHub(
  {
    slug: "the-jupiter-invitational",
    name: "The Jupiter Invitational",
    channel: "midam",
    month: 5,
    startDate: "2026-05-06",
    endDate: "2026-05-08",
    pastResults: [{ year: 2026, champion: "Jon Weiss" }],
  },
  "midam",
);
if (!jupiterHtml.includes("Final results") || !jupiterHtml.includes("Jon Weiss") || !jupiterHtml.includes(">DNF<") || jupiterHtml.includes("51 players") || jupiterHtml.includes("Updated Nov 8, 2026") || jupiterHtml.includes("Round buttons highlight")) {
  throw new Error("Jupiter hub does not show the checked final board");
}
if (jupiterHtml.includes("Michael McCoy")) throw new Error("Jupiter senior division was added to the mid-am field");

const gct = officialStrokeSnapshot("george-c-thomas-invitational");
const price = gct?.rows[0];
if (!gct || gct.rows.length !== 34 || price?.name !== "Price, Andrew" || price.total !== 214 || price.toPar !== "+3") {
  throw new Error("George Thomas source to-par was recomputed");
}
const gctSenior = officialStrokeSnapshot("george-c-thomas-invitational-senior-division");
if (!gctSenior || gctSenior.rows.length !== 30 || gctSenior.rows[0]?.name !== "Hoops, Bryan" || gctSenior.rows[0]?.total !== 220) {
  throw new Error("George Thomas senior board is not on the senior hub snapshot");
}
if (gct.rows.some((row) => row.name === "Hoops, Bryan")) throw new Error("Senior division was mixed into the mid-am board");

const trans = officialStrokeSnapshot("trans-miss-mid-master-championship");
if (!trans?.divisions || trans.divisions[0]?.rows.length !== 24 || trans.divisions[1]?.rows.length !== 45) {
  throw new Error("Trans-Miss divisions were combined");
}
if (trans.divisions[0].rows[0]?.name !== "Terry, Ryan" || trans.divisions[1].rows[0]?.name !== "Grady, Pat") {
  throw new Error("Trans-Miss division leaders changed");
}
if (trans.divisions[1].rows.some((row) => trans.divisions?.[0].rows.some((other) => other.name === row.name))) {
  throw new Error("Trans-Miss divisions overlap");
}

const canada = officialStrokeSnapshot("canadian-mens-mid-amateur");
if (!canada?.divisions || canada.divisions[0]?.rows.length !== 156 || canada.divisions[1]?.rows.length !== 61) {
  throw new Error("Canadian boards were combined");
}
if (canada.divisions[0].rows[0]?.name !== "Garrett Rank" || canada.divisions[0].rows[0]?.total !== 270) {
  throw new Error("Canadian championship leader changed");
}
if (canada.divisions[1].rows[0]?.name !== "Rob Couture" || canada.divisions[1].rows[0]?.place !== "1") {
  throw new Error("Canadian Mid-Master place was collapsed into the championship place");
}
const coutureMain = canada.divisions[0].rows.find((row) => row.name === "Rob Couture");
if (coutureMain?.place === "1") throw new Error("Rob Couture championship place was replaced with the Mid-Master place");
if (!canada.divisions[1].rows.every((row) => canada.divisions?.[0].rows.some((other) => other.name === row.name))) {
  throw new Error("A Mid-Master player is missing from the championship board");
}

const berkeley = officialStrokeSnapshot("the-berkeley-cup");
const walton = berkeley?.rows.find((row) => row.name === "Christopher Walton");
const milewski = berkeley?.rows.find((row) => row.name === "Mike Milewski");
if (!berkeley || berkeley.scope !== "official-overall" || berkeley.rows.length !== 41 || berkeley.rows[0]?.name !== "Zach Healy") {
  throw new Error("Berkeley overall board changed");
}
if (walton?.rounds.join(",") !== "81,85,NC" || walton.total !== 166 || milewski?.rounds.join(",") !== "79,88,NS" || milewski.total !== 167) {
  throw new Error("Berkeley NC or NS token was dropped");
}
const carlton = officialStrokeSnapshot("carlton-woods-invitational");
const stewart = carlton?.rows[0];
if (!carlton || carlton.rows.length !== 66 || stewart?.name !== "Kade Stewart" || stewart.rounds.join(",") !== "67,71,68" || stewart.total !== 206) {
  throw new Error("Carlton mid-am board changed");
}
const carltonSenior = officialStrokeSnapshot("carlton-woods-senior-invitational");
if (!carltonSenior || carltonSenior.rows.length !== 33 || carltonSenior.rows[0]?.name !== "Edward Fryatt" || carltonSenior.rows[0]?.total !== 212) {
  throw new Error("Carlton senior board is not on the senior hub snapshot");
}
const barber = carlton.rows.find((row) => row.name === "Jack Barber");
if (barber?.rounds.join(",") !== "WD,,") throw new Error("Carlton WD round token was dropped");

const canadaHtml = renderHub({ slug: "canadian-mens-mid-amateur", name: "Canadian Men's Mid-Amateur", channel: "midam", month: 8 }, "midam");
const transHtml = renderHub({ slug: "trans-miss-mid-master-championship", name: "Trans-Miss", channel: "midam", month: 9 }, "midam");
const berkeleyHtml = renderHub({ slug: "the-berkeley-cup", name: "Berkeley Cup", channel: "midam", month: 10 }, "midam");
const gctHtml = renderHub({ slug: "george-c-thomas-invitational", name: "George C. Thomas", channel: "midam", month: 6 }, "midam");
if (!canadaHtml.includes('data-division="Championship"') || !canadaHtml.includes('data-division="Mid-Master"')) {
  throw new Error("Canadian divisions are not separate");
}
if (!transHtml.includes('data-division="Mid-Amateur"') || !transHtml.includes('data-division="Mid-Master"') || !transHtml.includes("Grady, Pat") || !transHtml.includes("Terry, Ryan")) {
  throw new Error("Trans-Miss Mid-Master was omitted");
}
if (berkeleyHtml.includes("Low Senior") || !berkeleyHtml.includes("Overall results") || !berkeleyHtml.includes(">NC<") || !berkeleyHtml.includes(">NS<")) {
  throw new Error("Berkeley senior award was shown on the mid-am hub, or NC/NS was dropped");
}
if (gctHtml.includes("Hoops, Bryan") || !gctHtml.includes("Price, Andrew") || !gctHtml.includes("+3")) {
  throw new Error("George Thomas mid-am board includes the senior division or lost the source to-par");
}
const champions = officialFormatSnapshot("champions-cup-four-ball");
const championsLead = champions?.kind === "stroke" ? champions.rows[0] : null;
if (!champions || champions.kind !== "stroke" || !champions.complete || champions.rows.length !== 54 || championsLead?.players?.join("|") !== "Gibbons, Josh|Stewart, Kade" || championsLead.total !== 263) {
  throw new Error("Champions Cup pairs were not stored as two players");
}
const jrw = officialFormatSnapshot("john-r-williams-four-ball");
const jrwSenior = officialFormatSnapshot("john-r-williams-four-ball-senior-division");
if (!jrw || jrw.kind !== "stroke" || jrw.rows.length !== 50 || !jrwSenior || jrwSenior.kind !== "stroke" || jrwSenior.rows.length !== 18) {
  throw new Error("John R. Williams team boards changed");
}
if (jrw.rows.some((row) => row.name.includes(" + ") || (row.players || []).some((player) => /\band\b/i.test(player)))) {
  throw new Error("A John R. Williams pairing was stored as one player");
}
const valentine = officialFormatSnapshot("the-valentine-invitational");
const collins = valentine?.kind === "stroke" ? valentine.rows[0] : null;
if (!valentine || valentine.kind !== "stroke" || valentine.rows.length !== 84 || collins?.rounds.join("|") !== "65 VSab|68 VMan|70 VSab" || collins.total !== 203) {
  throw new Error("Valentine course codes were rewritten");
}
const macdonald = officialFormatSnapshot("cb-macdonald-invitational-tournament");
if (!macdonald || macdonald.kind !== "stroke" || macdonald.complete || macdonald.scope !== "official-totals" || macdonald.rows.length !== 80 || macdonald.rows.some((row) => row.rounds.some((score) => score != null))) {
  throw new Error("Macdonald totals invented a round");
}
const anderson = officialFormatSnapshot("anderson-memorial-four-ball");
const andersonFinal = anderson?.kind === "match" ? anderson.matches.find((match) => match.round === "Finals") : null;
if (!anderson || anderson.kind !== "match" || anderson.complete || anderson.matches.length !== 15 || !andersonFinal?.result.includes("Costanza, Mark / Esteve , Jeronimo def.") || !andersonFinal.result.includes("3 & 2")) {
  throw new Error("Anderson final was marked complete or the winner changed");
}
const farrell = officialFormatSnapshot("the-farrell");
const farrellFinal = farrell?.kind === "match" ? farrell.matches.find((match) => match.flight === "Men's Mid-Amateur" && match.round === "Finals") : null;
if (!farrell || farrell.kind !== "match" || farrell.complete || farrell.matches.length !== 30 || farrellFinal?.result !== "David Kitt def. John Lazor") {
  throw new Error("Farrell final did not keep the winner without a margin");
}
if (farrellFinal.result.includes("4 & 3") || farrellFinal.result.includes("3 and 1")) {
  throw new Error("Farrell final published a disputed margin");
}
if (dispute.publicResult !== farrellFinal.result || dispute.claims.map((claim) => claim.margin).join("|") !== "4 & 3|3 and 1") {
  throw new Error("Farrell margin claims were not both preserved");
}
const farrellRecap = MIDAM_TOURNAMENTS.find((event) => event.slug === "the-farrell")?.news?.find((article) => article.slug === "2026-the-farrell-final-recap");
if (!farrellRecap?.content.some((paragraph) => paragraph.includes("3 and 1 victory over John Lazor"))) {
  throw new Error("Farrell recap was rewritten");
}
const farrellHtml = renderHub({ slug: "the-farrell", name: "The Farrell", channel: "midam", month: 10, format: "18 holes stroke play qualifying, match play" }, "midam");
if (!farrellHtml.includes("David Kitt def. John Lazor") || farrellHtml.includes("David Kitt def. John Lazor, 4") || farrellHtml.includes("David Kitt def. John Lazor, 3")) {
  throw new Error("Farrell page showed a disputed final margin");
}
if (farrell.matches.some((match) => match.flight.startsWith("Senior"))) throw new Error("Farrell senior matches were placed on the mid-am hub");
const macHtml = renderHub({ slug: "cb-macdonald-invitational-tournament", name: "C.B. Macdonald", channel: "midam", month: 6, format: "Match play" }, "midam");
const macSeniorHtml = renderHub({ slug: "cb-macdonald-invitational-senior-division", name: "C.B. Macdonald Senior", channel: "senior", month: 6, format: "Match play" }, "senior");
for (const html of [macHtml, macSeniorHtml]) {
  if (!html.includes("Qualifying totals") || html.includes(">Totals<") || html.includes(">R1<") || html.includes("Final results")) {
    throw new Error("Macdonald qualifying totals were mislabeled or given invented rounds");
  }
}

for (const html of [canadaHtml, transHtml, berkeleyHtml, gctHtml]) {
  if (html.includes("Updated Nov 8, 2026") || html.includes("Round buttons highlight")) {
    throw new Error("A public retrieval note was rendered");
  }
}
for (const board of provenance3.boards.filter((item) => item.mounted)) {
  const snapshot = officialStrokeSnapshot(board.slug);
  const rows = snapshot?.divisions?.find((item) => item.label === board.divisionLabel)?.rows ?? (!snapshot?.divisions ? snapshot?.rows : undefined);
  if (!rows || rows.length !== board.rows.length) throw new Error(`${board.slug} ${board.divisionLabel} row count drifted`);
  board.rows.forEach((row, index) => {
    row.rounds.forEach((value, round) => {
      if (value !== "" && !/^\d+$/.test(value) && rows[index]?.rounds[round] !== value) {
        throw new Error(`${board.slug} dropped ${row.name} token ${value}`);
      }
    });
  });
}

const european = officialRemainingSnapshot("european-mens-mid-amateur");
const tillement = european?.rows[0];
const jaakola = european?.rows[1];
const schoen = european?.rows.find((row) => row.name === "Schoen, Christopher");
const schaffrath = european?.rows.find((row) => row.name === "Schaffrath, Nikolai");
const stewartCountry = european?.rows.find((row) => row.name === "Stewart, David");
if (!european || !european.complete || european.rows.length !== 104 || tillement?.name !== "Tillement, Pierre" || tillement.rounds.join(",") !== "73,69,70" || tillement.total !== 212) {
  throw new Error("European men's board changed");
}
if (jaakola?.place !== "2" || jaakola.total !== 212 || european.rows.some((row) => row.name.includes("Stein") || row.name.includes("Oppenheimer"))) {
  throw new Error("European women's list or the +40 ranking was mixed into the men's board");
}
if (schoen?.status !== "MC" || schoen.place !== "MC" || schoen.rounds.join(",") !== "81,75," || schoen.total !== 156) {
  throw new Error("European MC row was rewritten");
}
if (schaffrath?.status !== "RTD" || schaffrath.toPar !== "+19" || schaffrath.rounds.join(",") !== "81,," || schaffrath.total !== 81) {
  throw new Error("European RTD row was rewritten");
}
if (stewartCountry?.hometown !== "United States") throw new Error("A wrapped European country was split");
const szmidt = european.rows.find((row) => row.name === "Szmidt, Jan");
const vanBiljon = european.rows.find((row) => row.name === "Van Biljon, Vincent");
if (szmidt?.hometown !== "Poland" || vanBiljon?.hometown !== "Netherlands") {
  throw new Error("A PDF page header stayed in a country cell");
}
const pageHeader = /Pos\s+Name|\bTo par\b|\bR1\b|\bR2\b|\bR3\b|\bTotal\b|RESULT LIST|\bPrinted\b|Page\s+\d|June\s+2026|European Golf/i;
const boardRows = (board: { rows?: { position: string; name: string; affiliation: string; toPar: string; total: string; rounds: string[]; players?: string[] }[]; divisions?: { rows: { position: string; name: string; affiliation: string; toPar: string; total: string; rounds: string[]; players?: string[] }[] }[] }) =>
  board.divisions?.flatMap((division) => division.rows) ?? board.rows ?? [];
const publishedRows = [...remainingBoards.boards, ...juniorBatch.boards, ...seniorBatch.boards, ...seniorBatch2.boards, ...seniorBatch3.boards].flatMap((board) => boardRows(board).map((row) => ({ slug: board.slug, row })));
if (publishedRows.length !== 1849) throw new Error("The published checked boards are no longer 1849 rows");
const batch2Rows = seniorBatch2.boards.flatMap((board) => boardRows(board));
const batch2Teams = batch2Rows.filter((row) => (row.players?.length ?? 0) > 1);
if (batch2Rows.length !== 637 || batch2Teams.length !== 31 || batch2Rows.length - batch2Teams.length !== 606) {
  throw new Error("The 637 checked rows are not 606 individual rows plus 31 team rows");
}
for (const { slug, row } of publishedRows) {
  const players = "players" in row ? row.players ?? [] : [];
  const tokens = [row.position, row.name, row.affiliation, row.toPar, row.total, ...row.rounds, ...players];
  for (const token of tokens) {
    if (pageHeader.test(token)) throw new Error(`${slug} ${row.name} kept a page header in ${token}`);
  }
}
const europeanHtml = renderHub({ slug: "european-mens-mid-amateur", name: "European Mid-Amateur", channel: "midam", month: 6, format: "54 holes stroke play" }, "midam");
if (europeanHtml.includes("Pos Name") || europeanHtml.includes("To par R1") || !europeanHtml.includes("Poland") || !europeanHtml.includes("Netherlands")) {
  throw new Error("The European page rendered a PDF header in a country");
}
if (!remainingAudit["european-mens-mid-amateur"].withheld.includes("Ladies result list")) {
  throw new Error("European withheld lists were dropped");
}

const picard = officialRemainingSnapshot("the-picard-cup");
const wyatt = picard?.rows[0];
const robillard = picard?.rows[1];
if (!picard || picard.rows.length !== 36 || wyatt?.players?.join("|") !== "Bobby Wyatt|Vince Cave" || wyatt.rounds.join(",") !== "65,71,64" || wyatt.total !== 200 || wyatt.place !== "T1") {
  throw new Error("Picard mid-am teams changed");
}
if (robillard?.place !== "T1" || robillard.total !== 200 || picard.rows.some((row) => row.players?.some((player) => player === "Todd Franks" || player === "Billy Joe Tolliver"))) {
  throw new Error("Picard scoreboard tie was broken or the senior board was added");
}
if (picard.rows.some((row) => row.name.includes("+"))) throw new Error("A Picard pairing was stored as one name");

const tree = officialRemainingSnapshot("tree-farm-invitational");
const weil = tree?.rows[0];
if (!tree || tree.scope !== "official-points" || tree.columnOrder !== "total-then-rounds" || tree.rows.length !== 35 || weil?.name !== "Davis Weil" || weil.rounds.join(",") !== "38,51" || weil.total !== 89) {
  throw new Error("Tree Farm points board changed");
}
if (tree.rows.some((row) => row.name === "Matt Crenshaw" || row.name === "Ben Greve" || row.status === "WD")) {
  throw new Error("Tree Farm invented a row for a player who is not on the published board");
}
if (tree.rows.filter((row) => row.name.includes("Williamson")).map((row) => row.name).join("|") !== "Bill Williamson") {
  throw new Error("Tree Farm renamed or duplicated Williamson");
}
const treeRecap = MIDAM_TOURNAMENTS.find((event) => event.slug === "tree-farm-invitational")?.news?.find((article) => article.slug === "2026-tree-farm-invitational-final-recap");
if (!treeRecap?.content.some((paragraph) => paragraph.includes("Billy Williamson"))) throw new Error("Tree Farm recap was rewritten");
const treeHtml = renderHub({ slug: "tree-farm-invitational", name: "Tree Farm", channel: "midam", month: 10, format: "Stableford" }, "midam");
const totalAt = treeHtml.indexOf(">Total<");
const roundAt = treeHtml.indexOf(">R1<");
if (!treeHtml.includes("Stableford points") || totalAt < 0 || roundAt < 0 || totalAt > roundAt || treeHtml.includes("Final results") || treeHtml.includes("Matt Crenshaw")) {
  throw new Error("Tree Farm points were shown as a stroke final or in the wrong column order");
}
const picardHtml = renderHub({ slug: "the-picard-cup", name: "Picard Cup", channel: "midam", month: 8, format: "4-ball" }, "midam");
if (!picardHtml.includes("Bobby Wyatt") || !picardHtml.includes("Vince Cave") || picardHtml.includes("Todd Franks") || picardHtml.includes("Bobby Wyatt + Vince Cave")) {
  throw new Error("Picard page merged a team or added the senior board");
}
const travisStill = resultSnapshot("walter-j-travis-invitational");
if (travisStill?.kind !== "match" || travisStill.complete || travisStill.matches.some((match) => match.result.includes("22 holes"))) {
  throw new Error("Travis bracket JSON was mounted");
}
if (!MIDAM_TOURNAMENTS.find((event) => event.slug === "walter-j-travis-invitational")?.golfGeniusUrl?.includes("116thwalterjtravisinvitational.golfgenius.com")) {
  throw new Error("Travis official page was not stored");
}

const midamLegacy = items.filter((item) => item.channel === "midam" && item.template === "legacy").map((item) => item.slug);
if (midamLegacy.join("|") !== "john-t-lupton-memorial") throw new Error(`Mid-am legacy pages drifted: ${midamLegacy.join("|")}`);
for (const slug of ["usga-womens-mid-am", "usga-mens-mid-am", "the-crump-cup", "the-stocker-cup"]) {
  if (!isFormatHub("midam", slug)) throw new Error(`${slug} stayed on the legacy layout`);
}
const auditCounts = { full: 0, partial: 0, selected: 0, none: 0 };
for (const entry of SOURCE_ACCESS.filter((item) => item.channel === "midam")) {
  if (entry.completeness === "full" || entry.completeness === "partial" || entry.completeness === "selected" || entry.completeness === "none") {
    auditCounts[entry.completeness] += 1;
  }
}
if (SOURCE_ACCESS.filter((item) => item.channel === "midam").length !== 29 || auditCounts.full !== 16 || auditCounts.partial !== 3 || auditCounts.selected !== 5 || auditCounts.none !== 5) {
  throw new Error(`Mid-am source audit drifted: ${JSON.stringify(auditCounts)}`);
}
const crump = MIDAM_TOURNAMENTS.find((event) => event.slug === "the-crump-cup");
if (crump?.golfGeniusUrlLabel !== "Pairings and tee times" || resultSnapshot("the-crump-cup")) {
  throw new Error("Crump tee sheet was labeled as results or turned into a board");
}
const crumpHtml = renderHub({ slug: "the-crump-cup", name: "The Crump Cup", channel: "midam", month: 9, format: "Match play", pastResults: [{ year: 2026, champion: "Stewart Hagestad" }] }, "midam");
if (!crumpHtml.includes("The posted sheet is pairings and tee times, not match results.") || crumpHtml.includes(" def. ") || !crumpHtml.includes("IBT Golf Travel")) {
  throw new Error("Crump page invented a match or dropped the tee-time label");
}
const stockerHtml = renderHub({ slug: "the-stocker-cup", name: "Stocker", channel: "midam", month: 10, format: "54 holes stroke play" }, "midam");
if (!sangerHtml.includes("Full results unavailable here.") || sangerHtml.includes("See Coverage.") || sangerHtml.includes("was found")) {
  throw new Error("Sanger results copy is not hub-scoped");
}
if (!stockerHtml.includes("Full results unavailable here.") || stockerHtml.includes("See Coverage.") || stockerHtml.includes("was found")) {
  throw new Error("Stocker results copy is not hub-scoped");
}
const usgaHtml = renderHub({ slug: "usga-mens-mid-am", name: "USGA Men’s Mid-Am", channel: "midam", month: 10, format: "Match play" }, "midam");
const usgaWomenHtml = renderHub({ slug: "usga-womens-mid-am", name: "USGA Women’s Mid-Am", channel: "midam", month: 9, format: "Match play" }, "midam");
for (const html of [usgaHtml, usgaWomenHtml]) {
  if (!html.includes("Full results unavailable here.") || html.includes("See Coverage.") || html.includes("Official scoring was not available")) {
    throw new Error("USGA results copy describes the retrieval instead of the hub");
  }
}
if (!usgaHtml.includes("PuttView Books")) throw new Error("USGA page dropped the sponsor");
const seniorLupton = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "john-t-lupton-memorial-senior-division");
const midamLupton = MIDAM_TOURNAMENTS.find((event) => event.slug === "john-t-lupton-memorial");
if (seniorLupton?.startDate !== "2026-05-11" || seniorLupton.endDate !== "2026-05-13" || midamLupton?.dates2026 !== "Rescheduled – 2027") {
  throw new Error("A Lupton year was changed from the other division");
}
if (!SOURCE_ACCESS.find((entry) => entry.slug === "john-t-lupton-memorial")?.note.includes("May 11-13, 2026")) {
  throw new Error("The Lupton date conflict was not flagged");
}
if (!renderHub({ slug: "the-farrell", name: "The Farrell", channel: "midam", month: 10, format: "Match play" }, "midam").includes("PuttView Books")) {
  throw new Error("Farrell sponsor was dropped");
}
if (resultSnapshot("east-vs-west-matches")?.kind !== "team-match" || resultSnapshot("national-invitational-tournament")?.kind !== "stroke") {
  throw new Error("In-progress coverage was replaced");
}
const seniorBoards = [
  ["giles-invitational-senior-division", 30, "Rick Stimmel", "73,66,73", 212, "giles-invitational"],
  ["jupiter-invitational-senior-division", 17, "Michael McCoy", "70,68,66", 204, "the-jupiter-invitational"],
  ["huddleston-cup-senior-division", 27, "Bob Royak", "70,73,73", 216, "the-huddleston-cup"],
] as const;
for (const [slug, count, leader, rounds, total, midamSlug] of seniorBoards) {
  const board = officialRemainingSnapshot(slug);
  const midam = officialStrokeSnapshot(midamSlug);
  if (!board || board.rows.length !== count || board.rows[0]?.name !== leader || board.rows[0].rounds.join(",") !== rounds || board.rows[0].total !== total) {
    throw new Error(`${slug} senior board changed`);
  }
  const midamNames = new Set(midam?.rows.map((row) => row.name));
  if (board.rows.some((row) => midamNames.has(row.name))) throw new Error(`${slug} repeats a mid-am name`);
  if (!isFormatHub("senior", slug)) throw new Error(`${slug} is still on the legacy layout`);
}
const gilesSenior = officialRemainingSnapshot("giles-invitational-senior-division");
const oconnell = gilesSenior?.rows.find((row) => row.name === "Eoghan O'Connell");
const mcclure = gilesSenior?.rows.find((row) => row.name === "John McClure");
if (oconnell?.status !== "DQ" || oconnell.rounds.join(",") !== "75,77,DQ" || oconnell.total !== "DQ" || mcclure?.status !== "CUT" || mcclure.rounds.join(",") !== "77,80," || mcclure.total !== 157) {
  throw new Error("Giles senior status tokens were rewritten");
}
const huddlestonSenior = officialRemainingSnapshot("huddleston-cup-senior-division");
const lohner = huddlestonSenior?.rows.find((row) => row.name === "Mike Lohner");
const joseph = huddlestonSenior?.rows.find((row) => row.name === "Eric Joseph");
if (lohner?.rounds.join(",") !== "84,WD," || lohner.total !== "WD" || joseph?.rounds.join(",") !== "88,NC," || joseph.total !== "NC") {
  throw new Error("Huddleston senior WD or NC token was rewritten");
}
if (SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "jupiter-invitational-senior-division")?.winners?.[0]?.champion !== "Mike McCoy") {
  throw new Error("The stored Jupiter senior champion line was renamed");
}
const huddlestonSeniorEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "huddleston-cup-senior-division");
const huddlestonMidam = MIDAM_TOURNAMENTS.find((event) => event.slug === "the-huddleston-cup");
if (huddlestonSeniorEvent?.startDate !== "2026-05-28" || huddlestonSeniorEvent.endDate !== "2026-05-30") {
  throw new Error("Huddleston senior dates are not the official May 28-30 rounds");
}
if (huddlestonMidam?.startDate !== "2026-05-28" || huddlestonMidam.endDate !== "2026-05-30") {
  throw new Error("Huddleston mid-am dates are not the official May 28-30 rounds");
}
const huddlestonHtml = renderHub(
  { slug: "huddleston-cup-senior-division", name: "Huddleston Senior", channel: "senior", month: 5, format: "54-hole stroke play", startDate: "2026-05-28", endDate: "2026-05-30" },
  "senior",
);
if (!huddlestonHtml.includes("May 28–30, 2026")) throw new Error("Huddleston senior page does not show May 28-30");
const elite = officialRemainingSnapshot("elite-invitational");
const stiglitz = elite?.rows[0];
const chauvin = elite?.rows.find((row) => row.name === "Noah Chauvin");
const tied = elite?.rows.filter((row) => row.place === "T6" && row.total === 209);
if (!elite || elite.complete || elite.divisions?.length !== 1 || elite.divisions[0].label !== "Boys" || elite.rows.length !== 56) {
  throw new Error("Elite boys board was marked as the whole event");
}
if (stiglitz?.name !== "Warren Stiglitz" || stiglitz.rounds.join(",") !== "64,66,69" || stiglitz.total !== 199 || stiglitz.toPar !== "-14") {
  throw new Error("Elite boys leader changed");
}
const eliteEvent = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "elite-invitational");
if (eliteEvent?.coursePar != null || eliteEvent?.courseYardage != null) {
  throw new Error("Elite boys par was stored as the whole event");
}
if (elite.divisions?.[0]?.par !== 71 || elite.divisions[0].yardage !== 7213) {
  throw new Error("Elite boys competition par was not 71");
}
if (stiglitz.total !== 71 * 3 + Number(stiglitz.toPar)) {
  throw new Error("Elite to-par does not match the boys par of 71");
}
for (const row of elite.rows) {
  if (!row.rounds.every((score) => typeof score === "number") || typeof row.total !== "number" || !row.toPar || !/^[+-]\d+$/.test(row.toPar)) continue;
  if (row.total !== 213 + Number(row.toPar)) throw new Error(`${row.name} to-par does not match boys par 71`);
}
if (tied?.length !== 4 || chauvin?.rounds.join(",") !== "W,0,-" || chauvin.total !== "-") {
  throw new Error("Elite ties or the unfinished row were rewritten");
}
if (elite.rows.some((row) => row.name.includes("Girl"))) throw new Error("A girls row was added to the Elite boys board");
const eliteHtml = renderHub({
  slug: "elite-invitational",
  name: "The Elite Invitational",
  channel: "junior",
  month: 11,
  format: "54-hole stroke play",
  course: "The King & Bear Golf Club",
  coursePar: 72,
  courseYardage: 7280,
}, "junior");
const eventFacts = eliteHtml.slice(eliteHtml.indexOf("data-event-facts"), eliteHtml.indexOf("</dl>"));
if (!eventFacts.includes(">Boys par</dt><dd class=\"mt-1 text-balance\">71</dd>") || !eventFacts.includes(">Boys yardage</dt><dd class=\"mt-1 text-balance\">7,213 yards</dd>")) {
  throw new Error("Elite event facts do not name the boys par and yardage");
}
if (eventFacts.includes(">Par</dt>") || eventFacts.includes(">Yardage</dt>")) {
  throw new Error("Elite event facts still use an unqualified par or yardage");
}
if (!eliteHtml.includes("Girls results unavailable here.") || !eliteHtml.includes("Warren Stiglitz") || !eliteHtml.includes("-14")) {
  throw new Error("Elite boys scores or the girls line changed");
}
const juniorNote = renderHub({ slug: "us-junior-amateur", name: "U.S. Junior Amateur", channel: "junior", month: 7, format: "Match play", pastResults: [{ year: 2026, champion: "Noah Maclauchlan" }] }, "junior");
if (!juniorNote.includes("Full results unavailable here.") || juniorNote.includes("See Coverage.") || !juniorNote.includes("Noah Maclauchlan")) {
  throw new Error("U.S. Junior page dropped the champion or described the retrieval");
}
const djHtml = renderHub({ slug: "dustin-johnson-world-junior", name: "DJ World Junior", channel: "junior", month: 3, format: "54-hole stroke play" }, "junior");
if (!djHtml.includes("Full results unavailable here.") || djHtml.includes("See Coverage.")) throw new Error("DJ World Junior coverage note is missing");
if (seniorLupton?.startDate !== "2026-05-11" || seniorLupton.endDate !== "2026-05-13") {
  throw new Error("Senior Lupton dates were changed without an official source");
}
const western = officialRemainingSnapshot("western-junior");
const sciortino = western?.kind === "stroke" ? western.rows[0] : null;
const westernCut = western?.kind === "stroke" ? western.rows.filter((row) => row.status === "CUT") : [];
const westernWd = western?.kind === "stroke" ? western.rows.filter((row) => row.status === "WD") : [];
if (!western || western.kind !== "stroke" || !western.complete || western.rows.length !== 156 || sciortino?.rounds.join(",") !== "72,70,67,68" || sciortino.total !== 277 || sciortino.toPar !== "-7") {
  throw new Error("Western Junior board changed");
}
if (westernCut.length !== 103 || westernCut[0]?.rounds[2] != null || westernWd.length !== 2 || western.rows.filter((row) => row.status === "DQ").length !== 1) {
  throw new Error("Western Junior cut or status tokens changed");
}
const westernEvent = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "western-junior");
if (westernEvent?.course !== "Knollwood Club" || westernEvent.coursePar != null || westernEvent.location != null) {
  throw new Error("Western Junior course metadata was not limited to the 2026 page");
}
const westernWomenEvent = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "womens-western-junior");
if (westernWomenEvent?.course !== "Meridian Hills Country Club" || westernWomenEvent.coursePar != null) {
  throw new Error("Women's Western par was left on the event without a printed source");
}
const westernWomen = womensWesternSnapshot();
const finalMatch = westernWomen?.kind === "match" ? westernWomen.matches.find((match) => match.round === "Final") : null;
if (!westernWomen || westernWomen.kind !== "match" || westernWomen.complete || westernWomen.qualifyingBoard?.rows.length !== 78 || westernWomen.matches.length !== 15 || finalMatch?.result !== "Lee def. Singh, 1 up") {
  throw new Error("Women's Western results changed");
}
const cheng = westernWomen.kind === "match" ? westernWomen.qualifyingBoard?.rows.find((row) => row.name === "Madelyn Cheng") : null;
if (cheng?.rounds.join(",") !== "88,WD" || cheng.total !== "") {
  throw new Error("Women's Western withdrawal was rewritten");
}
const qualifyingNames = westernWomen.kind === "match" ? (westernWomen.qualifyingBoard?.rows.map((row) => row.name) ?? []) : [];
const fieldNames = westernWomen ? snapshotNames(westernWomen) : [];
if (fieldNames.length !== 78 || new Set(fieldNames).size !== 78 || fieldNames.join("\n") !== qualifyingNames.join("\n")) {
  throw new Error("Women's Western field is not the 78 qualifying names");
}
const abbreviated = ["Lee", "I. Lee", "G. Lee", "Guthrie", "Carter", "Singh", "Rigby", "Errichetto", "Wiertel"];
if (fieldNames.some((name) => abbreviated.includes(name))) {
  throw new Error("Women's Western field used an abbreviated match name");
}
const wwHtml = renderHub(
  {
    slug: "womens-western-junior",
    name: "Women's Western Junior Championship",
    channel: "junior",
    month: 6,
    format: westernWomenEvent?.format,
    course: westernWomenEvent?.course,
    location: westernWomenEvent?.location,
  },
  "junior",
);
const fieldStart = wwHtml.indexOf("data-field-panel");
const fieldEnd = wwHtml.indexOf("data-event-facts");
const fieldHtml = fieldStart >= 0 && fieldEnd > fieldStart ? wwHtml.slice(fieldStart, fieldEnd) : "";
const renderedField = [...fieldHtml.matchAll(/<li[^>]*>([^<]+)<\/li>/g)].map((match) => match[1].trim());
const expectedField = [...qualifyingNames].sort((a, b) => a.localeCompare(b));
if (renderedField.length !== 78 || renderedField.join("\n") !== expectedField.join("\n") || fieldHtml.includes("Named players")) {
  throw new Error("Rendered Women's Western field is not the 78 source names");
}
if (renderedField.some((name) => abbreviated.includes(name))) {
  throw new Error("Rendered Women's Western field repeated an abbreviated match name");
}
if (!wwHtml.includes("I. Lee def. G. Lee, 2 and 1") || !wwHtml.includes("Guthrie def. Carter, 4 and 3") || !wwHtml.includes("Lee def. Singh, 1 up")) {
  throw new Error("Women's Western match lines were rewritten");
}
const southern = officialRemainingSnapshot("southern-junior-championship");
const jolly = southern?.kind === "stroke" ? southern.rows[0] : null;
const graves = southern?.kind === "stroke" ? southern.rows.find((row) => row.name === "Jaxon Graves") : null;
if (!southern || southern.kind !== "stroke" || southern.complete || southern.scope !== "official-partial" || southern.stageLabel !== "Through 36 holes" || southern.roundCount !== 2 || southern.rows.length !== 156 || jolly?.rounds.join(",") !== "62,69" || jolly.total !== 131 || jolly.toPar !== "-9" || graves?.rounds.join(",") !== "NS,NS" || graves.total !== "NS") {
  throw new Error("Southern Junior 36-hole board changed");
}
const southernEvent = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "southern-junior-championship");
if (southernEvent?.course !== "University Golf Course" || southernEvent.location !== "Athens, GA" || southernEvent.coursePar != null || southernEvent.format?.includes("54")) {
  throw new Error("Southern Junior metadata still describes the 54-hole Cotton Dike setup");
}
const southernHtml = renderHub({ slug: "southern-junior-championship", name: "Southern Junior Championship", channel: "junior", month: 6, format: southernEvent?.format, course: southernEvent?.course, location: southernEvent?.location }, "junior");
if (!southernHtml.includes("Through 36 holes") || southernHtml.includes("Final results") || southernHtml.includes(">R3<")) {
  throw new Error("Southern Junior was labeled as a 54-hole final");
}
const rolex = officialRemainingSnapshot("rolex-girls-junior");
const ding = rolex?.kind === "stroke" ? rolex.rows.find((row) => row.name === "Clara Ding") : null;
if (!rolex || rolex.kind !== "stroke" || !rolex.complete || rolex.divisions?.[0]?.label !== "Girls" || rolex.rows.length !== 72 || rolex.rows[0]?.rounds.join(",") !== "69,70,73" || rolex.rows[0].total !== 212 || ding?.rounds.join(",") !== "74,WD,") {
  throw new Error("Rolex Girls board changed");
}
const rolexNames = rolex.kind === "stroke" ? snapshotNames(rolex) : [];
if (rolexNames.length !== 72 || new Set(rolexNames).size !== 72 || !rolexNames.includes("Inseoul Jiamanukoonkit")) {
  throw new Error("Rolex Girls field is not the 72 leaderboard names");
}
const playersBoard = officialRemainingSnapshot("junior-players-championship");
const mason = playersBoard?.kind === "stroke" ? playersBoard.rows.find((row) => row.name === "Mason An") : null;
if (!playersBoard || playersBoard.kind !== "stroke" || playersBoard.divisions?.[0]?.label !== "Boys" || playersBoard.rows.length !== 78 || playersBoard.rows[0]?.name !== "JP Lynch" || playersBoard.rows[0].total !== 208 || mason?.rounds.join(",") !== "77,WD,") {
  throw new Error("Junior Players board changed");
}
const annika = officialRemainingSnapshot("annika-invitational");
const annikaEvent = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "annika-invitational");
if (!annika || annika.kind !== "stroke" || annika.divisions?.[0]?.label !== "Girls" || annika.rows.length !== 72 || annika.rows[0]?.rounds.join(",") !== "66,69,67" || annika.rows[0].total !== 202 || annika.rows[0].toPar !== "-14" || annikaEvent?.coursePar != null) {
  throw new Error("Annika board or par changed");
}
const rlx = resultSnapshot("rlx-ralph-lauren-junior-classic");
if (!rlx || rlx.kind !== "match" || rlx.complete || rlx.matches.map((match) => match.result).join("|") !== "Rory Asselta def. Joseph Corcell (Fla.), 5&4|Eliana Saga def. Clairey Lin (Canada), 2&1") {
  throw new Error("RLX finals changed");
}
const solheim = resultSnapshot("junior-solheim-cup");
if (!solheim || solheim.kind !== "match" || solheim.matches.length !== 12 || !solheim.matches.some((match) => match.result.includes("2up")) || !solheim.matches.some((match) => match.result === "Anna Fang (U.S. Team) and Marta Muñoz (Europe), Tie")) {
  throw new Error("Junior Solheim singles changed");
}
const solheimHtml = renderHub({ slug: "junior-solheim-cup", name: "Junior Solheim Cup", channel: "junior", month: 9, format: "Two-day team match play" }, "junior");
if (!solheimHtml.includes("2up") || solheimHtml.includes("13-11") || solheimHtml.includes("13–11")) {
  throw new Error("Junior Solheim total was added or the 2up token was rewritten");
}
const wyndhamHtml = renderHub({ slug: "wyndham-cup", name: "Wyndham Cup", channel: "junior", month: 7, format: "Team match play", pastResults: [{ year: 2026, champion: "East (retained Cup)", score: "25.0 to 25.0" }] }, "junior");
if (!wyndhamHtml.includes("25.0 to 25.0") || !wyndhamHtml.includes("Full results unavailable here.")) {
  throw new Error("Wyndham Cup score or note changed");
}
const presidentsHtml = renderHub({ slug: "junior-presidents-cup", name: "Junior Presidents Cup", channel: "junior", month: 9, format: "Two-day team match play", pastResults: [{ year: 2026, champion: "United States", score: "17.5 - 6.5" }] }, "junior");
if (!presidentsHtml.includes("17.5 - 6.5") || !presidentsHtml.includes("Full results unavailable here.")) {
  throw new Error("Junior Presidents Cup score or note changed");
}
for (const slug of ["ajga-ping-invitational", "rolex-tournament-of-champions", "junior-jones-cup", "north-south-junior", "us-amateur"]) {
  if (!isFormatHub("junior", slug)) throw new Error(`${slug} stayed on the legacy layout`);
}
const amateurHtml = renderHub({ slug: "us-amateur", name: "U.S. Amateur", channel: "junior", month: 8, format: "Match play", pastResults: [{ year: 2026, champion: "Jack Whaley", runnerUp: "Jay Leng Jr." }] }, "junior");
if (!amateurHtml.includes("Jack Whaley") || !amateurHtml.includes("Jay Leng Jr.") || !amateurHtml.includes("Full results unavailable here.") || amateurHtml.includes("4 and 3")) {
  throw new Error("U.S. Amateur champion line changed");
}
const pingHtml = renderHub({ slug: "ajga-ping-invitational", name: "AJGA Ping Invitational", channel: "junior", month: 11, format: "54-hole stroke play", startDate: "2026-11-05", endDate: "2026-11-08", liveStatus: "live", pastResults: [{ year: 2025, champion: "Boys: Preston Hage / Girls: Honorine Nobuta Ferry" }] }, "junior");
if (pingHtml.includes("Tripp Depoy") || pingHtml.includes("2026 champion") || !pingHtml.includes("Full results unavailable here.") || !pingHtml.includes("Defending champion")) {
  throw new Error("PING in-progress board was frozen or a 2026 champion was added");
}
if (classifyCalendar({ startDate: "2026-11-21", endDate: "2026-11-25" }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("Rolex Tournament of Champions dates were not classified as upcoming");
}
if (classifyCalendar({ startDate: "2026-12-18", endDate: "2026-12-21" }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("Jones Cup dates were not classified as upcoming");
}
if (classifyCalendar({ startDate: "2026-11-05", endDate: "2026-11-08", liveStatus: "live" }, "2026-11-08") !== "in-progress-2026") {
  throw new Error("PING was not classified as in progress");
}
const tocHtml = renderHub({ slug: "rolex-tournament-of-champions", name: "Rolex Tournament of Champions", channel: "junior", month: 11, format: "72-hole stroke play", startDate: "2026-11-21", endDate: "2026-11-25", pastResults: [{ year: 2025, champion: "Boys: Luke Ringkamp / Girls: Nikki Oh" }] }, "junior");
if (tocHtml.includes("2026 champion") || !tocHtml.includes("Defending champion") || !tocHtml.includes("Luke Ringkamp") || !tocHtml.includes("Not started") || tocHtml.includes("Full results unavailable here.")) {
  throw new Error("Rolex Tournament of Champions was given a 2026 champion or a missing-results claim");
}
const jonesHtml = renderHub({ slug: "junior-jones-cup", name: "Junior Jones Cup", channel: "junior", month: 12, format: "54-hole stroke play", startDate: "2026-12-18", endDate: "2026-12-21", pastResults: [{ year: 2025, champion: "Ayden Fynaut" }] }, "junior");
if (!jonesHtml.includes("Not started") || jonesHtml.includes("Full results unavailable here.") || jonesHtml.includes("2026 champion")) {
  throw new Error("Jones Cup was described as a missing published result");
}
if (pingHtml.includes("Not started")) throw new Error("PING in progress was labeled as not started");
const daleMorey = officialRemainingSnapshot("society-of-seniors-dale-morey");
const desertBoard = officialRemainingSnapshot("golfweek-senior-desert-showdown");
const oDonnell = daleMorey?.kind === "stroke" ? daleMorey.divisions?.flatMap((division) => division.rows).find((row) => row.name.includes("Donnell")) : null;
const desertNames = desertBoard?.kind === "stroke" ? desertBoard.divisions?.flatMap((division) => division.rows) ?? [] : [];
const oMalley = desertNames.find((row) => row.name.includes("Malley"));
if (oDonnell?.name !== "Michael O'Donnell" || oMalley?.name !== "O'Malley, Sean") {
  throw new Error("An official apostrophe was left encoded or rewritten");
}
const daleHtml = renderHub({ slug: "society-of-seniors-dale-morey", name: "Dale Morey", channel: "senior", month: 9, format: "54-hole stroke play" }, "senior");
const desertHtml = renderHub({ slug: "golfweek-senior-desert-showdown", name: "Desert Showdown", channel: "senior", month: 11, format: "54-hole stroke play" }, "senior");
for (const html of [daleHtml, desertHtml]) {
  if (html.includes("&#39;") || html.includes("O’Donnell") || html.includes("O’Malley")) {
    throw new Error("A rendered senior board kept the source entity or a curly apostrophe");
  }
}
if (!daleHtml.includes("Michael O&#x27;Donnell") || daleHtml.split("Michael O&#x27;Donnell").length < 3 || !desertHtml.includes("O&#x27;Malley, Sean") || desertHtml.split("O&#x27;Malley, Sean").length < 3) {
  throw new Error("Rendered Field or Scoring dropped an official apostrophe name");
}
const northSouth = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "north-south-junior");
if (northSouth?.startDate !== "2026-06-29" || northSouth.endDate !== "2026-07-01") {
  throw new Error("North and South Junior dates changed without an official 2026 schedule");
}
const ojai = officialRemainingSnapshot("ojai-senior-cup");
const steinberg = ojai?.kind === "stroke" ? ojai.divisions?.flatMap((division) => division.rows).find((row) => row.name === "Craig Steinberg") : null;
if (!ojai || ojai.kind !== "stroke" || ojai.divisions?.map((division) => division.label).join("|") !== "Senior|Super Senior" || ojai.divisions[0].rows[0]?.rounds.join(",") !== "69,72,68" || ojai.divisions[0].rows[0].total !== 209 || steinberg?.rounds.join(",") !== "DNF,," || steinberg.total !== "DNF") {
  throw new Error("Ojai senior boards changed");
}
const transMiss = officialRemainingSnapshot("trans-mississippi-senior-championship");
const nunez = transMiss?.kind === "stroke" ? transMiss.divisions?.flatMap((division) => division.rows).find((row) => row.name === "Nunez, Larry") : null;
const transEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "trans-mississippi-senior-championship");
if (!transMiss || transMiss.kind !== "stroke" || transMiss.divisions?.length !== 3 || transMiss.rows[0]?.name !== "Pridmore, Jason" || transMiss.rows[0].rounds.join(",") !== "62,72,72" || nunez?.rounds.join(",") !== "78,NS," || transEvent?.startDate !== "2026-05-19" || transEvent.endDate !== "2026-05-21") {
  throw new Error("Trans-Mississippi senior board or dates changed");
}
const morey = officialRemainingSnapshot("society-of-seniors-dale-morey");
const desert = officialRemainingSnapshot("golfweek-senior-desert-showdown");
if (!morey || morey.kind !== "stroke" || morey.divisions?.length !== 2 || morey.rows[0]?.name !== "Jeff Frazier" || morey.rows[0].total !== 210) {
  throw new Error("Dale Morey board changed");
}
if (!desert || desert.kind !== "stroke" || desert.divisions?.map((division) => division.label).join("|") !== "Senior|Super Senior|Legend|Super Legend" || desert.rows[0]?.rounds.join(",") !== "67,65,68" || desert.rows[0].total !== 200) {
  throw new Error("Desert Showdown board changed");
}
if (isFormatHub("senior", "john-t-lupton-memorial-senior-division") || isFormatHub("midam", "john-t-lupton-memorial") || isFormatHub("midam", "ewing-cup-four-ball")) {
  throw new Error("Lupton or Ewing was moved");
}
const reynolds = officialRemainingSnapshot("reynolds-senior-invitational");
if (!reynolds || reynolds.kind !== "stroke" || reynolds.divisions?.map((division) => division.label).join("|") !== "Senior|Super Senior|Legends|Grand Master" || reynolds.rows[0]?.rounds.join(",") !== "70,73,68" || reynolds.rows[0].total !== 211) {
  throw new Error("Reynolds boards changed");
}
const golfweek = officialRemainingSnapshot("golfweek-senior-amateur-championship");
const golfweekEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "golfweek-senior-amateur-championship");
if (!golfweek || golfweek.kind !== "stroke" || golfweek.divisions?.length !== 4 || golfweek.rows[0]?.name !== "Doss, Todd" || golfweek.rows[0].total !== 209 || golfweekEvent?.startDate !== "2026-03-31" || golfweekEvent.endDate !== "2026-04-02") {
  throw new Error("Golfweek Senior Amateur board or dates changed");
}
const individual = officialRemainingSnapshot("international-senior-individual-championship");
const individualEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "international-senior-individual-championship");
if (!individual || individual.kind !== "stroke" || individual.divisions || individual.rows.length !== 90 || individual.rows[0]?.name !== "Wise, Tony" || individual.rows[0].rounds.join(",") !== "67,72,67" || individualEvent?.startDate !== "2026-10-08") {
  throw new Error("International individual board changed");
}
const northSouthSenior = officialRemainingSnapshot("north-south-senior-mens-amateur");
if (!northSouthSenior || northSouthSenior.kind !== "stroke" || northSouthSenior.divisions?.map((division) => division.label).join("|") !== "Open|Super Senior" || northSouthSenior.rows[0]?.name !== "Stewart, Rick" || northSouthSenior.rows[0].total !== 213) {
  throw new Error("North and South senior boards changed");
}
const tutwiler = officialRemainingSnapshot("society-of-seniors-ed-tutwiler-four-ball");
const fox = tutwiler?.kind === "stroke" ? tutwiler.divisions?.find((division) => division.label === "Open")?.rows[0] : null;
if (!tutwiler || tutwiler.kind !== "stroke" || tutwiler.roundCount !== 2 || fox?.players?.join("|") !== "Stephen Fox|Dean Channell" || fox.rounds.join(",") !== "64,67" || fox.total !== 131) {
  throw new Error("Tutwiler four-ball teams changed");
}
const hall = officialRemainingSnapshot("national-senior-hall-of-fame");
const bingman = hall?.kind === "stroke" ? hall.divisions?.flatMap((division) => division.rows).find((row) => row.name === "George Bingman") : null;
const hallCut = hall?.kind === "stroke" ? hall.rows.find((row) => row.status === "CUT") : null;
if (!hall || hall.kind !== "stroke" || hall.divisions?.length !== 3 || hall.rows[0]?.name !== "Vance Welch" || hall.rows[0].total !== 215 || bingman?.rounds.join(",") !== "84,NC," || bingman.total !== "NC" || hallCut?.rounds[2] != null) {
  throw new Error("Hall of Fame board changed");
}
const tutHtml = renderHub({ slug: "society-of-seniors-ed-tutwiler-four-ball", name: "Ed Tutwiler Four-Ball", channel: "senior", month: 3, format: "36-hole four-ball" }, "senior");
if (!tutHtml.includes("Stephen Fox") || !tutHtml.includes("Dean Channell") || tutHtml.includes("Fox, Stephen + Channell, Dean")) {
  throw new Error("Tutwiler field combined a team into one name");
}
const seniorLuptonStill = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "john-t-lupton-memorial-senior-division");
if (seniorLuptonStill?.startDate !== "2026-05-11" || seniorLuptonStill.endDate !== "2026-05-13" || isFormatHub("senior", "john-t-lupton-memorial-senior-division")) {
  throw new Error("Senior Lupton dates were changed without an official source");
}
const national = officialRemainingSnapshot("golfweek-senior-national-championship");
if (!national || national.kind !== "stroke" || national.divisions?.map((division) => division.label).join("|") !== "Senior|Super Senior|Legend|Super Legend" || national.rows[0]?.rounds.join(",") !== "75,68,68" || national.rows[0].total !== 211 || national.rows[0].name !== "Hoops, Bryan") {
  throw new Error("Golfweek Senior National board changed");
}
const raEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "ra-senior-amateur");
const raHtml = renderHub({ slug: "ra-senior-amateur", name: "R&A Senior Amateur", channel: "senior", month: 7, format: "stroke play", pastResults: [{ year: 2026, champion: "Bryan Hoops", score: "278" }] }, "senior");
if (raEvent?.pastResults?.find((result) => result.year === 2026)?.score !== "278" || !raHtml.includes("Full results unavailable here.") || !raHtml.includes("278")) {
  throw new Error("R&A selected result changed");
}
const crumpSenior = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "crump-cup-senior-division");
if (!crumpSenior || crumpSenior.golfGeniusUrl !== "/results/crump-cup-2026-final-results.pdf" || crumpSenior.golfGeniusUrlLabel !== "Pairings and tee times") {
  throw new Error("Crump senior sheet is still labeled as results");
}
const crumpSeniorHtml = renderHub({
  slug: crumpSenior.slug,
  name: crumpSenior.name,
  channel: "senior",
  month: 9,
  format: crumpSenior.format,
  golfGeniusUrl: crumpSenior.golfGeniusUrl,
  golfGeniusUrlLabel: crumpSenior.golfGeniusUrlLabel,
  pastResults: [{ year: 2026, champion: "Randy Haag" }],
}, "senior");
if (!crumpSeniorHtml.includes(`href="${crumpSenior.golfGeniusUrl}"`) || !crumpSeniorHtml.includes("Pairings and tee times") || crumpSeniorHtml.includes("2026 Results")) {
  throw new Error("Crump senior scoring link does not use the real pairings label");
}
if (!crumpSeniorHtml.includes("Randy Haag") || !crumpSeniorHtml.includes("Full results unavailable here.") || crumpSeniorHtml.includes("3 and 2")) {
  throw new Error("Crump senior sheet was parsed into a margin");
}
const womenHtml = renderHub({ slug: "us-senior-womens-amateur", name: "U.S. Senior Women's Amateur", channel: "senior", month: 9, format: "match play", startDate: "2026-09-26", endDate: "2026-10-01", pastResults: [{ year: 2025, champion: "Dawn Woodard" }] }, "senior");
if (!womenHtml.includes("Full results unavailable here.") || womenHtml.includes("2026 champion") || !womenHtml.includes("Defending champion")) {
  throw new Error("U.S. Senior Women's Amateur was given a 2026 champion");
}
const travisSenior = resultSnapshot("walter-j-travis-invitational-senior-division");
if (!travisSenior || travisSenior.kind !== "match" || travisSenior.matches.length !== 1 || travisSenior.matches[0]?.result !== "Dave Scialabba def. Doug Clapp") {
  throw new Error("Travis senior final changed");
}
if (classifyCalendar({ startDate: "2026-11-30", endDate: "2026-12-02" }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("Ralph Bogart was not classified as upcoming");
}
if (classifyCalendar({ startDate: "2026-12-05", endDate: "2026-12-07" }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("Golfweek Senior Tournament of Champions was not classified as upcoming");
}
const bogartHtml = renderHub({ slug: "society-of-seniors-ralph-bogart", name: "Ralph Bogart", channel: "senior", month: 11, format: "54-hole stroke play", startDate: "2026-11-30", endDate: "2026-12-02", pastResults: [{ year: 2025, champion: "Rick Stimmel" }] }, "senior");
const tocSeniorHtml = renderHub({ slug: "golfweek-senior-tournament-of-champions", name: "Golfweek Senior Tournament of Champions", channel: "senior", month: 12, format: "54-hole stroke play", startDate: "2026-12-05", endDate: "2026-12-07" }, "senior");
if (!bogartHtml.includes("Not started") || bogartHtml.includes("Full results unavailable here.") || bogartHtml.includes("2026 champion")) {
  throw new Error("Ralph Bogart was given a finished-results claim");
}
if (!tocSeniorHtml.includes("Not started") || tocSeniorHtml.includes("Full results unavailable here.")) {
  throw new Error("Golfweek Senior Tournament of Champions was given a finished-results claim");
}
const coleman = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "george-coleman-invitational-senior-division");
if (!coleman || coleman.winners?.some((winner) => winner.year === 2026) || coleman.course !== "Seminole Golf Club" || coleman.location !== "Juno Beach, FL" || !coleman.note?.includes("venue for 2026 pending confirmation")) {
  throw new Error("George Coleman source course or pending-venue note changed");
}
const seniorPage = readFileSync("src/app/seniorgolfhq/[slug]/page.tsx", "utf8");
if (!seniorPage.includes('from "@/lib/tournaments/seniorTournament"') || seniorPage.includes("function toTournament")) {
  throw new Error("Senior hub page is not using the shared tournament adapter");
}
const colemanAdapted = toTournament(coleman);
if (colemanAdapted.course || colemanAdapted.location || colemanAdapted.courseDesigner || colemanAdapted.overview || colemanAdapted.note || colemanAdapted.venueStatus !== "unconfirmed") {
  throw new Error("George Coleman adapter still publishes the unconfirmed venue or its internal note");
}
const colemanHtml = renderHub(colemanAdapted, "senior");
if (!colemanHtml.includes("Venue unconfirmed") || !colemanHtml.includes(">Unconfirmed<") || colemanHtml.includes("Seminole") || colemanHtml.includes("Juno Beach") || colemanHtml.includes("rising water") || colemanHtml.includes("Donald Ross")) {
  throw new Error("George Coleman page asserts Seminole or prints the internal venue note");
}
if (!colemanHtml.includes("Full results unavailable here.") || colemanHtml.includes("2026 champion") || !colemanHtml.includes("Defending champion") || !colemanHtml.includes("Mike McCoy")) {
  throw new Error("George Coleman results were invented");
}
const bogartSource = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "society-of-seniors-ralph-bogart");
const bogartAdapted = bogartSource ? toTournament(bogartSource) : null;
if (!bogartSource?.course || !bogartSource.note || bogartAdapted?.course !== bogartSource.course || bogartAdapted.venueStatus || bogartAdapted.note) {
  throw new Error("A confirmed senior venue note was treated as unconfirmed or published");
}
const eastWest = resultSnapshot("east-west-cup-matches");
if (!eastWest || eastWest.kind !== "match" || eastWest.complete || eastWest.matches.length !== 11) {
  throw new Error("East vs West senior final changed");
}
if (eastWest.kind === "match" && eastWest.matches.slice(0, 5).map((match) => match.result).join("|") !== "East 5.00, West 4.00|East 4.50, West 4.50|East 2.50, West 6.50|East 7.50, West 10.50|East 19.50, West 25.50") {
  throw new Error("East vs West senior session scores changed");
}
if (eastWest.kind === "match" && eastWest.matches.filter((match) => match.flight === "Senior singles").length !== 6) {
  throw new Error("Senior singles were not kept to the six senior matches");
}
if (eastWest.kind === "match" && eastWest.matches.some((match) => match.players?.length)) {
  throw new Error("East and West were stored as players");
}
if (snapshotNames(eastWest).some((name) => name === "East" || name === "West" || name.startsWith("East "))) {
  throw new Error("East vs West team sides were treated as player names");
}
if (PLAYERS.some((player) => player.name === "East" || player.name === "West") || PLAYER_APPEARANCES.some((row) => row.eventSlug === "east-west-cup-matches")) {
  throw new Error("East or West was added to the player registry");
}
const eastWestEvent = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "east-west-cup-matches");
if (eastWestEvent?.liveStatus !== "completed" || eastWestEvent.endDate !== "2026-11-08" || eastWestEvent.course !== "Maridoe Golf Club" || eastWestEvent.golfGeniusUrlLabel !== "2026 Results") {
  throw new Error("East vs West senior was not marked complete from the final board");
}
const midamEastWest = MIDAM_TOURNAMENTS.find((event) => event.slug === "east-vs-west-matches");
if (midamEastWest?.liveStatus !== "completed" || midamEastWest.golfGeniusUrlLabel !== "2026 Results") {
  throw new Error("East vs West mid-am was not marked complete");
}
const finalRecap = midamEastWest.news?.find((article) => article.slug === "2026-east-vs-west-matches-final-recap");
const approvedRecap = [
  "The West won the East vs West Matches at Maridoe Golf Club in Carrollton, Texas, taking Sunday\u2019s singles session 10.5 to 7.5 to finish with a 25.5 to 19.5 victory. The West entered the final day leading 15 to 12 after winning Saturday\u2019s second foursomes session 6.5 to 2.5. Full results and tournament coverage can be found on the [East vs West Matches tournament hub](https://www.nichegolfhq.com/midamgolfhq/east-vs-west-matches).",
  "Bobby Massa delivered the largest margin in the mid-amateur singles, defeating Scott Harvey 7 and 6. Josh Persons added a 6 and 5 victory over Stephen Behr, while Stewart Hagestad beat Brett Patterson 2 and 1. Parker Edens and Nate Smith earned 1 up wins over Matt Vogt and Jonathan Bale, respectively. Nate Gahman and Drew Kittleson halved their match.",
  "Evan Beck led the East\u2019s mid-amateur winners with a 6 and 5 victory over Mikel Martinson. Will Davenport defeated Drew Stoltz 4 and 3, Christian Brand beat Jordan Russell 3 and 2, and Andrew Price beat Chris Wheeler by the same margin. Christian Cavaliere edged Zach Foushee 1 up, while Andrew Bailey defeated Brad Nurski 1 up. midamgolfHQ will be back next week with coverage from the Ewing Cup.",
];
if (finalRecap?.title !== "West Wins East vs West Matches, 25.5 to 19.5, at Maridoe" || finalRecap.date !== "2026-11-08" || finalRecap.author !== "midamgolfHQ Staff" || finalRecap.summary !== "The West won the East vs West Matches at Maridoe Golf Club, finishing 25.5 to 19.5 after a 10.5 to 7.5 singles victory." || finalRecap.content.join("\n") !== approvedRecap.join("\n")) {
  throw new Error("The approved East vs West final recap was changed");
}
const eastNews = midamEastWest.news?.map((article) => article.slug) ?? [];
for (const slug of ["2026-east-vs-west-matches-day-2-recap", "2026-east-vs-west-matches-day-1-recap", "2026-east-vs-west-matches-preview"]) {
  if (!eastNews.includes(slug)) throw new Error(`${slug} was dropped`);
}
const eastWestHtml = renderHub(toTournament(eastWestEvent), "senior");
const teamsAt = eastWestHtml.indexOf(">Teams</h2>");
const teamBlock = teamsAt < 0 ? "" : eastWestHtml.slice(teamsAt, teamsAt + 600);
if (eastWestHtml.includes("Named players") || !teamBlock.includes(">East</li>") || !teamBlock.includes(">West</li>") || !eastWestHtml.includes("East 19.50, West 25.50") || !eastWestHtml.includes("East 7.50, West 10.50") || !eastWestHtml.includes("Mike McCoy def. Mike Sposa, 2 and 1") || eastWestHtml.includes("Scott Harvey")) {
  throw new Error("East vs West senior final mixed the mid-am singles into the team field");
}
const dixie = SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "dixie-senior-amateur");
if (dixie?.startDate !== "2026-12-09" || dixie.endDate !== "2026-12-11" || classifyCalendar({ startDate: dixie.startDate, endDate: dixie.endDate }, "2026-11-08") !== "scheduled-2026") {
  throw new Error("Dixie Senior Amateur was not left as a future 2026 event");
}
const dixieHtml = renderHub({ slug: "dixie-senior-amateur", name: "Dixie Senior Amateur", channel: "senior", month: 12, startDate: "2026-12-09", endDate: "2026-12-11" }, "senior");
if (!dixieHtml.includes("Not started") || dixieHtml.includes("2026 champion") || dixieHtml.includes("Full results unavailable here.")) {
  throw new Error("Dixie Senior Amateur was given a 2026 result");
}

function heroAndOverview(html: string) {
  const tab = html.indexOf('role="tablist"');
  if (tab < 0) throw new Error("Hub tabs did not render");
  const rest = html.slice(tab);
  const hidden = rest.indexOf(" hidden=\"\"");
  return { hero: html.slice(0, tab), overview: hidden < 0 ? rest : rest.slice(0, hidden) };
}

function assertSingleFormat(html: string, format: string, label: string) {
  const { hero, overview } = heroAndOverview(html);
  const shown = hero.split(format).length - 1;
  if (shown !== 1) throw new Error(`${label} format appeared ${shown} times above the tabs`);
  if (overview.includes(">Format</p>") || overview.includes(`>${format}<`)) {
    throw new Error(`${label} repeated its format under Overview`);
  }
}

const gasparillaEvent = MIDAM_TOURNAMENTS.find((event) => event.slug === "gasparilla-invitational");
const championsEvent = MIDAM_TOURNAMENTS.find((event) => event.slug === "champions-cup-four-ball");
const travisEvent = MIDAM_TOURNAMENTS.find((event) => event.slug === "walter-j-travis-invitational");
const andersonEvent = MIDAM_TOURNAMENTS.find((event) => event.slug === "anderson-memorial-four-ball");
if (!gasparillaEvent?.format || !championsEvent?.format || !travisEvent?.format || !andersonEvent?.format) {
  throw new Error("A representative hub is missing its format");
}
function withoutPhotos(event: Tournament): Tournament {
  return { ...event, news: event.news?.map((article) => ({ ...article, photos: undefined })) };
}
const gasparillaPage = renderHub(withoutPhotos(gasparillaEvent), "midam");
const championsPage = renderHub(withoutPhotos(championsEvent), "midam");
const travisPage = renderHub(withoutPhotos(travisEvent), "midam");
const andersonPage = renderHub(withoutPhotos(andersonEvent), "midam");
const orangeBowl = JUNIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "junior-orange-bowl");
if (!orangeBowl?.format || !orangeBowl.fieldSize || !orangeBowl.eligibility) throw new Error("Junior Orange Bowl facts changed");
const orangePage = renderHub({
  slug: orangeBowl.slug,
  name: orangeBowl.name,
  channel: "junior",
  month: 1,
  format: orangeBowl.format,
  startDate: orangeBowl.startDate,
  endDate: orangeBowl.endDate,
  course: orangeBowl.course,
  coursePar: orangeBowl.coursePar,
  fieldSize: orangeBowl.fieldSize,
  eligibility: orangeBowl.eligibility,
}, "junior");
assertSingleFormat(gasparillaPage, gasparillaEvent.format, "Gasparilla");
assertSingleFormat(championsPage, championsEvent.format, "Champions Cup");
assertSingleFormat(travisPage, travisEvent.format, "Travis");
assertSingleFormat(andersonPage, andersonEvent.format, "Anderson");
assertSingleFormat(orangePage, orangeBowl.format, "Junior Orange Bowl");
assertSingleFormat(bogartHtml, "54-hole stroke play", "Ralph Bogart");
if (!gasparillaPage.includes("2026 Results") || !gasparillaPage.includes("Hayes Brown") || !gasparillaPage.includes("Monday qualifier") || !gasparillaPage.includes(">Par<") || !gasparillaPage.includes(">70<")) {
  throw new Error("Gasparilla scoring label, board, qualifier, or par was dropped");
}
if (!championsPage.includes(">Team<") || !championsPage.includes("Gibbons, Josh") || !championsPage.includes("Stewart, Kade") || !championsPage.includes(">263<") || !championsPage.includes(">Par<")) {
  throw new Error("Champions Cup pairs or scoring facts were dropped");
}
if (!travisPage.includes("Recorded format: Match play") || !travisPage.includes("Qualifying medalist: Rob Couture") || !travisPage.includes("Chris DeJohn def. Pat Wilson, 2 and 1") || !travisPage.includes("Garden City Golf Club")) {
  throw new Error("Travis match labels were dropped");
}
if (!andersonPage.includes("Recorded format: Match play") || !andersonPage.includes("Costanza, Mark") || !andersonPage.includes("3 &amp; 2") || !andersonPage.includes("Winged Foot Golf Club")) {
  throw new Error("Anderson match result was dropped");
}
if (!orangePage.includes(orangeBowl.fieldSize) || !orangePage.includes(orangeBowl.eligibility) || !orangePage.includes(">Par<") || !orangePage.includes(">71<")) {
  throw new Error("Junior Orange Bowl field, eligibility, or par was dropped");
}
if (!bogartHtml.includes(">Round 1<") || !bogartHtml.includes(">Round 3<") || !bogartHtml.includes("Defending champion") || !bogartHtml.includes("Rick Stimmel")) {
  throw new Error("Upcoming stroke rounds or the defending champion were dropped");
}
const gasparillaOverview = heroAndOverview(gasparillaPage).overview;
if (gasparillaPage.includes(">Coverage</button>") || !gasparillaOverview.includes("/midamgolfhq/gasparilla-invitational/2026-gasparilla-invitational-recap") || !gasparillaOverview.includes("Brown Birdies 18 to Edge White by One")) {
  throw new Error("Gasparilla coverage is still behind a tab or lost its article");
}
if (championsPage.includes(">Coverage</button>") || !heroAndOverview(championsPage).overview.includes("/midamgolfhq/champions-cup-four-ball/2026-champions-cup-recap")) {
  throw new Error("Champions Cup coverage is still behind a tab");
}
if (dixieHtml.includes(">Coverage</button>") || orangePage.includes(">Coverage</button>")) {
  throw new Error("A hub without articles invented a Coverage tab");
}
const ewingHtml = renderToStaticMarkup(createElement(EwingCupHub, {
  division: "mid-am",
  channelLabel: "midamgolfHQ",
  pastChampions: [],
  entrants: [],
  articles: [{ href: "/midamgolfhq/ewing-cup-four-ball/sample", title: "Ewing preview", date: "2026-11-01", summary: "Existing preview." }],
}));
if (ewingHtml.includes(">Coverage</button>") || !ewingHtml.includes('href="/midamgolfhq/ewing-cup-four-ball/sample"') || !ewingHtml.includes("Ewing preview") || !ewingHtml.includes("54-hole better ball, mid-amateur division.")) {
  throw new Error("Ewing coverage is still behind a tab or the division line changed");
}

console.log(JSON.stringify(summary, null, 2));
console.log("hub inventory tests ok");
