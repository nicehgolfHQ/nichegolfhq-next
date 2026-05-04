import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PhotoCarousel } from "@/components/tournaments/PhotoCarousel";
import {
  getMidAmTournamentArticle,
  listMidAmTournamentArticleParams,
} from "@/lib/tournaments/midam";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return listMidAmTournamentArticleParams();
}

const SITE = "https://www.nichegolfhq.com";

export async function generateMetadata({
  params,
}: {
  params: { slug?: string; article?: string } | Promise<{ slug?: string; article?: string }>;
}): Promise<Metadata> {
  const p: any = await Promise.resolve(params as any);
  const result = getMidAmTournamentArticle(p?.slug ?? "", p?.article ?? "");
  if (!result) return { title: "midamgolfHQ" };
  const { tournament, article } = result;
  const title = `${article.title} | ${tournament.name}`;
  const description = article.summary || `${article.title} — coverage from midamgolfHQ.`;
  const url = `${SITE}/midamgolfhq/${tournament.slug}/${article.slug}`;
  const ogImage = article.photos?.[0] || (tournament.logo ? `${SITE}${tournament.logo}` : undefined);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function MidAmTournamentArticlePage({
  params,
}: {
  params: { slug?: string; article?: string } | Promise<{ slug?: string; article?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const result = getMidAmTournamentArticle(p?.slug ?? "", p?.article ?? "");
  if (!result) notFound();
  const { tournament, article } = result;

  const articleUrl = `${SITE}/midamgolfhq/${tournament.slug}/${article.slug}`;
  const ogImage = article.photos?.[0] || (tournament.logo ? `${SITE}${tournament.logo}` : undefined);

  const newsArticleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary || article.content[0]?.slice(0, 160),
    datePublished: article.date,
    dateModified: article.date,
    author: article.author
      ? { "@type": "Organization", name: article.author }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "midamgolfHQ",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/midamgolfhq/logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    image: ogImage ? [ogImage] : undefined,
    articleSection: tournament.name,
    keywords: [tournament.name, "mid-amateur golf", "amateur golf"],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "midamgolfHQ", item: `${SITE}/midamgolfhq` },
      {
        "@type": "ListItem",
        position: 2,
        name: tournament.name,
        item: `${SITE}/midamgolfhq/${tournament.slug}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  const formattedDate = new Date(article.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <SiteShell brandSlug="midamgolfhq">
      <Script id="ld-news-article" type="application/ld+json">
        {JSON.stringify(newsArticleLd)}
      </Script>
      <Script id="ld-breadcrumb" type="application/ld+json">
        {JSON.stringify(breadcrumbLd)}
      </Script>

      <article className="mx-auto w-full max-w-3xl px-5 py-10 md:py-14">
        <nav className="mb-6 text-sm">
          <Link
            href={`/midamgolfhq/${tournament.slug}`}
            className="inline-flex items-center text-zinc-500 hover:text-zinc-900"
          >
            &larr; Back to {tournament.name}
          </Link>
        </nav>

        {article.photos && article.photos.length > 0 && (
          <div className="mb-6">
            <PhotoCarousel photos={article.photos} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <time dateTime={article.date}>{formattedDate}</time>
          {article.author && (
            <>
              <span className="text-zinc-300">|</span>
              <span>{article.author}</span>
            </>
          )}
        </div>

        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl">
          {article.title}
        </h1>

        {article.summary && (
          <p className="mt-3 text-base font-medium italic text-zinc-600">
            {article.summary}
          </p>
        )}

        <div className="mt-7 space-y-5 text-[17px] leading-8 text-zinc-800">
          {article.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <Link
            href={`/midamgolfhq/${tournament.slug}`}
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            More from {tournament.name} &rarr;
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}
