import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { getMidAmTournamentBySlug } from "@/lib/tournaments/midam";
import { HubMockup, type CoverageArticle } from "./HubMockup";
import { verifyEastWestMock } from "./data";

export const metadata: Metadata = {
  title: "East vs West hub concept, not live",
  description: "Design review mockup. Not live scores and not the published East vs West hub.",
  robots: { index: false, follow: false },
};

const ARTICLE_SLUGS = [
  "2026-east-vs-west-matches-day-2-recap",
  "2026-east-vs-west-matches-day-1-recap",
  "2026-east-vs-west-matches-preview",
];

export default function EastVsWestHubConceptPage() {
  verifyEastWestMock();
  const tournament = getMidAmTournamentBySlug("east-vs-west-matches");
  const articles: CoverageArticle[] = ARTICLE_SLUGS.flatMap((slug) => {
    const article = tournament?.news?.find((item) => item.slug === slug);
    if (!article) return [];
    return [
      {
        href: `/midamgolfhq/east-vs-west-matches/${article.slug}`,
        title: article.title,
        date: article.date,
        summary: article.summary ?? "",
        text: [article.title, article.summary ?? "", ...article.content].join(" "),
      },
    ];
  });

  return (
    <SiteShell brandSlug="midamgolfhq">
      <HubMockup articles={articles} />
    </SiteShell>
  );
}
