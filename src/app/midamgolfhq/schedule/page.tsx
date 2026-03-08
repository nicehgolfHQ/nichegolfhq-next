import Link from "next/link";
import Image from "next/image";
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

      {/* -- Fixed B&W clock backdrop -- */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/brand/midamgolfhq/IMG_8556.JPG"
          alt=""
          fill
          priority
          className="object-cover object-center grayscale"
          sizes="100vw"
          quality={80}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* -- Hero -- */}
      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto w-full max-w-5xl px-5 pb-12 pt-16 text-center">
          <Link
            href="/midamgolfhq"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-white/70"
          >
            <span aria-hidden>&larr;</span>
            <span>midamgolfHQ</span>
          </Link>

          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Mid-Am Major Schedule
          </h1>
          <p className="mt-3 text-sm text-white/40">
            Every major mid-amateur tournament this season
          </p>
        </div>
      </section>

      {/* -- Tournament List -- */}
      <div className="relative z-10">
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10">
          <div className="space-y-12">
            {months.map((month) => (
              <section key={month} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-4 px-1">
                  <div className="h-px flex-1 bg-white/10" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                    {MONTH_NAMES[month - 1]}
                  </h2>
                  <div className="h-px flex-1 bg-white/10" />
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
