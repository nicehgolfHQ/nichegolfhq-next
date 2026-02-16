import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { loadLatestBriefs } from "@/lib/briefs";

export const metadata = {
  title: "Daily Briefs",
  description: "Daily brief: curated competitive amateur golf headlines across juniors, mid-am, and seniors.",
};

function ordinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "st";
  if (mod10 === 2 && mod100 !== 12) return "nd";
  if (mod10 === 3 && mod100 !== 13) return "rd";
  return "th";
}

function formatBriefDate(date: string) {
  // date: YYYY-MM-DD
  const [y, m, d] = date.split("-").map((x) => Number(x));
  if (!y || !m || !d) return date;
  const dt = new Date(Date.UTC(y, m - 1, d));
  const month = dt.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  return `${month} ${d}${ordinal(d)}, ${y}`;
}

export default function BriefsIndexPage() {
  const briefs = loadLatestBriefs(60);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Daily Briefs</h1>
        </div>

        <div className="space-y-3">
          {briefs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-700">
              No briefs yet.
            </div>
          ) : (
            briefs.map((b) => (
              <Link
                key={b.date}
                href={`/briefs/${b.date}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 text-center hover:border-zinc-300"
              >
                <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                  {formatBriefDate(b.date)}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </SiteShell>
  );
}
