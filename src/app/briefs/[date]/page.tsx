import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

// IMPORTANT: read directly from the build-generated JSON.
// This avoids any runtime filesystem reads / dynamic bundling quirks on Vercel.
import briefsData from "@/content/briefs.generated.json";

type DailyBrief = {
  date: string;
  title: string;
  items: Array<{ title: string; url?: string; source: string; why: string; tags?: string[] }>;
};

function getBriefs(): DailyBrief[] {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? (briefs as DailyBrief[]) : [];
}

function topicsFromBrief(brief: DailyBrief): string[] {
  const topics: string[] = [];
  const titles = brief.items.map((it) => it.title.toLowerCase());
  const sources = brief.items.map((it) => it.source.toLowerCase());

  if (titles.some((t) => t.includes("gasparilla"))) topics.push("Gasparilla Results");
  if (sources.some((s) => s.includes("ajga")) || titles.some((t) => t.includes("ajga"))) topics.push("AJGA News");

  // Fallback: map high-level tags into readable topics.
  const tags = new Set((brief.items.flatMap((it) => it.tags ?? []) as string[]).map((t) => t.toLowerCase()));
  if (topics.length === 0) {
    if (tags.has("mid-am")) topics.push("Mid-Am Golf");
    if (tags.has("juniors")) topics.push("Junior Golf");
    if (tags.has("seniors") || tags.has("senior")) topics.push("Senior Golf");
  }

  return topics.slice(0, 2);
}

// Pre-render known brief dates at build time (most reliable on Vercel).
export const dynamicParams = false;

export function generateStaticParams() {
  return getBriefs().map((b) => ({ date: b.date }));
}

export async function generateMetadata({
  params,
}: {
  params: { date?: string } | Promise<{ date?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const raw = p?.date ?? "";
  const normalized = raw.match(/^\d{4}-\d{2}-\d{2}$/)
    ? raw
    : raw.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? raw;

  const brief = getBriefs().find((b) => b.date === normalized) ?? null;
  if (!brief) {
    return {
      title: "Daily Brief | nichegolfHQ",
    };
  }

  const topics = topicsFromBrief(brief);
  const middle = topics.length ? ` | ${topics.join(", ")}` : "";

  return {
    title: `${brief.title}${middle} | nichegolfHQ`,
    description: `Daily Brief for ${brief.date}: ${brief.items.length} items across competitive amateur golf.`,
    alternates: { canonical: `/briefs/${brief.date}` },
    openGraph: {
      title: `${brief.title}${middle} | nichegolfHQ`,
      url: `https://www.nichegolfhq.com/briefs/${brief.date}`,
      type: "article",
    },
  };
}

export default async function BriefPage({
  params,
}: {
  params: { date?: string } | Promise<{ date?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const raw = p?.date ?? "";
  const normalized = raw.match(/^\d{4}-\d{2}-\d{2}$/)
    ? raw
    : raw.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? raw;

  const brief = getBriefs().find((b) => b.date === normalized) ?? null;

  if (!brief) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-5 py-10">
          <Link href="/briefs" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← All briefs
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">Brief not found</h1>
          <p className="mt-3 text-zinc-700">
            We couldn’t find a Daily Brief for <span className="font-medium">{normalized}</span>.
          </p>
        </div>
      </SiteShell>
    );
  }

  const displayDate = brief.title.replace(/^Daily Brief\s+—\s+/i, "");

  // Minimal structured data for LLM / crawler friendliness (no visual impact)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: brief.title,
    datePublished: `${brief.date}T09:00:00-05:00`,
    dateModified: `${brief.date}T09:00:00-05:00`,
    mainEntityOfPage: `https://www.nichegolfhq.com/briefs/${brief.date}`,
    author: { "@type": "Organization", name: "nichegolfHQ" },
    publisher: {
      "@type": "Organization",
      name: "nichegolfHQ",
      logo: { "@type": "ImageObject", url: "https://www.nichegolfhq.com/brand/nichegolfhq/icon.png" },
    },
    description: `Daily Brief: ${brief.items.length} items`,
  };

  return (
    <SiteShell>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="relative px-6 py-6 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
            <div className="relative text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-600">
                <Link href="/briefs" className="inline-flex items-center justify-center gap-2 hover:text-zinc-900">
                  <span aria-hidden>←</span>
                  <span>All briefs</span>
                </Link>
              </div>

              {/* Single-line title */}
              <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                <span className="whitespace-nowrap">Daily Brief</span>
                <span className="mx-2 text-zinc-300" aria-hidden>
                  ·
                </span>
                <span className="whitespace-nowrap text-zinc-700">{displayDate}</span>
              </h1>
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
                      {/* Channel pill (single) */}
                      {primaryTag ? (
                        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-700">
                          {primaryTag === "mid-am"
                            ? "Mid-Am"
                            : primaryTag === "juniors"
                              ? "Juniors"
                              : primaryTag === "senior"
                                ? "Seniors"
                                : primaryTag}
                        </span>
                      ) : null}

                      {it.url && it.source ? (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">{it.source}</span>
                      ) : null}
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                      {it.url ? (
                        <a href={it.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                          {it.title}
                        </a>
                      ) : (
                        <span>{it.title}</span>
                      )}
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-zinc-700">{it.why}</p>

                    {it.url ? (
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
                    ) : null}
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
