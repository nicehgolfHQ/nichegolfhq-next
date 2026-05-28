import Link from "next/link";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { listMidAmArticles } from "@/lib/tournaments/midam";
import type { Metadata } from "next";

export const dynamic = "force-static";

const SITE = "https://www.nichegolfhq.com";

export const metadata: Metadata = {
  title: "Latest Mid-Am News | midamgolfHQ",
  description:
    "Every Mid-Amateur tournament recap, preview, and feature from across the midamgolfHQ schedule, sorted by date.",
  alternates: { canonical: "/midamgolfhq/news" },
};

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MidAmNewsIndexPage() {
  const items = listMidAmArticles();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "midamgolfHQ", item: `${SITE}/midamgolfhq` },
      { "@type": "ListItem", position: 2, name: "News", item: `${SITE}/midamgolfhq/news` },
    ],
  };

  return (
    <SiteShell brandSlug="midamgolfhq">
      <Script id="ld-breadcrumb-midam-news" type="application/ld+json">
        {JSON.stringify(breadcrumbLd)}
      </Script>

      <div className="mx-auto w-full max-w-3xl px-5 py-12 md:py-16">
        <nav className="mb-6 text-sm">
          <Link
            href="/midamgolfhq"
            className="inline-flex items-center text-zinc-500 hover:text-zinc-900"
          >
            &larr; Back to midamgolfHQ
          </Link>
        </nav>

        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Latest News
        </h1>
        <p className="mt-3 text-base text-zinc-600">
          Every Mid-Amateur tournament recap, preview, and feature from across the
          midamgolfHQ schedule.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
            No articles yet. Check back soon.
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-3">
            {items.map((it) => (
              <Link
                key={`${it.tournamentSlug}/${it.article.slug}`}
                href={it.href}
                className="group/news flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  <time dateTime={it.article.date}>{formatDate(it.article.date)}</time>
                  <span aria-hidden className="text-zinc-300">
                    &bull;
                  </span>
                  <span className="text-emerald-700">{it.tournamentName}</span>
                </div>
                <div className="font-serif text-xl font-semibold leading-snug tracking-tight text-zinc-900 group-hover/news:text-zinc-950 md:text-2xl">
                  {it.article.title}
                </div>
                {it.article.summary ? (
                  <div className="text-sm leading-6 text-zinc-600">{it.article.summary}</div>
                ) : null}
                <div className="mt-1 text-sm font-semibold text-emerald-700">
                  Read article &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
