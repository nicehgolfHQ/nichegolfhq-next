import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";

// IMPORTANT: read directly from the build-generated JSON.
// This avoids any runtime filesystem reads / dynamic bundling quirks on Vercel.
import briefsData from "@/content/briefs.generated.json";
import { briefSeoDescription, briefSeoTitle } from "@/lib/briefSeo";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/structuredData";

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
      title: { absolute: "Daily Brief | nichegolfHQ" },
    };
  }

  const title = briefSeoTitle(brief);
  const description = briefSeoDescription(brief);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/briefs/${brief.date}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://www.nichegolfhq.com/briefs/${brief.date}`,
      siteName: "nichegolfHQ",
      publishedTime: `${brief.date}T09:00:00-05:00`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  if (!brief) notFound();

  const displayDate = brief.title.replace(/^Daily Brief\s+[-—–]\s+/i, "");

  // Minimal structured data for LLM / crawler friendliness (no visual impact)
  const seoTitle = briefSeoTitle(brief);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: seoTitle,
    datePublished: `${brief.date}T09:00:00-05:00`,
    dateModified: `${brief.date}T09:00:00-05:00`,
    mainEntityOfPage: `https://www.nichegolfhq.com/briefs/${brief.date}`,
    author: { "@type": "Organization", name: "nichegolfHQ" },
    publisher: {
      "@type": "Organization",
      name: "nichegolfHQ",
      logo: { "@type": "ImageObject", url: "https://www.nichegolfhq.com/brand/nichegolfhq/icon.png" },
    },
    description: briefSeoDescription(brief),
    image: [DEFAULT_OG_IMAGE],
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

                      {/* Source pill removed: keep briefs focused on category tag + headline only */}
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

                    {it.url && it.source !== "Results" ? (
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
