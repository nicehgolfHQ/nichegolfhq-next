import { MIDAM_TOURNAMENTS } from "../src/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "../src/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "../src/lib/seniorMajors";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormatHub } from "../src/components/hubs/FormatHub";
import { resultSnapshot, snapshotNames } from "../src/data/hubs/batch1-results";
import { assertGasparillaBoard, GASPARILLA_OFFICIAL_RESULTS_URL } from "../src/data/hubs/gasparilla-2026";
import { SOURCE_ACCESS } from "../src/data/hubs/source-access";
import dispute from "../src/data/hubs/official/farrell-final-dispute.json";
import { officialFormatSnapshot } from "../src/data/hubs/official-formats";
import { officialRemainingSnapshot } from "../src/data/hubs/official-remaining";
import remainingAudit from "../src/data/hubs/official/remaining-2026.provenance.json";
import remainingBoards from "../src/data/hubs/official/remaining-2026.public.json";
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
if (summary.formatHub !== HUB_BATCH_1.length + HUB_BATCH_2.length + HUB_BATCH_3.length + HUB_BATCH_4.length + HUB_BATCH_5.length + HUB_BATCH_6.length + HUB_BATCH_7.length) {
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
const publishedRows = remainingBoards.boards.flatMap((board) => board.rows.map((row) => ({ slug: board.slug, row })));
if (publishedRows.length !== 249) throw new Error("The published checked boards are no longer 249 rows");
for (const { slug, row } of publishedRows) {
  const players = "players" in row ? row.players : [];
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
if (!stockerHtml.includes("Full results unavailable here. See Coverage.") || stockerHtml.includes("was found")) {
  throw new Error("Stocker results copy is not hub-scoped");
}
const usgaHtml = renderHub({ slug: "usga-mens-mid-am", name: "USGA Men’s Mid-Am", channel: "midam", month: 10, format: "Match play" }, "midam");
const usgaWomenHtml = renderHub({ slug: "usga-womens-mid-am", name: "USGA Women’s Mid-Am", channel: "midam", month: 9, format: "Match play" }, "midam");
for (const html of [usgaHtml, usgaWomenHtml]) {
  if (!html.includes("Full results unavailable here. See Coverage.") || html.includes("Official scoring was not available")) {
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
if (SENIOR_MAJOR_EVENTS_2026.find((event) => event.slug === "huddleston-cup-senior-division")?.startDate !== "2026-05-26") {
  throw new Error("Huddleston dates were changed from the widget");
}

console.log(JSON.stringify(summary, null, 2));
console.log("hub inventory tests ok");
