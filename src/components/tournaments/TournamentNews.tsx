import type { NewsArticle } from "@/lib/tournaments/types";

export function TournamentNews({ news }: { news?: NewsArticle[] }) {
  if (!news || news.length === 0) return null;

  return (
    <section className="mt-10 border-t border-zinc-200 pt-10">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">
        News
      </h2>

      <div className="mt-6 flex flex-col gap-8">
        {news
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
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

              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-zinc-900 md:text-3xl">
                {article.title}
              </h3>

              {article.summary && (
                <p className="mt-2 text-sm font-medium italic text-zinc-600">
                  {article.summary}
                </p>
              )}

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-zinc-700">
                {article.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
