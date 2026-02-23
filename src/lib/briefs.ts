import fs from "node:fs";
import path from "node:path";

// Prefer build-time generated JSON (works reliably on Vercel).
// Fallback to filesystem reads during local dev.
import briefsData from "@/content/briefs.generated.json";

export type BriefItem = {
  title: string;
  url: string;
  source: string;
  why: string;
  tags?: string[];
};

export type DailyBrief = {
  date: string; // YYYY-MM-DD
  title: string;
  items: BriefItem[];
};

// Filesystem fallback (local dev only).
const BRIEFS_DIR = path.join(process.cwd(), "src", "content", "briefs");

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function parseFrontmatter(md: string): { data: Record<string, string>; body: string } {
  const trimmed = md.trimStart();
  if (!trimmed.startsWith("---")) return { data: {}, body: md };

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: md };

  const fmRaw = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).trim();

  const data: Record<string, string> = {};
  for (const line of fmRaw.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();

    // Strip simple wrapping quotes (Beehiiv/LLM sometimes adds these).
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1).trim();
    }

    if (k) data[k] = v;
  }
  return { data, body };
}

function parseItems(body: string): BriefItem[] {
  // Very simple format:
  // - [Title](URL) — Source
  //   Why: ...
  //   Tags: a, b
  const lines = body.split("\n");
  const items: BriefItem[] = [];

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
    let tags: string[] | undefined;
    const bodyLines: string[] = [];

    i++;
    while (i < lines.length) {
      const l = lines[i];
      const trimmed = l.trim();
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

      // Support no-"Why:" format: treat any indented continuation text as the body.
      if (trimmed) bodyLines.push(trimmed);
      i++;
    }

    // Prefer explicit Why:, else use joined body lines.
    if (!why) why = bodyLines.join(" ").trim();
    if (!why) why = "(brief pending)";

    items.push({ title, url, source, why, tags });
  }

  return items;
}

function getGeneratedBriefs(): any[] | null {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? briefs : null;
}

export function listBriefDates(): string[] {
  const briefs = getGeneratedBriefs();
  const fromJson = briefs?.map((b: any) => b.date).filter(Boolean);
  if (Array.isArray(fromJson) && fromJson.length > 0) {
    return [...fromJson].sort((a, b) => (a < b ? 1 : -1));
  }

  const files = safeReadDir(BRIEFS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));

  files.sort((a, b) => (a < b ? 1 : -1));
  return files;
}

export function loadBrief(date: string): DailyBrief | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const briefs = getGeneratedBriefs();
  const fromJson = briefs?.find((b: any) => b.date === date);
  if (fromJson) return fromJson as DailyBrief;

  const filePath = path.join(BRIEFS_DIR, `${date}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const title = data.title || `Daily Brief — ${date}`;
  const items = parseItems(body);

  return { date, title, items };
}

export function loadLatestBriefs(limit = 30): DailyBrief[] {
  const dates = listBriefDates().slice(0, limit);
  return dates.map((d) => loadBrief(d)).filter(Boolean) as DailyBrief[];
}
