"use client";

import Link from "next/link";
import { useState } from "react";
import type { NewsArticle } from "@/lib/tournaments/types";
import { PhotoCarousel } from "./PhotoCarousel";

function ArticleBody({ article }: { article: NewsArticle }) {
  return (
    <>
      {article.photos && article.photos.length > 0 && (
        <PhotoCarousel photos={article.photos} />
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
        <time dateTime={article.date}>
          {new Date(article.date + "T12:00:00").toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </time>
        {article.author && (
          <>
            <span className="text-zinc-300">|</span>
            <span>{article.author}</span>
          </>
        )}
      </div>

      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-zinc-900 md:text-3xl text-center">
        {article.title}
      </h3>

      {article.summary && (
        <p className="mt-2 text-sm font-medium italic text-zinc-600 text-center">
          {article.summary}
        </p>
      )}

      <div className="mt-5 space-y-4 text-[15px] leading-7 text-zinc-700">
        {article.content.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </>
  );
}

export function TournamentNews({
  news,
  articleHrefPrefix,
}: {
  news?: NewsArticle[];
  articleHrefPrefix?: string;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  if (!news || news.length === 0) return null;

  const sorted = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [latest, ...older] = sorted;

  return (
    <section className="mt-10 border-t border-zinc-200 pt-10">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 text-center">
        News
      </h2>

      {/* Most recent article — always expanded */}
      <div className="mt-6">
        <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <ArticleBody article={latest} />
          {articleHrefPrefix && (
            <div className="mt-6 text-center">
              <Link
                href={`${articleHrefPrefix}/${latest.slug}`}
                className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View full article &rarr;
              </Link>
            </div>
          )}
        </article>
      </div>

      {/* Older articles — accordion dropdowns */}
      {older.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {older.map((article) => {
            const isOpen = openSlug === article.slug;
            const shortDate = new Date(
              article.date + "T12:00:00"
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const fullArticleHref = articleHrefPrefix
              ? `${articleHrefPrefix}/${article.slug}`
              : null;

            return (
              <div
                key={article.slug}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenSlug(isOpen ? null : article.slug)
                  }
                  className="flex w-full items-center gap-3 px-6 py-4 text-left hover:bg-zinc-100 transition-colors"
                >
                  <time
                    dateTime={article.date}
                    className="shrink-0 w-[88px] text-xs font-medium text-zinc-500 tabular-nums"
                  >
                    {shortDate}
                  </time>
                  <span className="flex-1 min-w-0 text-sm font-medium text-zinc-900 line-clamp-2">
                    {article.title}
                  </span>
                  <svg
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <ArticleBody article={article} />
                    {fullArticleHref && (
                      <div className="mt-6 text-center">
                        <Link
                          href={fullArticleHref}
                          className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          View full article &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
