import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { PhotoCarousel } from "@/components/tournaments/PhotoCarousel";
import {
  getSeniorMajorArticle,
  listSeniorMajorArticleParams,
} from "@/lib/seniorMajors";
import { breadcrumbLd, DEFAULT_OG_IMAGE, newsArticleLd } from "@/lib/seo/structuredData";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSeniorMajorArticleParams();
}

const SITE = "https://www.nichegolfhq.com";

export async function generateMetadata({
  params,
}: {
  params: { slug?: string; article?: string } | Promise<{ slug?: string; article?: string }>;
}): Promise<Metadata> {
  const p: any = await Promise.resolve(params as any);
  const result = getSeniorMajorArticle(p?.slug ?? "", p?.article ?? "");
  if (!result) return { title: "seniorgolfHQ" };
  const { tournament, article } = result;
  const title = `${article.title} | ${tournament.name}`;
  const description = article.summary || `${article.title}. Coverage from seniorgolfHQ.`;
  const url = `${SITE}/seniorgolfhq/${tournament.slug}/${article.slug}`;
  const ogImage = article.photos?.[0] || DEFAULT_OG_IMAGE;
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
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SeniorTournamentArticlePage({
  params,
}: {
  params: { slug?: string; article?: string } | Promise<{ slug?: string; article?: string }>;
}) {
  const p: any = await Promise.resolve(params as any);
  const result = getSeniorMajorArticle(p?.slug ?? "", p?.article ?? "");
  if (!result) notFound();
  const { tournament, article } = result;

  const articleUrl = `${SITE}/seniorgolfhq/${tournament.slug}/${article.slug}`;
  const ogImage = article.photos?.[0] || DEFAULT_OG_IMAGE;

  const articleLd = newsArticleLd({
    headline: article.title,
    description: article.summary || article.content[0]?.slice(0, 160),
    date: article.date,
    url: articleUrl,
    author: article.author,
    image: ogImage,
    section: tournament.name,
    keywords: [tournament.name, "senior golf", "amateur golf"],
    logoUrl: `${SITE}/brand/seniorgolfhq/logo.png`,
  });

  const crumbs = breadcrumbLd([
    { name: "Home", item: SITE },
    { name: "seniorgolfHQ", item: `${SITE}/seniorgolfhq` },
    { name: tournament.name, item: `${SITE}/seniorgolfhq/${tournament.slug}` },
    { name: article.title, item: articleUrl },
  ]);

  const formattedDate = new Date(article.date + "T12:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <SiteShell brandSlug="seniorgolfhq">
      <JsonLd data={articleLd} />
      <JsonLd data={crumbs} />

      <article className="mx-auto w-full max-w-3xl px-5 py-10 md:py-14">
        <nav className="mb-6 text-sm">
          <Link
            href={`/seniorgolfhq/${tournament.slug}`}
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
            <p key={i}>{para.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, j) => { const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/); return m ? <Link key={j} href={m[2]} className="text-emerald-700 hover:text-emerald-800 underline">{m[1]}</Link> : part; })}</p>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <Link
            href={`/seniorgolfhq/${tournament.slug}`}
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            More from {tournament.name} &rarr;
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}

