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
  title: `Mid-Am Schedule — ${YEAR} | midamgolfHQ`,
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

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-start">
            <Link
              href="/midamgolfhq"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white"
            >
              <span aria-hidden>←</span>
              <span>Mid-Am</span>
            </Link>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Mid-Am Major Schedule</h1>
        </div>

        {/* back link removed */}

        <div className="mt-6 space-y-10">
          {months.map((month) => (
            <section key={month} className="scroll-mt-24">
              <div className="mb-4">
                <h2 className="text-center text-sm font-semibold tracking-tight text-zinc-950">
                  {MONTH_NAMES[month - 1]?.toUpperCase()}
                </h2>
              </div>
              <div className="grid gap-4">
                {byMonth[month]!.map((t) => (
                  <TournamentCard key={t.slug} tournament={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
