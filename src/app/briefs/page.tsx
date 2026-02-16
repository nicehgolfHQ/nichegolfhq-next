import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { loadLatestBriefs } from "@/lib/briefs";

export const metadata = {
  title: "Daily Briefs",
  description: "Daily brief: curated competitive amateur golf headlines across juniors, mid-am, and seniors.",
};

export default function BriefsIndexPage() {
  const briefs = loadLatestBriefs(60);

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-6">
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
                className="block rounded-2xl border border-zinc-200 bg-white p-5 hover:border-zinc-300"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-base font-medium text-zinc-950">{b.title}</div>
                  <div className="text-sm text-zinc-500">{b.date}</div>
                </div>
                <div className="mt-2 text-sm text-zinc-600">{b.items.length} items</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </SiteShell>
  );
}
