#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

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

  function parsePreferred(startIdx) {
    const line = (lines[startIdx] || "").trim();
    const m = line.match(/^\-\s+\[(.+?)\]\((https?:\/\/[^)]+)\)\s+—\s+(.+)$/);
    if (!m) return null;

    const title = m[1].trim();
    const url = m[2].trim();
    const source = m[3].trim();

    let why = "";
    let tags;
    const bodyLines = [];

    let i = startIdx + 1;
    while (i < lines.length) {
      const trimmed = (lines[i] || "").trim();
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
    if (!why) why = "(brief pending)";

    return { item: { title, url, source, why, tags }, nextIdx: i };
  }

  function parseFallback(startIdx) {
    const first = (lines[startIdx] || "").trim();
    if (!first.startsWith("- ")) return null;
    if (first.startsWith("- [")) return null;

    const title = first.replace(/^\-\s+/, "").trim();

    let url = "";
    let source = "";
    let tags;
    const bodyLines = [];

    let i = startIdx + 1;
    while (i < lines.length) {
      const trimmed = (lines[i] || "").trim();
      if (trimmed.startsWith("- ")) break;

      const src = trimmed.match(/^Source:\s*(https?:\/\/\S+)/i);
      if (src) {
        url = src[1].trim();
        try {
          source = new URL(url).hostname.replace(/^www\./, "");
        } catch {
          source = "Source";
        }
        i++;
        continue;
      }

      const t = trimmed.match(/^Tags:\s*(.+)$/i);
      if (t) {
        tags = t[1].split(",").map((s) => s.trim()).filter(Boolean);
        i++;
        continue;
      }

      if (trimmed) bodyLines.push(trimmed);
      i++;
    }

    if (!url) return { item: null, nextIdx: i };

    const why = bodyLines.join(" ").trim() || "(brief pending)";

    return { item: { title, url, source: source || "Source", why, tags }, nextIdx: i };
  }

  let i = 0;
  while (i < lines.length) {
    const preferred = parsePreferred(i);
    if (preferred) {
      items.push(preferred.item);
      i = preferred.nextIdx;
      continue;
    }

    const fallback = parseFallback(i);
    if (fallback) {
      if (fallback.item) items.push(fallback.item);
      i = fallback.nextIdx;
      continue;
    }

    i++;
  }

  return items;
}

function firstExistingDir(candidates) {
  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir)) return dir;
    } catch {
      // ignore
    }
  }
  return null;
}

const cwd = process.cwd();
const briefsDir = firstExistingDir([
  path.join(cwd, "src", "content", "briefs"),
  path.join(cwd, "nichegolfhq-next", "src", "content", "briefs"),
]);

if (!briefsDir) {
  console.error("build-briefs: could not find briefs dir");
  process.exit(1);
}

const outPath = path.join(cwd, "src", "content", "briefs.generated.json");

const files = fs
  .readdirSync(briefsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""))
  .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  .sort((a, b) => (a < b ? 1 : -1));

const briefs = [];
for (const date of files) {
  const filePath = path.join(briefsDir, `${date}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const title = data.title || `Daily Brief — ${date}`;
  const items = parseItems(body);
  if (!Array.isArray(items) || items.length === 0) {
    console.error(`build-briefs: ERROR ${date}.md parsed 0 items. Check formatting.`);
    process.exit(1);
  }
  briefs.push({ date, title, items });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ briefs }, null, 2) + "\n", "utf8");

console.log(`build-briefs: wrote ${briefs.length} briefs to ${outPath}`);
