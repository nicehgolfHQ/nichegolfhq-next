import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { listBriefDates, loadBrief } from "@/lib/briefs";

export const dynamicParams = false;

export function generateStaticParams() {
  return listBriefDates().map((date) => ({ date }));
}

export default function BriefPage({ params }: { params: { date: string } }) {
  const brief = loadBrief(params.date);
  if (!brief) return notFound();

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <div className="mb-8">
          <Link href="/briefs" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← All briefs
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">{brief.title}</h1>
          <div className="mt-2 text-sm text-zinc-500">{brief.date}</div>
        </div>

        <div className="space-y-5">
          {brief.items.map((it, idx) => (
            <article key={`${idx}-${it.url}`} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{it.source}</div>
              <h2 className="mt-2 text-xl font-semibold text-zinc-950">
                <a href={it.url} target="_blank" rel="noreferrer" className="hover:underline">
                  {it.title}
                </a>
              </h2>
              <p className="mt-3 text-zinc-700">{it.why}</p>
              {it.tags && it.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {it.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
