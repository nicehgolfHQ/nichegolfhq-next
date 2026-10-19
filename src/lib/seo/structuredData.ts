const SITE = "https://www.nichegolfhq.com";

export const DEFAULT_OG_PATH = "/og/og-nichegolfhq.png";
export const DEFAULT_OG_IMAGE = `${SITE}${DEFAULT_OG_PATH}`;

export function dateOnlyToIso(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return `${date}T12:00:00-05:00`;
  return date;
}

export function breadcrumbLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export function sportsEventLd(input: {
  name: string;
  url: string;
  description: string;
  liveStatus?: string;
  course?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}) {
  const placeName = [input.course, input.location].filter(Boolean).join(", ");
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: input.name,
    url: input.url,
    sport: "Golf",
    description: input.description,
    image: DEFAULT_OG_IMAGE,
  };

  // schema.org has no "completed" event status. Omit eventStatus for finished events
  // so a past tournament is not advertised as still scheduled.
  if (input.liveStatus !== "completed") {
    ld.eventStatus = "https://schema.org/EventScheduled";
  }

  if (placeName) {
    ld.location = {
      "@type": "Place",
      name: placeName,
      ...(input.location ? { address: input.location } : {}),
    };
  }

  if (input.startDate) ld.startDate = input.startDate;
  if (input.endDate) ld.endDate = input.endDate;
  return ld;
}

export function newsArticleLd(input: {
  headline: string;
  description?: string;
  date: string;
  url: string;
  author?: string;
  image: string;
  section?: string;
  keywords?: string[];
  logoUrl: string;
}) {
  const published = dateOnlyToIso(input.date);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    description: input.description,
    datePublished: published,
    dateModified: published,
    author: { "@type": "Organization", name: input.author || "nichegolfHQ" },
    publisher: {
      "@type": "Organization",
      name: "nichegolfHQ",
      url: SITE,
      logo: { "@type": "ImageObject", url: input.logoUrl },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    image: [input.image],
    articleSection: input.section,
    keywords: input.keywords,
  };
}
