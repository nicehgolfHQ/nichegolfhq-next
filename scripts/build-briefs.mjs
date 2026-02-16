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
    const v = line.slice(idx + 1).trim();
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

    i++;
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim().startsWith("- [")) break;
      const w = l.trim().match(/^Why:\s*(.+)$/i);
      if (w) why = w[1].trim();
      const t = l.trim().match(/^Tags:\s*(.+)$/i);
      if (t) tags = t[1].split(",").map((s) => s.trim()).filter(Boolean);
      i++;
    }

    if (!why) why = "(brief pending)";
    items.push({ title, url, source, why, tags });
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
  briefs.push({ date, title, items });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ briefs }, null, 2) + "\n", "utf8");

console.log(`build-briefs: wrote ${briefs.length} briefs to ${outPath}`);
