import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { listMidAmTournaments } from "@/lib/tournaments/midam";
import { TournamentCard } from "@/components/tournaments/TournamentCard";

const YEAR = 2026;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const metadata = {
  title: `Mid-Am Schedule \u2014 ${YEAR} | midamgolfHQ`,
  description: `Mid-amateur tournament schedule for ${YEAR}: event hubs, formats, venues, and quick links.`,
  alternates: { canonical: "/midamgolfhq/schedule" },
};

export default function MidAmScheduleIndexPage() {
  const tournaments = listMidAmTournaments();

  const byMonth = tournaments.reduce<Record<number, typeof tournaments>>((acc, t) => {
    acc[t.month] = acc[t.month] ?? [];
    acc[t.month].push(t);
    return acc;
  }, {});

  const months = Object.keys(byMonth)
    .map((m) => Number(m))
    .sort((a, b) => a - b);

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/midamgolfhq/schedule`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "midamgolfHQ", item: `${baseUrl}/midamgolfhq` },
      { "@type": "ListItem", position: 3, name: "Mid-Am Major Schedule", item: pageUrl },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mid-Am Major Schedule",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: tournaments.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.name,
      url: `${baseUrl}/midamgolfhq/schedule/${t.slug}`,
    })),
  };

  return (
    <SiteShell>
      <Script id="ld-breadcrumbs-midam-schedule" type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id="ld-itemlist-midam-schedule" type="application/ld+json">
        {JSON.stringify(itemListLd)}
      </Script>

      {/* \u2500\u2500 Dark Hero \u2500\u2500 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-16 text-center">
          <Link
            href="/midamgolfhq"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-white/70"
          >
            <span aria-hidden>\u2190</span>
            <span>midamgolfHQ</span>
          </Link>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Mid-Am Major Schedule
          </h1>
          <p className="mt-3 text-sm text-white/40">
            Every major mid-amateur tournament this season
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* \u2500\u2500 Tournament List \u2500\u2500 */}
      <div className="bg-black">
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8">
          <div className="space-y-12">
            {months.map((month) => (
              <section key={month} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-4 px-1">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                    {MONTH_NAMES[month - 1]}
                  </h2>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>
                <div className="grid gap-3">
                  {byMonth[month]!.map((t) => (
                    <TournamentCard key={t.slug} tournament={t} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
