import Link from "next/link";
import type { MidAmArticleWithTournament } from "@/lib/tournaments/midam";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function FeaturedCard({ item }: { item: MidAmArticleWithTournament }) {
  const { article, tournamentName, href } = item;
  return (
    <Link
      href={href}
      className="group/news flex flex-col items-center rounded-2xl bg-black/70 p-6 text-center shadow-2xl backdrop-blur-xl transition hover:bg-black/80"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden className="text-white/20">
          &bull;
        </span>
        <span className="truncate text-white/60">{tournamentName}</span>
      </div>
      <h3 className="mt-3 font-serif text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl">
        {article.title}
      </h3>
      {article.summary ? (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
          {article.summary}
        </p>
      ) : null}
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white/70 transition group-hover/news:text-white">
        Read article
        <span
          aria-hidden
          className="transition-transform group-hover/news:translate-x-0.5"
        >
          &rarr;
        </span>
      </span>
    </Link>
  );
}

function MoreRow({ item }: { item: MidAmArticleWithTournament }) {
  const { article, tournamentName, href } = item;
  return (
    <Link
      href={href}
      className="group/row flex flex-col items-center gap-1 rounded-xl border border-white/10 px-4 py-3 text-center transition hover:border-white/20 hover:bg-white/5"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
        <time dateTime={article.date} className="tabular-nums">
          {formatDate(article.date)}
        </time>
        <span aria-hidden className="text-white/20">
          &bull;
        </span>
        <span className="truncate text-white/40">{tournamentName}</span>
      </div>
      <div className="line-clamp-2 text-sm font-medium leading-snug text-white">
        {article.title}
      </div>
    </Link>
  );
}

export function LatestNewsSection({
  items,
  seeAllHref,
}: {
  items: MidAmArticleWithTournament[];
  seeAllHref: string;
}) {
  if (items.length === 0) return null;

  const [featured, ...rest] = items;

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 drop-shadow-sm">
          Latest News
        </h2>

        <FeaturedCard item={featured} />

        {rest.length > 0 ? (
          <details className="group mt-4" id="latest-news-more">
            <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:border-white/30 hover:text-white">
              <span>
                More news <span className="text-white/40">({rest.length})</span>
              </span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
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
            </summary>

            <div className="mt-4 space-y-2 rounded-2xl bg-black/60 p-3 backdrop-blur-md">
              {rest.map((it) => (
                <MoreRow
                  key={`${it.tournamentSlug}/${it.article.slug}`}
                  item={it}
                />
              ))}
              <div className="pt-2 text-center">
                <Link
                  href={seeAllHref}
                  className="inline-flex items-center gap-1 text-xs font-medium text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
                >
                  See all news
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </div>
          </details>
        ) : (
          <div className="mt-4 text-center">
            <Link
              href={seeAllHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:border-white/30 hover:text-white"
            >
              See all news
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
