import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { MajorScheduleCard } from "@/components/majors/MajorScheduleCard";
import { listSeniorMajorsByMonth } from "@/lib/seniorMajors";

export const metadata = {
  title: "Senior Major Schedule — 2026 | seniorgolfHQ",
  description: "Senior major schedule for 2026: event hubs and quick links.",
  alternates: { canonical: "/seniorgolfhq/schedule" },
};

export default function SeniorScheduleIndexPage() {
  const groups = listSeniorMajorsByMonth();

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/seniorgolfhq/schedule`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "seniorgolfHQ", item: `${baseUrl}/seniorgolfhq` },
      { "@type": "ListItem", position: 3, name: "Senior Major Schedule", item: pageUrl },
    ],
  };

  const events = groups.flatMap((g) => g.events);
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Senior Major Schedule",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: events.map((e, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: e.name,
      url: `${baseUrl}/seniorgolfhq/schedule/${e.slug}`,
    })),
  };

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <Script id="ld-breadcrumbs-senior-schedule" type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id="ld-itemlist-senior-schedule" type="application/ld+json">
        {JSON.stringify(itemListLd)}
      </Script>

      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-start">
            <Link
              href="/seniorgolfhq"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white"
            >
              <span aria-hidden>←</span>
              <span>Senior</span>
            </Link>
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Senior Major Schedule</h1>
        </div>

        <div className="mt-6 space-y-10">
          {groups.map((g) => (
            <section key={g.month} className="scroll-mt-24">
              <div className="mb-4">
                <h2 className="text-center text-sm font-semibold tracking-tight text-zinc-950">{g.month.split(" ")[0].toUpperCase()}</h2>
              </div>
              <div className="grid gap-4">
                {g.events.map((e) => (
                  <MajorScheduleCard
                    key={e.slug}
                    href={`/seniorgolfhq/schedule/${e.slug}`}
                    name={e.name}
                    subtitle={e.month}
                    note={e.note}
                    badge={e.format}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
