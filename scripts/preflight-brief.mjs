#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const date = process.argv[2];
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error("Usage: node scripts/preflight-brief.mjs YYYY-MM-DD");
  process.exit(2);
}

const filePath = path.join(process.cwd(), "src", "content", "briefs", `${date}.md`);
if (!fs.existsSync(filePath)) {
  console.error(`preflight: missing file ${filePath}`);
  process.exit(2);
}

const raw = fs.readFileSync(filePath, "utf8");

function parseFrontmatter(md) {
  const trimmed = md.trimStart();
  if (!trimmed.startsWith("---")) return { data: {}, body: md };
  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: md };

  const fmRaw = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).trim();

  const data = {};
  for (const line of fmRaw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1).trim();
    }
    if (k) data[k] = v;
  }
  return { data, body };
}

function parseItems(body) {
  const lines = body.split("\n");
  const items = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const m = line.match(/^\-\s+\[(.+?)\]\((https?:\/\/[^)]+)\)\s+—\s+(.+)$/);
    if (!m) {
      i++;
      continue;
    }

    const title = m[1].trim();
    const url = m[2].trim();
    const source = m[3].trim();

    let why = "";
    let tags;
    const bodyLines = [];

    i++;
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("- [")) break;

      const t = trimmed.match(/^Tags:\s*(.+)$/i);
      if (t) {
        tags = t[1].split(",").map((s) => s.trim()).filter(Boolean);
        i++;
        continue;
      }

      const w = trimmed.match(/^Why:\s*(.+)$/i);
      if (w) {
        why = w[1].trim();
        i++;
        continue;
      }

      if (trimmed) bodyLines.push(trimmed);
      i++;
    }

    if (!why) why = bodyLines.join(" ").trim();

    items.push({ title, url, source, why, tags });
  }

  return items;
}

const { data, body } = parseFrontmatter(raw);
const title = data.title || `Daily Brief — ${date}`;
const items = parseItems(body);

if (!items.length) {
  console.error(`preflight: parsed 0 items for ${date}.md`);
  process.exit(1);
}

if (items.length < 2 || items.length > 4) {
  console.error(`preflight: ${date}.md has ${items.length} items (expected 2–4)`);
  process.exit(1);
}

function formatLongDate(ymd) {
  const [y, m, d] = ymd.split("-").map((n) => Number(n));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mm = months[(m || 1) - 1] || "";
  return `${mm} ${d}, ${y}`;
}

const longDate = formatLongDate(date);

for (const [idx, it] of items.entries()) {
  if (!it.title || !it.url || !it.source) {
    console.error(`preflight: item ${idx + 1} missing title/url/source`);
    process.exit(1);
  }
  if (!/^https?:\/\//.test(it.url)) {
    console.error(`preflight: item ${idx + 1} url not http(s): ${it.url}`);
    process.exit(1);
  }

  // Require the explicit combined date stamp format used by existing briefs:
  // "On Feb 28, 2026 (2026-02-28):"
  const stamp = `on ${longDate.toLowerCase()} (${date}):`;
  const whyLower = (it.why || "").toLowerCase();
  if (!it.why || !whyLower.includes(stamp)) {
    console.error(`preflight: item ${idx + 1} missing explicit in-body date stamp (${longDate} (${date}))`);
    process.exit(1);
  }

  // one clickable link: prevent URLs inside why
  if (/https?:\/\//i.test(it.why)) {
    console.error(`preflight: item ${idx + 1} why contains an extra URL (only 1 clickable link allowed)`);
    process.exit(1);
  }
}

console.log(`preflight: OK ${date} — "${title}" (${items.length} items)`);
