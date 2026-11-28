import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listJuniorMajorsByMonth } from "@/lib/juniorMajors";
import { resolveDatesLabel } from "@/lib/tournaments/dates";
import { nextEditionLine } from "@/lib/nextEdition";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/structuredData";

const BASE_URL = "https://www.nichegolfhq.com";
const TITLE = "2026 Junior Golf Majors Schedule";
const DESCRIPTION =
  "Dates, venues and results for the 2026 junior golf majors: AJGA invitationals, USGA junior championships and top invitationals, each linked to its event hub.";

export const metadata = {
  title: `${TITLE} | juniorgolfHQ`,
  description: DESCRIPTION,
  alternates: { canonical: "/juniorgolfhq/majors" },
  openGraph: {
    type: "website",
    title: `${TITLE} | juniorgolfHQ`,
    description: DESCRIPTION,
    url: `${BASE_URL}/juniorgolfhq/majors`,
    siteName: "nichegolfHQ",
    images: [{ url: "/og/og-nichegolfhq.png", width: 1200, height: 630, alt: TITLE }],
  },
};

export default function JuniorMajorsIndexPage() {
  const months = listJuniorMajorsByMonth();
  const events = months.flatMap((m) => m.events);

  // Server-rendered so crawlers that do not run scripts still read the list.
  const scheduleLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: TITLE,
    numberOfItems: events.length,
    itemListElement: events.map((e, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: e.name,
      url: `${BASE_URL}/juniorgolfhq/${e.slug}`,
    })),
  };
  const breadcrumbsLd = breadcrumbLd([
    { name: "Home", item: BASE_URL },
    { name: "juniorgolfHQ", item: `${BASE_URL}/juniorgolfhq` },
    { name: "Junior Majors", item: `${BASE_URL}/juniorgolfhq/majors` },
  ]);

  return (
    <SiteShell brandSlug="juniorgolfhq">
      <JsonLd data={scheduleLd} />
      <JsonLd data={breadcrumbsLd} />
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">2026 Junior Golf Majors Schedule</h1>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4">
          {months.map((m) => (
            <section key={m.monthKey} id={m.monthKey} className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">{m.month}</h2>
              </div>

              <div className="mt-4 divide-y divide-zinc-200/70">
                {m.events.map((e) => {
                  const datesLabel = resolveDatesLabel(e.startDate, e.endDate, e.dates2026);
                  const nextLine = nextEditionLine("junior", e.slug, e.startDate);
                  return (
                    <Link key={e.slug} href={`/juniorgolfhq/${e.slug}`} className="block px-1 transition hover:bg-zinc-50">
                      <div className="py-3">
                        <div className="font-serif text-lg font-semibold tracking-tight text-zinc-950">{e.name}</div>
                        {datesLabel ? (
                          <div className="mt-1 text-xs font-semibold text-zinc-700">{datesLabel}</div>
                        ) : null}
                        {nextLine ? <div className="mt-1 text-xs text-zinc-500">{nextLine}</div> : null}
                        {e.note ? <div className="mt-1 text-xs text-zinc-600">{e.note}</div> : null}
                        {e.winners2026 ? (
                          <div className="mt-1 text-xs text-zinc-600">
                            2026 winners: {e.winners2026.boys ? `Boys — ${e.winners2026.boys}` : ""}
                            {e.winners2026.girls ? ` • Girls — ${e.winners2026.girls}` : ""}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
