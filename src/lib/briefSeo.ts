import { ymdToDateUtc } from "@/lib/briefsDates";

type BriefForSeo = {
  date: string;
  items: Array<{ title: string; why?: string }>;
};

export function briefDateLabel(date: string): string {
  const dt = ymdToDateUtc(date);
  if (!dt) return date;
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "<lead headline> + 2 more | Daily Brief Oct 19, 2026" */
export function briefSeoTitle(brief: BriefForSeo): string {
  const headlines = brief.items.map((it) => it.title.trim()).filter(Boolean);
  const lead = headlines[0] || "Amateur golf";
  const extra = headlines.length > 1 ? ` + ${headlines.length - 1} more` : "";
  return `${lead}${extra} | Daily Brief ${briefDateLabel(brief.date)}`;
}

export function briefSeoDescription(brief: BriefForSeo): string {
  const why = brief.items.find((it) => it.why?.trim())?.why?.trim();
  if (!why) return `Daily Brief for ${briefDateLabel(brief.date)}.`;
  if (why.length <= 200) return why;
  return `${why.slice(0, 197).trimEnd()}...`;
}
