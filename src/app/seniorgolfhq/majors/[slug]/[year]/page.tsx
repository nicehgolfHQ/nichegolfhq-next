import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getSeniorMajorBySlug, listSeniorMajorSlugs } from "@/lib/seniorMajors";

export const dynamicParams = false;

export function generateStaticParams() {
  // Start with 2026 only.
  return listSeniorMajorSlugs().map((slug) => ({ slug, year: "2026" }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string; year?: string } | Promise<{ slug?: string; year?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const year = p?.year ?? "";
  const event = getSeniorMajorBySlug(slug);
  if (!event) return { title: "Senior Majors | seniorgolfHQ" };
  return {
    title: `${event.name} ${year} Results | seniorgolfHQ`,
    description: `${event.name} ${year} results, winners, and recap.`,
    alternates: { canonical: `/seniorgolfhq/majors/${event.slug}/${year}` },
  };
}

export default async function SeniorMajorYearPage({
  params,
}: {
  params: { slug?: string; year?: string } | Promise<{ slug?: string; year?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const year = String(p?.year ?? "");
  const event = getSeniorMajorBySlug(slug);
  if (!event || year !== "2026") notFound();

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        <div className="mb-8">
          <Link href={`/seniorgolfhq/majors/${event.slug}`} className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            ← {event.name}
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-zinc-950">
            {event.name} <span className="text-zinc-500">{year}</span>
          </h1>
          <div className="mt-3 text-sm text-zinc-600">{event.month}</div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Winners</h2>
            {event.winners?.length ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">Champion</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-zinc-800">
                    {[...event.winners].sort((a, b) => b.year - a.year).map((r, idx) => (
                      <tr key={r.year + r.champion} className={idx % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                        <td className="px-3 py-3 font-medium text-zinc-900">{r.year}</td>
                        <td className="px-3 py-3 font-semibold text-zinc-950">{r.champion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-700">Winner data TBD.</p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Sources</h2>
            <p className="mt-3 text-sm text-zinc-700">Official links + recap sources coming next.</p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
