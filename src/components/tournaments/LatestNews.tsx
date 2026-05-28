import Link from "next/link";
import type { MidAmArticleWithTournament } from "@/lib/tournaments/midam";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function LatestNewsCard({ item }: { item: MidAmArticleWithTournament }) {
  const { article, tournamentName, href } = item;
  return (
    <Link
      href={href}
      className="group/news flex flex-col gap-2 rounded-xl border border-white/10 px-4 py-4 transition hover:border-white/20 hover:bg-white/5"
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span aria-hidden className="text-white/20">
          &bull;
        </span>
        <span className="truncate text-white/50">{tournamentName}</span>
      </div>
      <div className="font-serif text-base font-semibold leading-snug tracking-tight text-white">
        {article.title}
      </div>
      {article.summary ? (
        <div className="line-clamp-2 text-xs leading-5 text-white/60">
          {article.summary}
        </div>
      ) : null}
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

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 drop-shadow-sm">
          Latest News
        </h2>
        <div className="rounded-2xl bg-black/70 p-4 shadow-2xl backdrop-blur-xl">
          <div className="space-y-2">
            {items.map((it) => (
              <LatestNewsCard
                key={`${it.tournamentSlug}/${it.article.slug}`}
                item={it}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            See all news
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
