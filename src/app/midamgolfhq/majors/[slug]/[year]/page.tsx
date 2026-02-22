import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getMajorBySlug, listMajorYearParams } from "@/lib/majors";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMajorYearParams();
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string; year?: string } | Promise<{ slug?: string; year?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const year = Number(p?.year ?? "");
  const event = getMajorBySlug(slug);
  const y = event?.years.find((yy) => yy.year === year);

  if (!event || !y) return { title: "Mid-Am Majors | midamgolfHQ" };

  const topics: string[] = [];
  if (y.winners?.midAm) topics.push("Mid-Am Results");
  if (y.winners?.senior) topics.push("Senior Results");

  const middle = topics.length ? ` | ${topics.join(", ")}` : "";

  return {
    title: `${event.name} ${y.year} Results${middle} | midamgolfHQ`,
    description: `${event.name} ${y.year} results, winners, and recap.`,
    alternates: { canonical: `/midamgolfhq/majors/${event.slug}/${y.year}` },
  };
}

export default async function MajorYearPage({
  params,
}: {
  params: { slug?: string; year?: string } | Promise<{ slug?: string; year?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const year = Number(p?.year ?? "");
  const event = getMajorBySlug(slug);
  const y = event?.years.find((yy) => yy.year === year) ?? null;

  if (!event || !y) notFound();

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        <div className="mb-8">
          <Link href={`/midamgolfhq/majors/${event.slug}`} className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← {event.name}
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
            {event.name} <span className="text-zinc-500">{y.year}</span>
          </h1>
          <div className="mt-3 text-sm text-zinc-600">
            {y.dates ? `${y.dates} • ` : ""}
            {y.course ? `${y.course} • ` : ""}
            {y.cityState ?? ""}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Winners</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {y.winners?.midAm ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-xs font-medium text-zinc-500">Mid-Am Champion</div>
                  <div className="mt-1 text-xl font-semibold text-zinc-950">{y.winners.midAm.name}</div>
                  <div className="mt-2 text-sm text-zinc-700">
                    {y.winners.midAm.rounds ? `Rounds: ${y.winners.midAm.rounds}` : ""}
                    {y.winners.midAm.score ? ` • To par: ${y.winners.midAm.score}` : ""}
                  </div>
                </div>
              ) : null}

              {y.winners?.senior ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-xs font-medium text-zinc-500">Senior Champion</div>
                  <div className="mt-1 text-xl font-semibold text-zinc-950">{y.winners.senior.name}</div>
                  <div className="mt-2 text-sm text-zinc-700">
                    {y.winners.senior.rounds ? `Rounds: ${y.winners.senior.rounds}` : ""}
                    {y.winners.senior.score ? ` • To par: ${y.winners.senior.score}` : ""}
                  </div>
                </div>
              ) : null}
            </div>

            {y.recap ? <p className="mt-4 text-sm leading-relaxed text-zinc-700">{y.recap}</p> : null}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Sources</h2>
            <div className="mt-3 space-y-2">
              {(y.sources ?? []).map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 hover:border-zinc-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              We’ll keep the year pages focused on results + context, and link to Daily Briefs as supporting coverage.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
