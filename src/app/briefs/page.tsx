import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { loadLatestBriefs } from "@/lib/briefs";
import { monthKeyFromYmd, formatMonthLong } from "@/lib/briefsDates";
import type { DailyBrief } from "@/lib/briefs";

export const metadata = {
  title: "Daily Amateur Golf Briefs (Juniors, Mid-Am, Seniors)",
  description:
    "Daily brief: curated amateur golf headlines across juniors, mid-amateurs, and seniors — tight, wire-style updates with source links.",
  alternates: { canonical: "/briefs" },
};

/* ── helpers ───────────────────────────────────────────────────── */

function shortDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  const dt = new Date(Date.UTC(y, m - 1, d));
  const month = dt.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${month} ${d}`;
}

/** Collect unique tag categories present in a brief's items. */
function briefTags(brief: DailyBrief): string[] {
  const tags = new Set<string>();
  for (const item of brief.items) {
    for (const t of item.tags ?? []) {
      const norm = t.toLowerCase().trim();
      if (norm === "juniors" || norm === "junior") tags.add("juniors");
      else if (norm === "mid-am" || norm === "mid-amateur") tags.add("mid-am");
      else if (norm === "senior" || norm === "seniors") tags.add("senior");
    }
  }
  return Array.from(tags);
}

const TAG_COLORS: Record<string, string> = {
  juniors: "bg-emerald-500",
  "mid-am": "bg-amber-500",
  senior: "bg-indigo-500",
};

const TAG_ORDER = ["juniors", "mid-am", "senior"];

/** Build a short preview string from item titles, joined with · */
function itemPreview(brief: DailyBrief, maxLen = 90): string {
  const titles = brief.items.map((i) => i.title);
  let joined = titles.join(" · ");
  if (joined.length > maxLen) {
    joined = joined.slice(0, maxLen).replace(/\s*·?\s*$/, "") + "…";
  }
  return joined;
}

/* ── page ────────────────────────────────────────────────────── */

export default function BriefsIndexPage() {
  const briefs = loadLatestBriefs(999);

  // Group by month (newest first — loadLatestBriefs already returns newest-first).
  const grouped = new Map<string, DailyBrief[]>();
  for (const b of briefs) {
    const mk = monthKeyFromYmd(b.date);
    if (!mk) continue;
    if (!grouped.has(mk)) grouped.set(mk, []);
    grouped.get(mk)!.push(b);
  }

  const months = Array.from(grouped.keys()); // already in desc order

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Daily Briefs
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Curated amateur golf headlines — juniors, mid-am, and seniors.
          </p>
        </div>

        {months.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">
            No briefs yet.
          </div>
        ) : (
          <div className="space-y-10">
            {months.map((mk) => (
              <section key={mk}>
                {/* Month heading */}
                <h2 className="mb-4 border-b border-zinc-200 pb-2 font-serif text-xl font-semibold tracking-tight text-zinc-950">
                  {formatMonthLong(mk)}
                </h2>

                {/* Brief rows */}
                <div className="space-y-1">
                  {grouped.get(mk)!.map((b) => {
                    const tags = briefTags(b);
                    return (
                      <Link
                        key={b.date}
                        href={`/briefs/${b.date}`}
                        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-zinc-50"
                      >
                        {/* Date column */}
                        <span className="w-14 shrink-0 pt-0.5 text-sm font-medium text-zinc-500 group-hover:text-zinc-700">
                          {shortDate(b.date)}
                        </span>

                        {/* Preview text */}
                        <span className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-700 group-hover:text-zinc-900">
                          {itemPreview(b)}
                        </span>

                        {/* Category dots */}
                        <span className="flex shrink-0 items-center gap-1 pt-1">
                          {TAG_ORDER.filter((t) => tags.includes(t)).map((t) => (
                            <span
                              key={t}
                              className={`inline-block h-2 w-2 rounded-full ${TAG_COLORS[t]}`}
                              title={t}
                            />
                          ))}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
