import { MIDAM_TOURNAMENTS } from "../src/data/tournaments/midam";
import { JUNIOR_MAJOR_EVENTS_2026 } from "../src/lib/juniorMajors";
import { SENIOR_MAJOR_EVENTS_2026 } from "../src/lib/seniorMajors";
import {
  HUB_BATCH_1,
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
if (summary.formatHub !== HUB_BATCH_1.length) throw new Error("Batch 1 size drifted");
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

for (const item of HUB_BATCH_1) {
  if (!isFormatHub(item.channel, item.slug)) throw new Error(`${item.slug} is not on the format hub`);
  const row = items.find((entry) => entry.channel === item.channel && entry.slug === item.slug);
  if (!row) throw new Error(`Batch slug missing ${item.slug}`);
  if (row.template !== "format-hub") throw new Error(`${item.slug} template drifted`);
}

if (isFormatHub("midam", "ewing-cup-four-ball") || isFormatHub("senior", "ewing-cup-four-ball")) {
  throw new Error("Ewing was pulled onto the generic format hub");
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

console.log(JSON.stringify(summary, null, 2));
console.log("hub inventory tests ok");
