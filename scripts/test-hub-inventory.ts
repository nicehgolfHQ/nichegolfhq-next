import { MIDAM_TOURNAMENTS } from "../src/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "../src/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "../src/lib/seniorMajors";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormatHub } from "../src/components/hubs/FormatHub";
import { resultSnapshot, snapshotNames } from "../src/data/hubs/batch1-results";
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

for (const slug of ["gasparilla-invitational", "junior-orange-bowl", "society-of-seniors-spring-classic", "walter-j-travis-invitational", "east-vs-west-matches"]) {
  const snapshot = resultSnapshot(slug);
  if (!snapshot) throw new Error(`${slug} has no sourced snapshot`);
  if (snapshot.complete) throw new Error(`${slug} snapshot claims a complete field`);
  if (snapshot.sources.length === 0) throw new Error(`${slug} snapshot has no source`);
}
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
    slug: "snedeker-memorial",
    name: "Snedeker Memorial",
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

console.log(JSON.stringify(summary, null, 2));
console.log("hub inventory tests ok");
