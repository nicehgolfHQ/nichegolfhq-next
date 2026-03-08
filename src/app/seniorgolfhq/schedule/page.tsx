import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { MajorScheduleCard } from "@/components/majors/MajorScheduleCard";
import { listSeniorMajorsByMonth } from "@/lib/seniorMajors";

export const metadata = {
  title: "Senior Major Schedule \u2014 2026 | seniorgolfHQ",
  description:
    "Senior major schedule for 2026: event hubs and quick links.",
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

      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-16 text-center">
          <Link
            href="/seniorgolfhq"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-white/70"
          >
            <span aria-hidden>&larr;</span>
            <span>seniorgolfHQ</span>
          </Link>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Senior Major Schedule
          </h1>
          <p className="mt-3 text-sm text-white/40">
            Every major senior tournament this season
          </p>
        </div>
      </section>

      {/* -- Event List (white) -- */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10">
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.month} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-4 px-1">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                    {g.month.split(" ")[0].toUpperCase()}
                  </h2>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="grid gap-3">
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
      </div>
    </SiteShell>
  );
}
