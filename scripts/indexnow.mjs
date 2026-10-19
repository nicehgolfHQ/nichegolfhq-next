#!/usr/bin/env node
/**
 * Ping IndexNow for one or more nichegolfHQ URLs.
 *
 *   npm run indexnow -- https://www.nichegolfhq.com/briefs/2026-10-19
 *   npm run indexnow -- /briefs/2026-10-19 /midamgolfhq/the-berkeley-cup
 *
 * Paths are expanded to https://www.nichegolfhq.com. The IndexNow key is the
 * public key file in /public. This script talks to IndexNow directly.
 * The /api/indexnow route is separate and requires INDEXNOW_SECRET.
 */
import { readFileSync } from "node:fs";

const KEY = readFileSync(
  new URL("../public/ec120083fab42ae247b1f28b18a8807c.txt", import.meta.url),
  "utf8"
).trim();
const HOST = "www.nichegolfhq.com";
const ORIGIN = `https://${HOST}`;

const raw = process.argv.slice(2).filter((arg) => arg !== "--");
if (raw.length === 0) {
  console.error("Usage: npm run indexnow -- <url-or-path> [more...]");
  console.error("Example: npm run indexnow -- /briefs/2026-10-19");
  process.exit(1);
}

const urls = raw.map((value) => {
  if (value.startsWith("https://") || value.startsWith("http://")) return value;
  if (value.startsWith("/")) return `${ORIGIN}${value}`;
  return `${ORIGIN}/${value}`;
});

const bad = urls.filter((url) => {
  try {
    return new URL(url).hostname !== HOST;
  } catch {
    return true;
  }
});

if (bad.length > 0) {
  console.error("Refusing URLs that are not on www.nichegolfhq.com:");
  for (const url of bad) console.error(`  ${url}`);
  process.exit(1);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList: urls,
  }),
});

const body = await response.text();
if (!response.ok) {
  console.error(`IndexNow failed: ${response.status} ${body}`);
  process.exit(1);
}

console.log(`IndexNow accepted ${urls.length} URL(s) (${response.status}).`);
for (const url of urls) console.log(`  ${url}`);
