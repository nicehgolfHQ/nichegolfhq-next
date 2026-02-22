export type MajorEvent = {
  slug: string;
  name: string;
  location?: string;
  course?: string;
  typicalWindow?: string;
  description?: string;
  officialUrl?: string;
  // Year → minimal results metadata (we can expand later)
  years: Array<{
    year: number;
    dates?: string; // e.g. "Feb 19–21, 2026"
    course?: string;
    cityState?: string;
    winners?: {
      midAm?: { name: string; score?: string; rounds?: string };
      senior?: { name: string; score?: string; rounds?: string };
      juniors?: { note?: string };
    };
    sources?: { label: string; url: string }[];
    recap?: string;
  }>;
};

export const MAJOR_EVENTS: MajorEvent[] = [
  {
    slug: "gasparilla-invitational",
    name: "Gasparilla Invitational",
    location: "Tampa, Florida",
    course: "Palma Ceia Golf & Country Club",
    typicalWindow: "February",
    description:
      "A premier early-season invitational in Florida that draws a strong national mid-am field. 54 holes with a cut after 36 holes.",
    years: [
      {
        year: 2026,
        dates: "Feb 19–21, 2026",
        course: "Palma Ceia Golf & Country Club",
        cityState: "Tampa, FL",
        winners: {
          midAm: { name: "Hayes Brown", score: "-2", rounds: "67–73–68" },
          senior: { name: "Jeff Frazier", rounds: "73–73–74" },
        },
        sources: [
          {
            label: "Official scoring (Golf Genius)",
            url: "https://pcgc-71stgasparillainvitational.golfgenius.com/pages/11889495109525324281",
          },
        ],
        recap:
          "Hayes Brown closed in 68 to finish -2 and win the Mid-Am. In the senior division, Jeff Frazier posted three steady rounds to take the title.",
      },
    ],
  },
];

export function getMajorBySlug(slug: string): MajorEvent | null {
  return MAJOR_EVENTS.find((e) => e.slug === slug) ?? null;
}

export function listMajorSlugs(): string[] {
  return MAJOR_EVENTS.map((e) => e.slug);
}

export function listMajorYearParams(): Array<{ slug: string; year: string }> {
  const out: Array<{ slug: string; year: string }> = [];
  for (const e of MAJOR_EVENTS) {
    for (const y of e.years) out.push({ slug: e.slug, year: String(y.year) });
  }
  return out;
}
