import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates, loadBrief } from "@/lib/briefs";

// Dynamic SSR so we don't keep serving a pre-rendered fallback when new briefs are added.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function BriefPage({ params }: { params: { date: string } }) {
  const raw = params?.date ?? "";
  const normalized = raw.match(/^\d{4}-\d{2}-\d{2}$/)
    ? raw
    : raw.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? raw;

  // Use normalized date first; if that fails, fall back to the latest known date.
  const dates = listBriefDates();
  const brief = loadBrief(normalized) ?? (dates[0] ? loadBrief(dates[0]) : null);

  if (!brief) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-5 py-10">
          <Link href="/briefs" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← All briefs
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">No briefs yet</h1>
          <p className="mt-3 text-zinc-700">There aren’t any daily briefs published yet.</p>
        </div>
      </SiteShell>
    );
  }

  const itemsCount = brief.items.length;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="relative px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
            <div className="relative">
              <Link href="/briefs" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
                <span aria-hidden>←</span>
                <span>All briefs</span>
              </Link>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                    {brief.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">{brief.date}</span>
                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">{itemsCount} items</span>
                  </div>
                </div>

                {/* Tasteful “image” (no external fetch): subtle golfy art tile */}
                <div className="hidden h-24 w-24 shrink-0 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-sm sm:block">
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-widest text-white/80">
                    brief
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-6">
          {brief.items.map((it, idx) => {
            const primaryTag = it.tags?.[0];
            const accent =
              primaryTag === "juniors"
                ? "bg-emerald-500"
                : primaryTag === "senior"
                  ? "bg-indigo-500"
                  : primaryTag === "mid-am"
                    ? "bg-amber-500"
                    : "bg-zinc-300";

            return (
              <article
                key={`${idx}-${it.url}`}
                className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300"
              >
                <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">{it.source}</span>
                      {it.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-zinc-600">
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                      <a href={it.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                        {it.title}
                      </a>
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-zinc-700">{it.why}</p>

                    <div className="mt-4">
                      <a
                        href={it.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-700"
                      >
                        <span>Read source</span>
                        <span aria-hidden className="transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* optional small art tile */}
                  <div className="hidden h-24 w-24 shrink-0 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 sm:block" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}


