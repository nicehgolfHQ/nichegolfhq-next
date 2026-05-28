import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import type { NewsArticle, Tournament } from "@/lib/tournaments/types";

export interface MidAmArticleWithTournament {
  article: NewsArticle;
  tournamentSlug: string;
  tournamentName: string;
  href: string;
}

export function listMidAmTournaments(): Tournament[] {
  return [...MIDAM_TOURNAMENTS].sort((a, b) => a.month - b.month);
}

export function listMidAmTournamentSlugs(): string[] {
  return listMidAmTournaments().map((t) => t.slug);
}

export function getMidAmTournamentBySlug(slug: string): Tournament | undefined {
  return MIDAM_TOURNAMENTS.find((t) => t.slug === slug);
}

// Returns the first Mid-Am tournament currently flagged as live (or undefined).
// Used by the active-tournament widget on the midamgolfHQ home page.
export function getLiveMidAmTournament(): Tournament | undefined {
  return MIDAM_TOURNAMENTS.find((t) => t.liveStatus === "live") || MIDAM_TOURNAMENTS.find((t) => t.liveStatus === "next");
}

// Returns {tournament, article} for a given tournament slug + article slug, or undefined.
export function getMidAmTournamentArticle(
  tournamentSlug: string,
  articleSlug: string
) {
  const tournament = getMidAmTournamentBySlug(tournamentSlug);
  if (!tournament || !tournament.news) return undefined;
  const article = tournament.news.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { tournament, article };
}

// Returns every Mid-Am news article across all tournaments, sorted newest first.
// Each item carries the tournament context and the final article URL.
export function listMidAmArticles(limit?: number): MidAmArticleWithTournament[] {
  const out: MidAmArticleWithTournament[] = [];
  for (const t of MIDAM_TOURNAMENTS) {
    if (!t.news) continue;
    for (const a of t.news) {
      out.push({
        article: a,
        tournamentSlug: t.slug,
        tournamentName: t.name,
        href: `/midamgolfhq/${t.slug}/${a.slug}`,
      });
    }
  }
  out.sort(
    (a, b) => new Date(b.article.date).getTime() - new Date(a.article.date).getTime()
  );
  return typeof limit === "number" ? out.slice(0, limit) : out;
}

// Returns all (tournamentSlug, articleSlug) pairs for static generation + sitemap.
export function listMidAmTournamentArticleParams(): {
  slug: string;
  article: string;
}[] {
  const out: { slug: string; article: string }[] = [];
  for (const t of MIDAM_TOURNAMENTS) {
    if (!t.news) continue;
    for (const a of t.news) {
      out.push({ slug: t.slug, article: a.slug });
    }
  }
  return out;
}
