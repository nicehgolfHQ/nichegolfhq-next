import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getMidAmTournamentBySlug, listMidAmTournamentSlugs } from "@/lib/tournaments/midam";
import { TournamentHero } from "@/components/tournaments/TournamentHero";
import { TournamentQuickFacts } from "@/components/tournaments/TournamentQuickFacts";
import { TournamentTabs } from "@/components/tournaments/TournamentTabs";
import { TournamentLinks } from "@/components/tournaments/TournamentLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const t = getMidAmTournamentBySlug(slug);
  if (!t) return { title: "Mid-Am Schedule | midamgolfHQ" };

  const dates = t.dates2026 ?? t.typicalDates;
  const subtitle = `${t.course} • ${t.location}${dates ? ` • ${dates}` : ""}`;

  return {
    title: `${t.name} | Mid-Am Schedule | midamgolfHQ`,
    description: `Dates, venue, format, and past winners for ${t.name}. ${subtitle}`,
    alternates: { canonical: `/midamgolfhq/schedule/${t.slug}` },
  };
}

export default async function MidAmTournamentPage({
  params,
}: {
  params: { slug?: string } | Promise<{ slug?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const slug = p?.slug ?? "";
  const tournament = getMidAmTournamentBySlug(slug);
  if (!tournament) notFound();

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <Link href="/midamgolfhq/schedule" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
          ← Mid-Am Schedule
        </Link>

        <div className="mt-4">
          <TournamentHero tournament={tournament} />
          <TournamentQuickFacts tournament={tournament} />
          <TournamentTabs tournament={tournament} />
          <TournamentLinks tournament={tournament} />
        </div>
      </div>
    </SiteShell>
  );
}
