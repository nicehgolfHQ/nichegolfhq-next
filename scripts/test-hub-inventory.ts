import { MIDAM_TOURNAMENTS } from "../src/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "../src/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "../src/lib/seniorMajors";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormatHub } from "../src/components/hubs/FormatHub";
import { resultSnapshot, snapshotNames } from "../src/data/hubs/batch1-results";
import { assertGasparillaBoard, GASPARILLA_OFFICIAL_RESULTS_URL } from "../src/data/hubs/gasparilla-2026";
import { SOURCE_ACCESS } from "../src/data/hubs/source-access";
import { officialStrokeSnapshot } from "../src/data/hubs/official-stroke";
import provenance from "../src/data/hubs/official/stroke-batch.provenance.json";
import type { Tournament } from "../src/lib/tournaments/types";
import {
  HUB_BATCH_1,
  HUB_BATCH_2,
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
if (summary.formatHub !== HUB_BATCH_1.length + HUB_BATCH_2.length) throw new Error("Format hub count drifted");
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
if (!eastNames.includes("Mike Sposa") || !eastNames.includes("Todd White")) throw new Error("Friday partners were not stored as two players");

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
if (!eastHtml.includes(">Mike Sposa</li>")) throw new Error("Mike Sposa was not rendered as his own player");
if (!eastHtml.includes(">Todd White</li>")) throw new Error("Todd White was not rendered as his own player");
if (eastHtml.includes(">Mike Sposa and Todd White</li>")) throw new Error("A pairing rendered as one field entry");

const championOnly = renderHub(
  {
    slug: "carlton-woods-invitational",
    name: "Carlton Woods Invitational",
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
if (!sangerHtml.includes("Results unavailable here")) throw new Error("Sanger results tab is blank");
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
if (!gasparillaHtml.includes("Final results") || !gasparillaHtml.includes("Updated Nov 8, 2026, 8:55 a.m. CT")) {
  throw new Error("Gasparilla final label or Chicago time missing");
}
if (!gasparillaHtml.includes("Low Senior award") || !gasparillaHtml.includes("Places are the award order")) {
  throw new Error("Senior award is not labeled as an award filter");
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
const tournamentHtml = gasparillaHtml.slice(gasparillaHtml.indexOf('data-board="tournament"'), gasparillaHtml.indexOf('data-board="award"'));
const awardHtml = gasparillaHtml.slice(gasparillaHtml.indexOf('data-board="award"'));
if (!awardHtml.includes("Jeff Frazier") || !awardHtml.includes(">1<") || !awardHtml.includes("Places are the award order")) {
  throw new Error("Award leader is not shown in the award order");
}
const frazierAt = tournamentHtml.indexOf("Jeff Frazier");
const frazierCard = tournamentHtml.slice(Math.max(0, frazierAt - 90), frazierAt);
if (frazierAt < 0 || frazierCard.includes(">1<")) throw new Error("Jeff Frazier tournament place was replaced with the award place");

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
if (!seniorHtml.includes("Low Senior award") || !seniorHtml.includes("also in the tournament field")) {
  throw new Error("Senior hub presents the award as its own field");
}
if (!seniorHtml.includes("/midamgolfhq/gasparilla-invitational")) throw new Error("Senior hub does not link the tournament field");
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
const mounted = ["gasparilla-invitational", "giles-invitational", "the-jupiter-invitational", "the-huddleston-cup", "snedeker-memorial"];
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
if (!jupiter || jupiter.rows[0]?.name !== "Jon Weiss" || jupiter.rows[0]?.total !== 205 || mitchell?.total !== "DNF" || mitchell.rounds.join(",") !== "74,79,") {
  throw new Error("Jupiter board did not keep the DNF card");
}
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
if (!jupiterHtml.includes("Final results") || !jupiterHtml.includes("Jon Weiss") || !jupiterHtml.includes(">DNF<") || jupiterHtml.includes("51 players")) {
  throw new Error("Jupiter hub does not show the checked final board");
}
if (jupiterHtml.includes("Michael McCoy")) throw new Error("Jupiter senior division was added to the mid-am field");

console.log(JSON.stringify(summary, null, 2));
console.log("hub inventory tests ok");
