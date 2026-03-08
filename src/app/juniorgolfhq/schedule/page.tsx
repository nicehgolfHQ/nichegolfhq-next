import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { MajorScheduleCard } from "@/components/majors/MajorScheduleCard";
import { listJuniorMajorsByMonth } from "@/lib/juniorMajors";

export const metadata = {
  title: "Junior Major Schedule \u2014 2026 | juniorgolfHQ",
  description:
    "Junior major schedule for 2026: event hubs and quick links.",
  alternates: { canonical: "/juniorgolfhq/schedule" },
};

export default function JuniorScheduleIndexPage() {
  const groups = listJuniorMajorsByMonth();

  const baseUrl = "https://www.nichegolfhq.com";
  const pageUrl = `${baseUrl}/juniorgolfhq/schedule`;

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "juniorgolfHQ", item: `${baseUrl}/juniorgolfhq` },
      { "@type": "ListItem", position: 3, name: "Junior Major Schedule", item: pageUrl },
    ],
  };

  const events = groups.flatMap((g) => g.events);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Junior Major Schedule",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: events.map((e, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: e.name,
      url: `${baseUrl}/juniorgolfhq/schedule/${e.slug}`,
    })),
  };

  return (
    <SiteShell brandSlug="juniorgolfhq">
      <Script id="ld-breadcrumbs-junior-schedule" type="application/ld+json">
        {JSON.stringify(breadcrumbsLd)}
      </Script>
      <Script id="ld-itemlist-junior-schedule" type="application/ld+json">
        {JSON.stringify(itemListLd)}
      </Script>

      {/* -- Dark Hero -- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-16 text-center">
          <Link
            href="/juniorgolfhq"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition hover:text-white/70"
          >
            <span aria-hidden>&larr;</span>
            <span>juniorgolfHQ</span>
          </Link>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Junior Major Schedule
          </h1>
          <p className="mt-3 text-sm text-white/40">
            Every major junior tournament this season
          </p>
        </div>
      </section>

      {/* -- Event List (white) -- */}
      <div className="bg-zinc-950">
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-10">
          <div className="space-y-12">
            {groups.map((g) => (
              <section key={g.month} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-4 px-1">
                  <div className="h-px flex-1 bg-white/10" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                    {g.month.split(" ")[0].toUpperCase()}
                  </h2>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid gap-3">
                  {g.events.map((e) => (
                    <MajorScheduleCard
                      key={e.slug}
                      href={`/juniorgolfhq/schedule/${e.slug}`}
                      name={e.name}
                      subtitle={e.month}
                      note={e.note}
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
