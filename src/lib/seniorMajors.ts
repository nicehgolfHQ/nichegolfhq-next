import type { HowToPlayEntry, NewsArticle } from "@/lib/tournaments/types";

export type SeniorMajorEvent = {
  slug: string;
  name: string;
  month: string; // e.g. "February 2026" or "Aug/Sep 2026"
  format?: string; // short label used on schedule + hubs (match Mid-Am style)
  note?: string;
  officialUrl?: string;
  winners?: { year: number; champion: string }[];
  howToPlay?: HowToPlayEntry[];
  // Venue
  course?: string;
  location?: string;
  coursePar?: number;
  courseYardage?: number;
  courseDesigner?: string;
  // Format
  fieldSize?: string;
  eligibility?: string;
  // Editorial
  overview?: string;
  // History (richer than winners[])
  pastResults?: { year: number; champion: string; score?: string; runnerUp?: string }[];
  // News
  news?: NewsArticle[];
};

export const SENIOR_MAJOR_EVENTS_2026: SeniorMajorEvent[] = [
  {
    slug: "society-of-seniors-spring-classic",
    name: "Society of Seniors: Spring Classic",
    month: "February 2026",
    format: "54-hole stroke play",
    course: "Aileron Golf Club",
    location: "Lake Suzy, FL",
    coursePar: 72,
    courseYardage: 7235,
    courseDesigner: "Ron Garl (orig. 1976); redesigned Kipp Schulties (2023)",
    note: "Rotating venue; 2026 host: Aileron Golf Club, Lake Suzy, FL",
    overview: "The Society of Seniors Spring Classic opens the SOS annual schedule and draws elite 55+ amateurs to rotating Florida venues each February. Founded in 1983, the Society of Seniors stages ten events annually across the country, and the Spring Classic has served as a premier season-opener for four-plus decades. The 2026 edition (18th) was hosted at the recently redesigned Aileron Golf Club in Lake Suzy.",
    winners: [
      { year: 2026, champion: "William Mallon" },
      { year: 2025, champion: "Doug Hanzel" },
      { year: 2024, champion: "Paul Simson" },
      { year: 2023, champion: "Chip Lutz" },
      { year: 2022, champion: "Bob Royak" },
      { year: 2021, champion: "Doug Hanzel" },
      { year: 2020, champion: "Gene Elliott" },
    ],
    howToPlay: [{ label: "Apply for invite", href: "https://www.societyofseniors.com/membership/" }],
  },
  {
    slug: "gasparilla-invitational-senior-division",
    name: "Gasparilla Invitational (Senior Division)",
    month: "February 2026",
    format: "54-hole stroke play",
    course: "Palma Ceia Golf & Country Club",
    location: "Tampa, FL",
    coursePar: 70,
    courseYardage: 6211,
    courseDesigner: "Donald Ross (redesign 1923)",
    overview: "The Gasparilla Invitational has been played at historic Palma Ceia Golf & Country Club in Tampa since the 1930s, making it one of Florida's oldest and most storied amateur events. Donald Ross's compact par-70 demands precision over power, with tight tree-lined fairways and small undulating greens. The senior division attracts the country's finest 55+ amateurs each February.",
    winners: [
      { year: 2026, champion: "Jeff Frazier" },
      { year: 2025, champion: "Miles McConnell" },
      { year: 2024, champion: "Miles McConnell" },
      { year: 2023, champion: "Rusty Strawn" },
      { year: 2022, champion: "Bob Royak" },
      { year: 2021, champion: "Jack Hall" },
      { year: 2020, champion: "Jimmy Jones" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "jones-cup-senior-invitational",
    name: "Jones Cup Senior Invitational",
    month: "February 2026",
    format: "54-hole stroke play",
    course: "Sea Island Golf Club (Seaside Course)",
    location: "St. Simons Island, GA",
    coursePar: 70,
    courseYardage: 6945,
    courseDesigner: "Harry Colt & Charles Alison (1929); Tom Fazio renovation (1999)",
    overview: "The Jones Cup Senior Invitational is played on the iconic Seaside Course at Sea Island Golf Club \u2014 a storied coastal Georgia layout that melds original Colt-Alison architecture with a Fazio renovation. Part of the prestigious Jones Cup family, the senior event attracts elite 55+ amateurs to one of America\u2019s most celebrated golf destinations each February.",
    winners: [
      { year: 2026, champion: "Michael McCoy" },
      { year: 2025, champion: "Jeff Knox" },
      { year: 2024, champion: "Jack Larkin" },
      { year: 2023, champion: "Bob Royak" },
      { year: 2022, champion: "Matthew Sughrue" },
      { year: 2021, champion: "Doug Hanzel" },
      { year: 2020, champion: "Bob Royak" },
      { year: 2019, champion: "Doug Hanzel" },
      { year: 2018, champion: "Gene Elliott" },
      { year: 2017, champion: "Walter Todd" },
      { year: 2016, champion: "Mark Weston" },
      { year: 2015, champion: "Jack Hall" },
      { year: 2014, champion: "Doug Hanzel" },
      { year: 2013, champion: "Mike Bodney" },
      { year: 2012, champion: "Doug Hanzel" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "golfweek-senior-amateur-championship",
    name: "Golfweek Senior Amateur Championship",
    month: "March/April 2026",
    format: "72-hole stroke play",
    note: "Rotating venue; held March/April at top-ranked private courses",
    overview: "The Golfweek Senior Amateur Championship is an elite invitation-only stroke-play event on the national senior amateur calendar. Its rare 72-hole format \u2014 one of few senior events contested over four rounds \u2014 demands sustained consistency at a world-class private venue and sets it apart from most senior invitationals.",
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "george-coleman-invitational-senior-division",
    name: "George Coleman Invitational (Senior Division)",
    month: "April 2026",
    format: "54-hole stroke play",
    course: "Seminole Golf Club",
    location: "Juno Beach, FL",
    coursePar: 72,
    courseYardage: 7265,
    courseDesigner: "Donald Ross (1929)",
    note: "Seminole Golf Club undergoing fairway renovations to address a rising water table; venue for 2026 pending confirmation",
    overview: "The George L. Coleman Senior Invitational is held at Seminole Golf Club \u2014 Donald Ross\u2019s celebrated oceanside masterpiece and one of the world\u2019s most coveted private courses. The senior division places the nation\u2019s best 55+ amateurs on Seminole\u2019s wind-swept, links-influenced layout, and the event is widely regarded as the pinnacle of the senior amateur invitational circuit.",
    winners: [
      { year: 2024, champion: "Mike McCoy" },
      { year: 2023, champion: "Roger Newsom" },
      { year: 2022, champion: "Bob Royak" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "society-of-seniors-senior-masters",
    name: "Society of Seniors: Senior Masters",
    month: "April 2026",
    format: "54-hole stroke play",
    course: "Indian Wells Golf Resort (Players Course)",
    location: "Indian Wells, CA",
    coursePar: 72,
    courseYardage: 7122,
    courseDesigner: "John Fought (2007)",
    overview: "The Society of Seniors Senior Masters is held each April at the prestigious Indian Wells Golf Resort in California\u2019s Coachella Valley. Competitors play on both the Fought-designed Players Course and the Clark-designed Celebrity Course across four age divisions \u2014 Senior, Super Senior, Legend, and Super Legend \u2014 all contested in 54-hole stroke play.",
    winners: [
      { year: 2025, champion: "Bryan Hoops" },
      { year: 2024, champion: "Bryan Hoops" },
      { year: 2023, champion: "George Walker" },
    ],
    howToPlay: [{ label: "Apply for invite", href: "https://www.societyofseniors.com/membership/" }],
  },
  {
    slug: "trans-mississippi-senior-championship",
    name: "Trans-Mississippi Senior Championship",
    month: "May 2026",
    format: "54-hole stroke play",
    course: "Mission Hills Country Club",
    location: "Rancho Mirage, CA",
    note: "Rotating venue; 2026 host: Mission Hills Country Club, Rancho Mirage, CA",
    overview: "The Trans-Mississippi Senior Championship, organized by the Trans-Mississippi Golf Association since 2000, is one of America\u2019s most prestigious regional senior titles. The event rotates annually among distinguished courses west of the Mississippi River, drawing elite 55+ amateurs for 54 holes of stroke play each May.",
    winners: [
      { year: 2025, champion: "Bryan Hoops" },
      { year: 2023, champion: "Jon Lindstrom" },
      { year: 2021, champion: "Steve Maddalena" },
      { year: 2019, champion: "Jon Lindstrom" },
      { year: 2018, champion: "Mike McCoy" },
      { year: 2017, champion: "Gene Elliott" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "john-t-lupton-memorial-senior-division",
    name: "John T. Lupton Memorial (Senior Division)",
    month: "May 2026",
    format: "54-hole stroke play",
    course: "The Honors Course",
    location: "Ooltewah, TN",
    coursePar: 72,
    courseYardage: 6915,
    courseDesigner: "Pete Dye (1983)",
    overview: "The John T. Lupton Memorial is played at The Honors Course in Ooltewah, Tennessee \u2014 Pete Dye\u2019s tribute to amateur golf, commissioned by Coca-Cola heir Jack Lupton. The senior division (55+) earns World Amateur Golf Ranking points alongside the concurrent mid-amateur division. Consistently ranked among the nation\u2019s top-100 private courses, the Honors Course is one of Dye\u2019s finest designs.",
    winners: [
      { year: 2025, champion: "Jack Larkin" },
      { year: 2024, champion: "Mike Combs" },
      { year: 2023, champion: "Bob Royak" },
      { year: 2018, champion: "Rick Cloninger" },
      { year: 2014, champion: "Paul Simson" },
      { year: 2013, champion: "Paul Simson" },
      { year: 2012, champion: "Doug Hanzel" },
      { year: 2011, champion: "Brady Exber" },
      { year: 2010, champion: "Chip Lutz" },
      { year: 2009, champion: "Paul Simson" },
      { year: 2008, champion: "Paul Simson" },
      { year: 2007, champion: "Paul Simson" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "huddleston-cup-senior-division",
    name: "Huddleston Cup (Senior Division)",
    month: "May 2026",
    format: "54-hole stroke play",
    course: "Maridoe Golf Club",
    location: "Carrollton, TX",
    coursePar: 72,
    courseYardage: 7834,
    courseDesigner: "Steve Smyers (2017)",
    overview: "The Huddleston Cup at Maridoe Golf Club near Dallas is one of the most demanding tests in senior amateur golf. Maridoe\u2019s par-72 layout stretches to 7,834 yards with a 155 slope rating \u2014 the maximum possible \u2014 and the inaugural 2023 event has quickly become one of the circuit\u2019s most coveted invitationals for elite 55+ amateurs.",
    winners: [
      { year: 2023, champion: "Doug Hanzel" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "ra-senior-amateur",
    name: "R&A Senior Amateur Championship",
    month: "July 2026",
    format: "stroke play + match play",
    course: "Frilford Heath Golf Club",
    location: "Abingdon, Oxfordshire, England",
    note: "Rotating venue; 2026 host: Frilford Heath Golf Club, Abingdon, Oxfordshire",
    overview: "The R&A Senior Amateur Championship is the world\u2019s premier international senior amateur title, staged annually at rotating links and heathland courses across Great Britain and Ireland. Players 55 and over compete in qualifying stroke play followed by match play elimination, and the champion is widely regarded as the top senior amateur in the world.",
    winners: [
      { year: 2025, champion: "John Kennedy" },
      { year: 2024, champion: "Todd White" },
      { year: 2023, champion: "Brent Paterson" },
      { year: 2022, champion: "Mike McCoy" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "north-south-senior-mens-amateur",
    name: "North & South Senior Men's Amateur Championship",
    month: "August 2026",
    format: "match play",
    course: "Pinehurst Resort (No. 2)",
    location: "Pinehurst, NC",
    coursePar: 70,
    courseYardage: 7551,
    courseDesigner: "Donald Ross (1907)",
    overview: "The North & South Senior Men\u2019s Amateur is staged annually at the legendary Pinehurst Resort \u2014 America\u2019s golf capital \u2014 with match play finals on the iconic No. 2 course. One of the oldest and most celebrated senior amateur championships in the country, the event draws a national field of elite 55+ amateurs to the Sandhills of North Carolina each August.",
    winners: [
      { year: 2025, champion: "Doug Hanzel" },
      { year: 2024, champion: "Rusty Strawn" },
      { year: 2023, champion: "Mike McCoy" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "sunnehanna-senior-amateur",
    name: "Sunnehanna Senior Amateur Championship",
    month: "August 2026",
    format: "stroke play",
    course: "Sunnehanna Country Club",
    location: "Johnstown, PA",
    coursePar: 70,
    courseYardage: 6716,
    courseDesigner: "A.W. Tillinghast (1923)",
    overview: "The Sunnehanna Senior Amateur Championship is played at historic Sunnehanna Country Club in Johnstown, Pennsylvania \u2014 an A.W. Tillinghast design that also hosts the renowned Sunnehanna Amateur. The course has attracted amateur golf legends since 1923, and the senior championship gives elite 55+ amateurs the chance to compete on one of Pennsylvania\u2019s finest classic layouts.",
    winners: [
      { year: 2025, champion: "Tony Wise" },
      { year: 2024, champion: "Mark Strickland" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "valentine-invitational",
    name: "Valentine Invitational",
    month: "August 2026",
    format: "54-hole stroke play",
    course: "Hermitage Country Club (Sabot Course)",
    location: "Manakin-Sabot, VA",
    coursePar: 72,
    courseYardage: 6947,
    courseDesigner: "Ed Ault (1973); Arthur Hills renovation (2000)",
    overview: "The Valentine Invitational is a premier Virginia senior and mid-amateur event held annually at Hermitage Country Club\u2019s Sabot Course in the rolling Goochland County countryside outside Richmond. The 54-hole stroke-play competition draws a national senior field each August, making it one of the Mid-Atlantic\u2019s most respected invitationals.",
    winners: [
      { year: 2023, champion: "Steve Serrao" },
      { year: 2019, champion: "Scott Shingler" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "senior-porter-cup",
    name: "Senior Porter Cup",
    month: "September 2026",
    format: "54-hole stroke play",
    course: "Niagara Falls Country Club",
    location: "Lewiston, NY",
    coursePar: 70,
    courseYardage: 6621,
    courseDesigner: "A.W. Tillinghast (1919)",
    overview: "The Senior Porter Cup is a standalone spinoff of the prestigious Porter Cup Invitational, held at historic Niagara Falls Country Club \u2014 an A.W. Tillinghast design from 1919 set atop the bluffs above the Niagara River. The event features four age divisions (Senior 55+, Super Senior 65+, Legends 70+, Super Legends 75+) and draws elite older amateurs to western New York each September.",
    winners: [
      { year: 2023, champion: "Ray Sovik" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "usga-mens-senior-amateur",
    name: "USGA Men's Senior Amateur",
    month: "August/September 2026",
    format: "stroke play + match play",
    course: "Baltimore Country Club (East Course)",
    location: "Lutherville, MD",
    coursePar: 70,
    courseYardage: 7181,
    courseDesigner: "A.W. Tillinghast (1926)",
    note: "Rotating venue; 2026 host: Baltimore Country Club (East Course), Lutherville, MD",
    overview: "The USGA Men\u2019s Senior Amateur is America\u2019s most prestigious senior amateur title, contested annually since 1955 at rotating private courses nationwide. Open to amateurs 55+ with a Handicap Index of 5.4 or lower, the championship combines 36 holes of qualifying stroke play with match play elimination \u2014 mirroring the historic format of the U.S. Amateur.",
    winners: [
      { year: 2025, champion: "Michael McCoy" },
      { year: 2024, champion: "Louis Brown" },
      { year: 2023, champion: "Todd White" },
      { year: 2022, champion: "Rusty Strawn" },
      { year: 2021, champion: "Gene Elliott" },
      { year: 2019, champion: "Bob Royak" },
      { year: 2018, champion: "Jeff Wilson" },
      { year: 2017, champion: "Sean Knapp" },
      { year: 2016, champion: "Dave Ryan" },
      { year: 2015, champion: "Chip Lutz" },
      { year: 2014, champion: "Patrick Tallent" },
      { year: 2013, champion: "Doug Hanzel" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "crump-cup-senior-division",
    name: "The Crump Cup (Senior Division)",
    month: "September 2026",
    format: "stroke play",
    course: "Pine Valley Golf Club",
    location: "Pine Valley, NJ",
    coursePar: 70,
    courseYardage: 7197,
    courseDesigner: "George Crump (1919)",
    overview: "The Crump Cup has been contested at Pine Valley Golf Club since 1922 \u2014 the year of the course\u2019s formal opening \u2014 and is one of amateur golf\u2019s most exclusive invitations. Played on what is consistently ranked the world\u2019s finest golf course, the senior division runs concurrently with the mid-amateur flight, offering a rare chance to compete at this famously private New Jersey club.",
    winners: [
      { year: 2025, champion: "Bob Royak" },
      { year: 2024, champion: "Matthew Sughrue" },
      { year: 2022, champion: "Tommy Brennan" },
      { year: 2019, champion: "Gene Elliott" },
      { year: 2017, champion: "John McClure" },
      { year: 2016, champion: "Jim Lehman" },
      { year: 2013, champion: "Gene Elliott" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "international-senior-individual-championship",
    name: "International Senior Individual Championship",
    month: "October 2026",
    format: "72-hole stroke play",
    overview: "The International Senior Individual Championship is an elite 72-hole stroke-play event on the global senior amateur calendar, drawing invited players from multiple countries to compete as individuals. The format provides an international stage for the world\u2019s top 55+ amateurs and complements national team senior competitions.",
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "ojai-senior-cup",
    name: "Ojai Senior Cup",
    month: "October 2026",
    format: "match play",
    course: "Soule Park Golf Course",
    location: "Ojai, CA",
    coursePar: 72,
    courseYardage: 6475,
    courseDesigner: "William F. Bell Jr. (1962); Gil Hanse renovation (2006)",
    overview: "The Ojai Senior Cup is the West Coast\u2019s premier senior amateur championship, held annually at the historic Soule Park Golf Course in the Ojai Valley north of Santa Barbara. The public course \u2014 renovated by Gil Hanse in 2006 \u2014 winds through towering oaks in the scenic Topatopa Mountains, featuring senior (55+) and super senior (65+) divisions over 54 holes.",
    winners: [
      { year: 2025, champion: "Tim Hogarth" },
      { year: 2024, champion: "Tim Hogarth" },
      { year: 2019, champion: "Tim Hogarth" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "reynolds-senior-invitational",
    name: "Reynolds Senior Invitational",
    month: "October 2026",
    format: "54-hole stroke play",
    course: "Great Waters Course at Reynolds Lake Oconee",
    location: "Greensboro, GA",
    courseDesigner: "Jack Nicklaus (1992)",
    overview: "The Reynolds Senior Invitational is an elite invitation-only event held at Reynolds Lake Oconee in the Georgia countryside. The Jack Nicklaus-designed Great Waters course provides a championship-caliber setting for the 54-hole stroke-play competition, which features senior, super senior, legend, and grand master age divisions.",
    winners: [
      { year: 2024, champion: "Jack Larkin" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "california-senior-amateur",
    name: "California Senior Amateur Championship",
    month: "November 2026",
    format: "stroke play + match play",
    note: "Rotating venue: northern CA courses in even years, southern CA courses in odd years",
    overview: "The California Senior Amateur Championship is the state\u2019s premier senior title, co-conducted by the SCGA and NCGA and rotating between northern and southern California venues. Past hosts include Poppy Hills Golf Course, Ojai Valley Inn, and The Valley Club at Montecito, with northern courses hosting in even years and southern in odd years.",
    winners: [
      { year: 2025, champion: "Bob Niger" },
    ],
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "east-west-cup-matches",
    name: "East West Cup Matches",
    month: "November 2026",
    format: "team matches",
    course: "Maridoe Golf Club",
    location: "Carrollton, TX",
    overview: "The East West Cup Matches pits an elite team from west of the Mississippi against a team from the east in a Ryder Cup-style team competition. Each side fields 18 players drawn from senior, mid-amateur, and young amateur ranks, and the event is primarily hosted at Maridoe Golf Club near Dallas \u2014 one of America\u2019s most demanding private courses.",
    howToPlay: [{ label: "Invite only \u2014 no application" }],
  },
  {
    slug: "society-of-seniors-ralph-bogart",
    name: "Society of Seniors: Ralph Bogart",
    month: "November 2026",
    format: "54-hole stroke play",
    course: "Hammock Beach Resort (Conservatory Course)",
    location: "Palm Coast, FL",
    note: "Rotating venue; recent hosts: Hammock Beach Resort, Palm Coast, FL (2025); Abacoa GC, Jupiter, FL (2024)",
    overview: "The SOS Ralph Bogart Tournament is named for Ralph Bogart, co-founder of the Society of Seniors in 1983. The 54-hole stroke-play event typically closes the fall portion of the SOS annual schedule, rotating among Florida\u2019s premier resort venues and crowning champions across four age divisions.",
    winners: [
      { year: 2025, champion: "Rick Stimmel" },
      { year: 2024, champion: "Gene Elliott" },
    ],
    howToPlay: [{ label: "Apply for invite", href: "https://www.societyofseniors.com/membership/" }],
  },
];

export function getSeniorMajorBySlug(slug: string): SeniorMajorEvent | null {
  return SENIOR_MAJOR_EVENTS_2026.find((e) => e.slug === slug) ?? null;
}

// Returns {tournament, article} for a given tournament slug + article slug, or undefined.
export function getSeniorMajorArticle(
  tournamentSlug: string,
  articleSlug: string
) {
  const tournament = getSeniorMajorBySlug(tournamentSlug);
  if (!tournament || !tournament.news) return undefined;
  const article = tournament.news.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { tournament, article };
}

// Returns all (tournamentSlug, articleSlug) pairs for static generation + sitemap.
export function listSeniorMajorArticleParams(): {
  slug: string;
  article: string;
}[] {
  const out: { slug: string; article: string }[] = [];
  for (const t of SENIOR_MAJOR_EVENTS_2026) {
    if (!t.news) continue;
    for (const a of t.news) {
      out.push({ slug: t.slug, article: a.slug });
    }
  }
  return out;
}

export function listSeniorMajorSlugs(): string[] {
  return SENIOR_MAJOR_EVENTS_2026.map((e) => e.slug);
}

export function listSeniorMajorsByMonth(): Array<{
  month: string;
  monthKey: string;
  events: SeniorMajorEvent[];
}> {
  const order = [
    "January 2026", "February 2026", "March 2026", "March/April 2026",
    "April 2026", "May 2026", "June 2026", "July 2026",
    "August 2026", "August/September 2026", "September 2026",
    "October 2026", "November 2026", "December 2026",
  ];
  const groups = new Map<string, SeniorMajorEvent[]>();
  for (const e of SENIOR_MAJOR_EVENTS_2026) {
    const arr = groups.get(e.month) || [];
    arr.push(e);
    groups.set(e.month, arr);
  }
  const out: Array<{ month: string; monthKey: string; events: SeniorMajorEvent[] }> = [];
  for (const m of order) {
    const events = groups.get(m);
    if (!events || !events.length) continue;
    const monthKey = m.split(" ")[0].slice(0, 3).toLowerCase();
    out.push({ month: m, monthKey, events });
  }
  return out;
}
