import type { HowToPlayEntry, NewsArticle } from "@/lib/tournaments/types";

export type JuniorMajorEvent = {
  slug: string;
  name: string;
  month: string; // e.g. "January 2026"
  winners2026?: { boys?: string; girls?: string };
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
  format?: string;
  fieldSize?: string;
  eligibility?: string;
  // Editorial
  overview?: string;
  // History
  pastResults?: { year: number; champion: string; score?: string; runnerUp?: string }[];
  // News
  news?: NewsArticle[];
};

export const JUNIOR_MAJOR_EVENTS_2026: JuniorMajorEvent[] = [
  {
    slug: "junior-orange-bowl",
    name: "Junior Orange Bowl",
    month: "January 2026",
    winners2026: { boys: "Tomas Restrepo", girls: "Charlotte Naughton" },
    officialUrl: "https://juniororangebowl.org/golf",
    course: "Biltmore Golf Course",
    location: "Coral Gables, FL",
    coursePar: 71,
    courseYardage: 7112,
    courseDesigner: "Donald Ross (1925); restored by Brian Silva (2007)",
    format: "72-hole stroke play, no cut",
    fieldSize: "Up to 72 boys, 42 girls",
    eligibility: "Invitation only; junior amateurs under age 19 who have not enrolled in college golf; includes top 25 U.S.-ranked players plus national champions from over 100 countries",
    overview: "The Junior Orange Bowl International Golf Championship is one of the world's oldest and most prestigious junior invitationals, held at the historic Donald Ross–designed Biltmore Golf Course in Coral Gables since 1964. The 72-hole, no-cut format draws players from over 100 countries and has served as an early launchpad for Tiger Woods, Sergio Garcia, Inbee Park, and Lexi Thompson. Separate boys' and girls' divisions compete simultaneously, with all players guaranteed all four rounds.",
    pastResults: [
      { year: 2025, champion: "Boys: Lorenzo Rodriguez / Girls: Shauna Liu", score: "Boys: -7 (277) / Girls: -8 (276)" },
      { year: 2024, champion: "Boys: Darren Zhou / Girls: Kayla Bryant" },
      { year: 2023, champion: "Boys: Jay Brooks / Girls: Anna Davis" },
      { year: 2022, champion: "Boys: Nicholas Prieto / Girls: Maria Jose Marin" },
      { year: 2021, champion: "Boys: Sebastian Moss / Girls: Emily Zhu" },
      { year: 2020, champion: "Boys: Andrey Borges / Girls: Mizuki Hashimoto" },
    ],
  },
  {
    slug: "ajga-simplify-boys-championship",
    name: "AJGA Simplify Boys Championship",
    month: "February 2026",
    officialUrl: "https://www.ajga.org/tournaments/ajga-simplify-boys-championship-at-carlton-woods",
    course: "The Club at Carlton Woods \u2013 Fazio Championship Course",
    location: "The Woodlands, TX",
    coursePar: 72,
    courseDesigner: "Tom Fazio",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational \u2013 boys ages 12\u201319",
    overview: "One of the premier AJGA Invitational events, the Simplify Boys Championship is held annually at the exclusive Club at Carlton Woods in The Woodlands, Texas. The Tom Fazio-designed Championship Course provides an elite test for the nation\u2019s top junior golfers across three rounds of stroke play. The 2025 edition featured future stars including Miles Russell, who ran away with the title at 11 under par.",
    pastResults: [
      { year: 2026, champion: "Grayson Baucom", score: "-12 (70-67-67\u2014204)" },
      { year: 2025, champion: "Miles Russell", score: "-11 (64-70-71\u2014205)", runnerUp: "T2: Michael Riebe / Giuseppe Puebla (-8)" },
    ],
    winners2026: { boys: "Grayson Baucom" },
  },
  {
    slug: "fortinet-stanford-invitational",
    name: "The Fortinet Stanford Invitational hosted by Rose Zhang",
    month: "February 2026",
    officialUrl: "https://www.ajga.org/tournaments/the-fortinet-stanford-invitational-hosted-by-rose-zhang",
    course: "Stanford Golf Course",
    location: "Stanford, CA",
    coursePar: 71,
    courseYardage: 6098,
    courseDesigner: "George C. Thomas Jr. and William P. Bell (1930)",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational \u2013 girls ages 12\u201319; invitation based on Rolex AJGA Rankings; top 15-ranked girls are fully exempt; AJGA membership required",
    overview: "Originally the Mariah Stackhouse Girls Invitational at its 2021 debut, the tournament became the Fortinet Stanford Invitational hosted by Rose Zhang in 2024 when the LPGA star and Stanford alumna took on the hosting role. Played on the historic George C. Thomas\u2013designed Stanford Golf Course, the event is one of the AJGA\u2019s premier all-girls invitationals. Starting in 2025, the champion receives a sponsor exemption into the Chevron Championship (LPGA major).",
    pastResults: [
      { year: 2026, champion: "Asterisk Talley", score: "-9 (204)", runnerUp: "Rina Kawasaki / Juliet Oh (T2, -4)" },
      { year: 2025, champion: "Asterisk Talley" },
      { year: 2024, champion: "Kristina Xu" },
      { year: 2023, champion: "Anna Song" },
      { year: 2022, champion: "Leigh Chien" },
      { year: 2021, champion: "Michelle Liu" },
    ],
    winners2026: { girls: "Asterisk Talley" },
  },
  {
    slug: "dustin-johnson-world-junior",
    name: "Dustin Johnson World Junior Golf Championship",
    month: "March 2026",
    officialUrl: "https://worldjuniorgolfchampionship.com/",
    course: "TPC Myrtle Beach",
    location: "Murrells Inlet, SC",
    coursePar: 72,
    courseYardage: 6950,
    courseDesigner: "Tom Fazio (1999)",
    format: "54-hole stroke play with cut after Round 2 (top 36 boys and ties, top 18 girls and ties advance)",
    fieldSize: "Approximately 90 players total (co-ed)",
    eligibility: "Junior amateurs ages 13\u201318 as of the first round; qualifiers through Rolex AJGA Rankings, TUGR standings, and sponsor exemptions; qualifier events held at Myrtle Beach area courses",
    overview: "Founded in 2016 by two-time major champion and South Carolina native Dustin Johnson, this tournament has quickly grown into one of the top junior events in the country. Held at the Tom Fazio-designed TPC Myrtle Beach, the co-ed field features separate boys\u2019 and girls\u2019 divisions competing simultaneously. Alumni include PGA Tour winners Akshay Bhatia and Nick Dunlap.",
    pastResults: [
      { year: 2026, champion: "Boys: William Lisle / Girls: Fay Jia" },
      { year: 2025, champion: "Boys: Aarav Shah / Girls: Kayla Bryant" },
      { year: 2024, champion: "Boys: Ethan Paschal / Girls: Vanessa Borovilos" },
      { year: 2023, champion: "Boys: Jackson Koivun / Girls: Ryleigh Knaub" },
      { year: 2022, champion: "Boys: Ben James / Girls: Katie Cranston" },
      { year: 2021, champion: "Boys: Nick Dunlap / Girls: Jacqueline Putrino" },
    ],
    winners2026: { boys: "William Lisle", girls: "Fay Jia" },
  },
  {
    slug: "junior-invitational-sage-valley",
    name: "Junior Invitational at Sage Valley",
    month: "March 2026",
    course: "Sage Valley Golf Club",
    location: "Graniteville, SC",
    winners2026: { boys: "Miles Russell", girls: "Asterisk Talley" },
    officialUrl: "https://juniorinvitational.com/",
    note: "72-hole stroke play \u2022 Sage Valley Golf Club, Graniteville, SC \u2022 Designed by Tom Fazio \u2022 Par 72, 7,437 yards \u2022 Field: 36 boys, 24 girls",
    winners: [
      { year: 2025, champion: "Boys: Miles Russell / Girls: Aphrodite Deng" },
      { year: 2024, champion: "Boys: Giovanni Daniele Binaghi / Girls: Asterisk Talley" },
      { year: 2023, champion: "Boys: Aldrich Potgieter / Girls: Anna Davis" },
      { year: 2022, champion: "Boys: Caleb Surratt / Girls: Amalie Leth-Nissen" },
      { year: 2020, champion: "Jackson Van Paris" },
      { year: 2019, champion: "Tom McKibbin" },
      { year: 2018, champion: "Akshay Bhatia" },
      { year: 2017, champion: "Joaquin Niemann" },
      { year: 2016, champion: "Austin Eckroat" },
      { year: 2015, champion: "Marcus Kinhult" },
      { year: 2014, champion: "Scottie Scheffler" },
      { year: 2013, champion: "Carson Young" },
      { year: 2012, champion: "Zachary Olsen" },
      { year: 2011, champion: "Nicholas Reach" },
    ],
  },
  {
    slug: "ajga-team-taylormade-invitational",
    name: "AJGA Team TaylorMade Invitational",
    month: "May 2026",
    officialUrl: "https://www.ajga.org/tournaments/team-taylormade-invitational",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Streamsong Resort \u2013 Black Course",
    location: "Bowling Green, FL",
    coursePar: 73,
    courseYardage: 7331,
    courseDesigner: "Gil Hanse (2017)",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational \u2013 boys ages 12\u201319; invitation based on Rolex AJGA Rankings; top \u223665 ranked boys receive invitations; AJGA membership required",
    overview: "Launched in 2021 as a premier all-boys AJGA invitational in partnership with TaylorMade, this event rotates annually among elite private courses and resort tracks. The event draws the 72 highest-ranked junior boys in the country and serves as a major college recruiting showcase. Charlie Woods won the 2025 edition at Streamsong\u2019s Gil Hanse-designed Black Course, making it one of the most publicized junior golf moments of the year.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Streamsong Black, Bowling Green, FL).",
    pastResults: [
      { year: 2025, champion: "Charlie Woods", score: "-15 (201)" },
      { year: 2024, champion: "Carson Bertagnole" },
      { year: 2023, champion: "Cayden Pope", score: "-16 (200)" },
      { year: 2022, champion: "Benjamin James" },
      { year: 2021, champion: "Benjamin James", score: "-14 (202)" },
    ],
  },
  {
    slug: "nelly-invitational",
    name: "The Nelly Invitational presented by Chevron",
    month: "May 2026",
    officialUrl: "https://www.ajga.org/tournaments/the-nelly-invitational-presented-by-chevron",
    course: "The Concession Golf Club",
    location: "Bradenton, FL",
    coursePar: 72,
    courseDesigner: "Jack Nicklaus and Tony Jacklin (2006)",
    format: "54-hole stroke play",
    fieldSize: "66 players",
    eligibility: "AJGA Invitational \u2013 girls ages 12\u201319; invitation based on Rolex AJGA Rankings; AJGA membership required; champion receives a sponsor exemption into the Chevron Championship (LPGA major)",
    overview: "The Nelly Invitational debuted in 2024 as an AJGA all-girls invitational hosted by LPGA star Nelly Korda at The Concession Golf Club in Bradenton, Florida \u2014 a course named for Jack Nicklaus\u2019s legendary \u2018concession\u2019 putt to Tony Jacklin at the 1969 Ryder Cup. Chevron joined as presenting sponsor in 2025, adding a sponsor exemption into the Chevron Championship for the champion. The event has quickly established itself as one of the most prestigious stops on the junior girls calendar.",
    pastResults: [
      { year: 2025, champion: "Shauna Liu", score: "-1 (215)", runnerUp: "Clara Ding (sudden-death playoff)" },
      { year: 2024, champion: "Aphrodite Deng", score: "-2 (214)" },
    ],
  },
  {
    slug: "southern-junior-championship",
    name: "Southern Junior Championship",
    month: "June 2026",
    officialUrl: "https://www.southerngolf.org",
    course: "Dataw Island Club \u2013 Cotton Dike Course",
    location: "St. Helena Island, SC",
    coursePar: 72,
    courseYardage: 6787,
    courseDesigner: "Tom Fazio (1985)",
    format: "54-hole stroke play; cut to low 50 and ties after 36 holes",
    fieldSize: "156 players",
    eligibility: "Male amateurs ages 14\u201318 (must have reached 14th birthday before the first round, not yet 19); WHS Handicap Index not exceeding 4.4; not a college golf team member",
    overview: "The Southern Junior Championship, conducted by the Southern Golf Association since 1973, is one of the premier regional junior championships in the United States, drawing top-ranked junior golfers from across the Southeast and beyond. The Tom Fazio-designed Cotton Dike Course at Dataw Island Club hosted the 53rd edition in 2025. Charles Howell III holds the record with three consecutive titles (1994\u20131996).",
    pastResults: [
      { year: 2025, champion: "Bailey Sutter" },
      { year: 2024, champion: "Tyler Sanford" },
      { year: 2023, champion: "Tyler Watts" },
      { year: 2022, champion: "Wyatt Plattner" },
      { year: 2021, champion: "Jack Roberts" },
      { year: 2020, champion: "Tommy Morrison" },
    ],
  },
  {
    slug: "ajga-wyndham-invitational",
    name: "AJGA Wyndham Invitational at Sedgefield",
    month: "June 2026",
    officialUrl: "https://www.ajga.org/tournaments/wyndham-invitational-presented-by-odyssey",
    course: "Sedgefield Country Club",
    location: "Greensboro, NC",
    coursePar: 70,
    courseYardage: 6982,
    courseDesigner: "Donald Ross (1926); restored by Kris Spence Golf Design (2007)",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational \u2013 boys ages 12\u201319; AJGA membership required; Performance-Based Entry or exemptions",
    overview: "One of the most prestigious events on the AJGA calendar, the Wyndham Invitational has been held at historic Sedgefield Country Club for over 17 consecutive years \u2014 the only Donald Ross design in regular PGA TOUR rotation. The 2021 event made AJGA history when Maxwell Ford won, making brothers David (2020) and Maxwell Ford the first male siblings to win the same AJGA event in consecutive years.",
    pastResults: [
      { year: 2025, champion: "Willie Gordon", score: "-10 (200)" },
      { year: 2024, champion: "Asher Vargas", score: "-6 (204)" },
      { year: 2023, champion: "Blades Brown", score: "-2 (278)", runnerUp: "Henry Guan / Joshua Kim (playoff)" },
      { year: 2022, champion: "Henry Guan", score: "-7 (273)" },
      { year: 2021, champion: "Maxwell Ford", score: "-7 (273)" },
      { year: 2020, champion: "David Ford", score: "-8 (272)" },
    ],
  },
  {
    slug: "womens-western-junior",
    name: "Women's Western Junior Championship",
    month: "June 2026",
    officialUrl: "https://womenswesternjunior.com/",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Maketewah Country Club",
    location: "Cincinnati, OH",
    coursePar: 70,
    courseDesigner: "Donald Ross (1919); Brian Silva restoration (2023)",
    format: "36-hole stroke play qualifying; top 16 advance to match play; four rounds of 18-hole matches to determine champion",
    fieldSize: "78 players",
    eligibility: "Girls 18 years of age or younger (not yet 19 by the final round); WHS Index not exceeding 5.4; not enrolled in college",
    overview: "First held in 1920, the Women\u2019s Western Junior is one of the oldest junior golf tournaments in the United States, conducted by the Women\u2019s Western Golf Association. Alumni have combined for over 200 LPGA Tour wins; past champions include Nancy Lopez (1972\u201374), Cristie Kerr (1994), and Grace Park (1993). The event rotates host courses annually.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Maketewah CC, Cincinnati, OH).",
    pastResults: [
      { year: 2025, champion: "Vidhi Lakhawala", runnerUp: "Kara An (1-up in final)" },
      { year: 2024, champion: "Samantha Brown", runnerUp: "Isabel Emanuels (4&3)" },
      { year: 2023, champion: "Suzie Tran", runnerUp: "Lisa Herman (1-up)" },
      { year: 2022, champion: "Jessica Mason" },
      { year: 2021, champion: "Mara Janess" },
    ],
  },
  {
    slug: "western-junior",
    name: "Western Junior Championship",
    month: "June 2026",
    officialUrl: "https://thewesternjunior.com/",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "The Harvester Club",
    location: "Rhodes, IA",
    coursePar: 72,
    courseYardage: 7275,
    courseDesigner: "Keith Foster (2000; renovated 2019)",
    format: "72-hole stroke play; 36-hole qualifying, top 44 and ties advance to final 36 holes",
    fieldSize: "Up to 156 players",
    eligibility: "Male amateurs ages 12\u201318 (not yet 19 by the final round); WHS Index of 3.0 or lower; not a college golf team member; USGA amateur status required",
    overview: "Founded in 1914 by the Western Golf Association, the Western Junior is the oldest national junior golf championship in the United States. Past competitors include Tiger Woods, Phil Mickelson, Scottie Scheffler, Collin Morikawa, Rickie Fowler, and Jim Furyk. Top three finishers earn exemptions into the Western Amateur.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (The Harvester Club, Rhodes, IA).",
    pastResults: [
      { year: 2025, champion: "Trevor Gutschewski" },
      { year: 2024, champion: "Parker Sands" },
      { year: 2023, champion: "Hans Risvaer" },
      { year: 2022, champion: "Eduardo Derbez-Torres" },
      { year: 2021, champion: "Caleb Surratt" },
    ],
  },
  {
    slug: "north-south-junior",
    name: "North & South Junior Golf Championship",
    month: "June 2026",
    officialUrl: "https://www.pinehurst.com/golf/tournaments/north-south-junior-championship/",
    course: "Pinehurst Resort \u2013 Nos. 2 & 8",
    location: "Pinehurst, NC",
    coursePar: 70,
    courseDesigner: "No. 2: Donald Ross (1907); No. 8: Tom Fazio (1996)",
    format: "54-hole stroke play; separate boys and girls divisions; three rounds across multiple Pinehurst courses",
    fieldSize: "Up to 180 total (90 boys, 90 girls)",
    eligibility: "Male and female amateurs, age 18 and under as of June 30 of the tournament year; must not have started college",
    overview: "Hosted at the iconic Pinehurst Resort in the Sandhills of North Carolina, the North & South Junior Championship is one of the most prestigious junior events in the U.S., played across the resort\u2019s famous courses. Part of the broader North & South tournament family \u2014 one of amateur golf\u2019s oldest championship series \u2014 the event features separate boys\u2019 and girls\u2019 54-hole stroke play competitions.",
    pastResults: [
      { year: 2025, champion: "Boys: Davis Wotnosky / Girls: Makayla Grubb", score: "Boys: -10 (204)" },
      { year: 2024, champion: "Boys: Trey Marrion / Girls: Hallie Wilson" },
      { year: 2023, champion: "Boys: Coltrane Mittag / Girls: Macy Pate" },
      { year: 2022, champion: "Boys: Colin Salema / Girls: Ting-Hsuan Huang" },
      { year: 2021, champion: "Boys: Jackson Bode / Girls: Brooke Rivers" },
      { year: 2020, champion: "Boys: Jonathan Griz / Girls: Amanda Sambach" },
    ],
  },
  {
    slug: "rolex-girls-junior",
    name: "Rolex Girls Junior Championship",
    month: "June 2026",
    officialUrl: "https://www.ajga.org/tournaments/rolex-girls-junior-championship",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "SentryWorld Golf Course",
    location: "Stevens Point, WI",
    coursePar: 72,
    courseYardage: 6303,
    courseDesigner: "Robert Trent Jones Jr. (1982; renovated 2014)",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "AJGA Invitational \u2013 girls ages 12\u201319; invitation based on Rolex AJGA Rankings; AJGA membership required",
    overview: "Co-presented by the AJGA and Rolex since 1992, the Rolex Girls Junior Championship annually convenes 72 of the top-ranked junior girls at a marquee host course. The event is a 54-hole stroke play invitational with no cut, giving every player the full competitive experience. The event rotates host courses annually and draws heavy attention from college coaches nationwide.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (SentryWorld, Stevens Point, WI).",
    pastResults: [
      { year: 2025, champion: "Amelie Zalsman" },
      { year: 2024, champion: "Elizabeth Rudisill" },
      { year: 2023, champion: "Asterisk Talley" },
      { year: 2022, champion: "Kaitlyn Schroeder" },
      { year: 2021, champion: "Amanda Sambach" },
      { year: 2020, champion: "Rose Zhang" },
    ],
  },
  {
    slug: "rlx-ralph-lauren-junior-classic",
    name: "RLX Ralph Lauren Junior Classic",
    month: "June 2026",
    officialUrl: "https://www.ajga.org/tournaments/rlx-ralph-lauren-junior-classic",
    course: "Bethpage State Park \u2013 Black Course",
    location: "Farmingdale, NY",
    coursePar: 71,
    courseYardage: 7468,
    courseDesigner: "A.W. Tillinghast (1936)",
    format: "Match play (round-robin pool play + single elimination)",
    fieldSize: "64 players (32 boys, 32 girls)",
    eligibility: "AJGA Invitational \u2013 ages 12\u201319; invitation based on Rolex AJGA Rankings; AJGA membership required",
    overview: "Now in its 47th year, the RLX Ralph Lauren Junior Classic is the premier junior match play event on the AJGA calendar, contested at one of the most storied public golf courses in America. Boys and girls compete in separate brackets through round-robin pool play before advancing to single-elimination match play. The event has been held at Bethpage Black since 2022.",
    pastResults: [
      { year: 2025, champion: "Boys: Tyler Long / Girls: Yujie Liu" },
      { year: 2024, champion: "Boys: Pennson Badgett / Girls: Clara Ding" },
      { year: 2023, champion: "Boys: Jay Leng Jr. / Girls: Katie Li" },
      { year: 2022, champion: "Boys: Byungho Lee / Girls: Vanessa Borovilos" },
      { year: 2021, champion: "Boys: Nicholas Dunlap / Girls: Kiara Romero" },
    ],
  },
  {
    slug: "wyndham-cup",
    name: "Wyndham Cup",
    month: "July 2026",
    officialUrl: "https://www.ajga.org/tournaments/wyndham-cup",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Forest Highlands Golf Club \u2013 Canyon Course",
    location: "Flagstaff, AZ",
    coursePar: 71,
    courseYardage: 7001,
    courseDesigner: "Tom Weiskopf and Jay Morrish (1986)",
    format: "Team match play \u2013 East vs. West; four-ball, foursomes, mixed foursomes, and singles; 50 total points available",
    fieldSize: "40 players total (10 boys East, 10 boys West, 10 girls East, 10 girls West)",
    eligibility: "Top 10 boys and top 10 girls from each geographic region (East/West) selected via Rolex AJGA Rankings",
    overview: "The Wyndham Cup is the AJGA\u2019s premier team competition, pitting the best junior golfers from the East against the West in a Ryder Cup-style format. The event rotates host courses annually and features four-ball, foursomes, mixed foursomes, and singles matches across three days of competition. Team selection is based purely on the Rolex AJGA Rankings, making it a benchmark honor for elite junior players.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Forest Highlands Canyon, Flagstaff, AZ).",
    pastResults: [
      { year: 2025, champion: "East", score: "28\u201322" },
      { year: 2024, champion: "East", score: "25.5\u201324.5" },
      { year: 2023, champion: "West (retained Cup)", score: "25\u201325 tie" },
      { year: 2022, champion: "West", score: "31\u201319" },
      { year: 2021, champion: "East", score: "29.5\u201320.5" },
    ],
  },
  {
    slug: "us-girls-junior",
    name: "U.S. Girls' Junior Amateur",
    month: "July 2026",
    officialUrl: "https://www.usga.org/championships/u-s-girls-junior-amateur.html",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Atlanta Athletic Club \u2013 Riverside Course",
    location: "Johns Creek, GA",
    coursePar: 72,
    courseYardage: 6958,
    courseDesigner: "Robert Trent Jones Sr. (1960s); redesigned by Rees Jones (2003); remodeled by Tripp Davis (2022)",
    format: "36 holes stroke play (156 players), top 64 advance to single-elimination match play",
    fieldSize: "156 stroke play qualifiers; \u22481,500 national entries through local/sectional qualifying",
    eligibility: "Female amateurs who have not reached their 19th birthday by the final day; USGA Handicap Index not exceeding 5.4; must qualify through USGA local/sectional qualifying",
    overview: "Conducted by the USGA since 1949, the U.S. Girls\u2019 Junior Amateur is the premier national championship for female junior golfers in the United States. The field qualifies through local and sectional qualifying events across the country, then the top 64 stroke play qualifiers advance to match play. The event has launched the careers of Annika Sorenstam, Michelle Wie, and Rose Zhang.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Atlanta Athletic Club Riverside, Johns Creek, GA).",
    pastResults: [
      { year: 2025, champion: "Aphrodite Deng", runnerUp: "Xingtong Chen (2 & 1)" },
      { year: 2024, champion: "Rianne Malixi", runnerUp: "Asterisk Talley (8 & 7)" },
      { year: 2023, champion: "Kiara Romero", runnerUp: "Rianne Malixi (1-up)" },
      { year: 2022, champion: "Yana Wilson", runnerUp: "Gianna Clemente (3 & 2)" },
      { year: 2021, champion: "Rose Zhang", runnerUp: "Bailey Davis (6 & 4)" },
    ],
  },
  {
    slug: "us-junior-amateur",
    name: "U.S. Junior Amateur",
    month: "July 2026",
    officialUrl: "https://www.usga.org/championships/u-s-junior-amateur.html",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Trinity Forest Golf Club",
    location: "Dallas, TX",
    coursePar: 71,
    courseYardage: 7344,
    courseDesigner: "Bill Coore and Ben Crenshaw (2016)",
    format: "36 holes stroke play (256 players across two courses), top 64 advance to single-elimination match play",
    fieldSize: "256 stroke play qualifiers; \u22483,500 national entries through local/sectional qualifying",
    eligibility: "Male amateurs who have not reached their 19th birthday by the final day; USGA Handicap Index not exceeding 4.4; must qualify through USGA local/sectional qualifying",
    overview: "Conducted by the USGA since 1948, the U.S. Junior Amateur is the most prestigious national championship for male junior golfers and a launchpad for legends including Tiger Woods (3-time champion, 1991\u201393), Jordan Spieth, and Nick Dunlap. The 256-player stroke play field is among the deepest in amateur golf, and the match play bracket tests champions across seven rounds in seven days.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Trinity Forest GC, Dallas, TX).",
    pastResults: [
      { year: 2025, champion: "Hamilton Coleman", runnerUp: "Minh Nguyen (2 & 1)" },
      { year: 2024, champion: "Trevor Gutschewski", runnerUp: "Tyler Watts (4 & 3)" },
      { year: 2023, champion: "Bryan Kim", runnerUp: "Joshua Bai (2-up)" },
      { year: 2022, champion: "Wenyi Ding", runnerUp: "Caleb Surratt (3 & 2)" },
      { year: 2021, champion: "Nick Dunlap", runnerUp: "Cohen Trolio (3 & 2)" },
    ],
  },
  {
    slug: "boys-junior-pga",
    name: "Boys Junior PGA Championship",
    month: "July 2026",
    officialUrl: "https://www.juniorpgachampionship.com/",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Birck Boilermaker Golf Complex \u2013 Ackerman-Allen Course",
    location: "West Lafayette, IN",
    coursePar: 72,
    courseDesigner: "Pete Dye",
    format: "72-hole stroke play; cut to top 60 and ties after 36 holes; second cut to top 30 and ties after 54 holes",
    fieldSize: "156 boys",
    eligibility: "Amateurs age 18 or younger on the final day; may not be a full-time college student; must qualify through a PGA Section Championship or receive an exemption",
    overview: "The Boys Junior PGA Championship is the flagship junior event of the PGA of America, contested since 1976. One of the most prestigious junior majors in the U.S., the event has launched the careers of Tiger Woods, Jordan Spieth, Phil Mickelson, Scottie Scheffler, and Justin Thomas. The venue rotates annually among top-tier courses.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Birck Boilermaker, Purdue University, West Lafayette, IN).",
    pastResults: [
      { year: 2025, champion: "Lunden Esterline" },
      { year: 2024, champion: "Baylor Larrabee" },
      { year: 2023, champion: "Miles Russell" },
      { year: 2022, champion: "Max Herendeen" },
      { year: 2021, champion: "Caleb Surratt" },
    ],
  },
  {
    slug: "us-womens-amateur",
    name: "U.S. Women's Amateur",
    month: "August 2026",
    officialUrl: "https://www.usga.org/championships/u-s-women-s-amateur.html",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "Bandon Dunes Golf Resort \u2013 Bandon Dunes Course",
    location: "Bandon, OR",
    coursePar: 72,
    courseYardage: 6347,
    courseDesigner: "David McLay Kidd (1999)",
    format: "36 holes stroke play (156 players), top 64 advance to match play; final is 36 holes",
    fieldSize: "156 players",
    eligibility: "Female amateurs of any age, any nation; USGA Handicap Index of 5.4 or lower; must meet USGA amateur status rules",
    overview: "The U.S. Women\u2019s Amateur, first held in 1895, is the USGA\u2019s premier women\u2019s amateur championship and one of the oldest golf tournaments in the United States. The combined stroke/match play format rewards both consistency and head-to-head competitive ability, and many past champions have gone on to outstanding LPGA careers. Bandon Dunes hosted the 125th edition in 2025.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (Bandon Dunes Golf Resort, Bandon, OR).",
    pastResults: [
      { year: 2025, champion: "Megha Ganne", runnerUp: "Brooke Biermann (4 & 3)" },
      { year: 2024, champion: "Rianne Malixi", runnerUp: "Asterisk Talley (3 & 2)" },
      { year: 2023, champion: "Megan Schofill", runnerUp: "Latanna Stone (4 & 3)" },
      { year: 2022, champion: "Saki Baba", runnerUp: "Monet Chun (11 & 9)" },
      { year: 2021, champion: "Jensen Castle", runnerUp: "Vivian Hou (2 & 1)" },
      { year: 2020, champion: "Rose Zhang", runnerUp: "Gabriela Ruffels (38 holes)" },
    ],
  },
  {
    slug: "us-amateur",
    name: "U.S. Amateur",
    month: "August 2026",
    officialUrl: "https://www.usga.org/championships/u-s-amateur.html",
    // Host course rotates annually. Listed course reflects the 2025 host.
    course: "The Olympic Club \u2013 Lake Course",
    location: "San Francisco, CA",
    coursePar: 70,
    courseYardage: 7214,
    courseDesigner: "Willie Watson and Sam Whiting (1924); renovated by Gil Hanse (2022)",
    format: "36 holes stroke play (312 players across two courses), top 64 advance to match play; final is 36 holes",
    fieldSize: "312 players",
    eligibility: "Male amateurs of any age, any nation; USGA Handicap Index of 0.4 or lower; must meet USGA amateur status rules",
    overview: "The U.S. Amateur, held annually since 1895, is the oldest and most prestigious amateur golf championship in the United States. Its alumni list includes Tiger Woods (3 titles), Jack Nicklaus, Bobby Jones, and Arnold Palmer. The 312-player stroke play field is one of the deepest in amateur golf, and the match play bracket tests champions across seven rounds in seven days.",
    note: "Host course rotates annually. Listed course reflects the 2025 host (The Olympic Club Lake Course, San Francisco, CA).",
    pastResults: [
      { year: 2025, champion: "Mason Howell", runnerUp: "Jackson Herrington (7 & 6)" },
      { year: 2024, champion: "Jose Luis Ballester", runnerUp: "Noah Kent (2-up)" },
      { year: 2023, champion: "Nick Dunlap", runnerUp: "Neal Shipley (4 & 3)" },
      { year: 2022, champion: "Sam Bennett", runnerUp: "Ben Carr (1-up)" },
      { year: 2021, champion: "James Piot" },
      { year: 2020, champion: "Tyler Strafaci", runnerUp: "Charles Osborne (1-up, 38 holes)" },
    ],
  },
  {
    slug: "junior-players-championship",
    name: "Junior Players Championship",
    month: "September 2026",
    officialUrl: "https://www.ajga.org/tournaments/the-junior-players-championship-presented-by-rolex",
    course: "TPC Sawgrass \u2013 Stadium Course",
    location: "Ponte Vedra Beach, FL",
    coursePar: 72,
    courseYardage: 7215,
    courseDesigner: "Pete Dye (1980)",
    format: "54-hole stroke play",
    fieldSize: "78 players",
    eligibility: "AJGA Invitational \u2013 boys ages 12\u201319; top 58 boys from the Rolex AJGA Rankings plus international invitees; invitation only",
    overview: "The Junior PLAYERS Championship, conducted annually since 2007 by the AJGA in partnership with PGA TOUR, is widely considered the most prestigious individual junior stroke play event in the U.S. The event uses the identical course setup as THE PLAYERS Championship, including the famous island-green par-3 17th hole. Miles Russell made history in 2025 as the first two-time champion, having also won in 2023 as the youngest champion in event history at age 14.",
    pastResults: [
      { year: 2025, champion: "Miles Russell", score: "-9 (207)" },
      { year: 2024, champion: "Hamilton Coleman", score: "-6 (210)" },
      { year: 2023, champion: "Miles Russell", score: "-9 (207)" },
      { year: 2022, champion: "Jeffrey Guan", score: "-16 (200)" },
      { year: 2021, champion: "Benjamin James", score: "-8 (208)" },
      { year: 2020, champion: "David Ford", score: "-5 (211)" },
    ],
  },
  {
    slug: "junior-solheim-cup",
    name: "Junior Solheim Cup",
    month: "September 2026",
    officialUrl: "https://www.solheimcup2026.golf/ping-junior-solheim-cup",
    course: "Bernardus Golf",
    location: "Cromvoirt, Netherlands",
    format: "Two-day team match play (Day 1: six fourball + six foursomes; Day 2: twelve singles; 24 total points)",
    fieldSize: "24 players (12 Team USA, 12 Team Europe)",
    eligibility: "Female amateurs ages 12\u201318; must not have turned 19 before January 1 of the event year; not enrolled in a collegiate golf program; U.S. team selected from AJGA-ranked events; European team selected by national federations",
    overview: "Established in 2002 by PING Chairman John Solheim, the Junior Solheim Cup is the biennial junior counterpart to the senior Solheim Cup, pitting 12 elite U.S. junior girls against 12 European junior girls in team match play. The 2026 edition at Bernardus Golf in the Netherlands marks the first time the Junior and senior Solheim Cups share a venue. The U.S. leads the all-time series heading into 2026.",
    note: "Biennial event (held in even years alongside the senior Solheim Cup).",
    pastResults: [
      { year: 2024, champion: "USA", score: "18.5 \u2013 5.5" },
      { year: 2023, champion: "Europe", score: "15 \u2013 9" },
      { year: 2021, champion: "Europe", score: "13 \u2013 11" },
      { year: 2019, champion: "USA", score: "13 \u2013 11" },
    ],
  },
  {
    slug: "junior-presidents-cup",
    name: "Junior Presidents Cup",
    month: "September 2026",
    officialUrl: "https://www.presidentscup.com/",
    course: "Medinah Country Club \u2013 Courses #1 & #2",
    location: "Medinah, IL",
    format: "Two-day team match play; four-ball and foursomes on Day 1, singles on Day 2",
    fieldSize: "24 players (12 United States, 12 International \u2014 non-European)",
    eligibility: "Male amateurs; at least 12 years old as of January 1 of the event year; not yet 19 and not yet graduated high school; not enrolled in or competing for a college golf program",
    overview: "The Junior Presidents Cup is a biennial two-day team match-play competition run jointly by the PGA Tour and AJGA, pitting 12 elite American junior boys against 12 elite International (non-European) junior boys. Created to mirror the Presidents Cup experience, it is held shortly before the senior event at or near the Presidents Cup host site. The United States has won every edition since the inaugural 2017 contest.",
    note: "Biennial event. 2026 host: Medinah Country Club, Medinah, IL.",
    pastResults: [
      { year: 2024, champion: "United States", score: "15 \u2013 9" },
      { year: 2022, champion: "United States", score: "13 \u2013 11" },
      { year: 2019, champion: "United States", score: "13 \u2013 11" },
      { year: 2017, champion: "United States", score: "14 \u2013 10" },
    ],
  },
  {
    slug: "annika-invitational",
    name: "ANNIKA Invitational",
    month: "October 2026",
    officialUrl: "https://annikafoundation.com/annika-invitational/",
    course: "Eagle Creek Golf Club",
    location: "Orlando, FL",
    coursePar: 73,
    courseYardage: 7198,
    courseDesigner: "Ron Garl and Howard Swan",
    format: "54-hole stroke play",
    fieldSize: "72 players",
    eligibility: "Girls ages 14\u201318; invitation only; selection based on AJGA Rankings and achievement criteria; champion receives exemptions into the LPGA\u2019s Hilton Grand Vacations Tournament of Champions and an Epson Tour event",
    overview: "Founded by Annika Sorenstam through the ANNIKA Foundation and sanctioned by the AJGA, the ANNIKA Invitational is one of junior golf\u2019s premier all-girls invitationals, now in its 17th year. The tournament draws the top 72 junior girls from around the world to Eagle Creek Golf Club in Orlando for 54 holes of stroke play. The champion receives direct exemptions into LPGA and Epson Tour events, providing a clear pathway to professional golf.",
    pastResults: [
      { year: 2025, champion: "Asterisk Talley" },
      { year: 2024, champion: "Natalie Yen" },
      { year: 2023, champion: "Ashleen Kaur", score: "-15 (204)" },
      { year: 2022, champion: "Yana Wilson", score: "-12 (207)" },
      { year: 2021, champion: "Avery Zweig", score: "-7 (209)" },
      { year: 2020, champion: "Benedetta Moresco", score: "-4 (212)" },
    ],
  },
  {
    slug: "ajga-ping-invitational",
    name: "AJGA Ping Invitational",
    month: "October 2026",
    officialUrl: "https://www.ajga.org/tournaments/ping-invitational",
    course: "The Saticoy Club",
    location: "Somis, CA",
    coursePar: 72,
    courseYardage: 6883,
    courseDesigner: "William F. Bell and Robert Muir Graves (1964)",
    format: "54-hole stroke play",
    fieldSize: "72 players (36 boys, 36 girls)",
    eligibility: "AJGA Invitational \u2013 invitation only; top boys and girls on the Rolex AJGA Rankings; ages 12\u201319; AJGA membership required",
    overview: "The PING Invitational is one of the AJGA\u2019s most prestigious invitationals, drawing the top-ranked junior boys and girls in equal numbers to compete across 54 holes. First held in 2006, it has featured alumni including Jordan Spieth (two-time boys champion) and Rose Zhang (two-time girls champion). The event has been held at The Saticoy Club in Ventura County since 2024.",
    note: "Host course may rotate. Listed course reflects the 2024\u20132025 host (The Saticoy Club, Somis, CA).",
    pastResults: [
      { year: 2025, champion: "Boys: Preston Hage / Girls: Honorine Nobuta Ferry" },
      { year: 2024, champion: "Boys: Jackson Byrd / Girls: Asterisk Talley" },
      { year: 2023, champion: "Boys: Wheaton Ennis / Girls: Jasmine Koo" },
      { year: 2022, champion: "Boys: Jay Leng Jr. / Girls: Gianna Clemente" },
      { year: 2021, champion: "Boys: Benjamin James / Girls: Gianna Clemente" },
      { year: 2020, champion: "Boys: Kelly Chinn / Girls: Rose Zhang" },
    ],
  },
  {
    slug: "notah-begay-jr-national-championship",
    name: "Notah Begay Jr. Golf National Championship",
    month: "November 2026",
    officialUrl: "https://jgnc.org/",
    course: "Koasati Pines at Coushatta",
    location: "Kinder, LA",
    coursePar: 72,
    courseYardage: 7617,
    courseDesigner: "Kevin Tucker (2002)",
    format: "54-hole stroke play; multi-division (ages 10\u201311, 12\u201313, 14\u201315, 16\u201318); three-stage qualification: local (18 holes) \u2192 regional (36 holes) \u2192 national (54 holes)",
    fieldSize: "Approximately 150 girls and 150\u2013160 boys per national championship",
    eligibility: "Boys and girls ages 10\u201318; must not be 19 or attending college; age division determined by age on May 1; must qualify through local and regional qualifying stages",
    overview: "The NB3 JGNC is the largest Native American\u2013focused junior golf championship in the United States, founded by PGA Tour veteran Notah Begay III to grow the game among Native and underserved youth. The national championship is held at the award-winning Koasati Pines course at Coushatta Casino Resort in Kinder, Louisiana. Divisions span ages 10\u201318 with separate Boys and Girls championships, and the event has aired on Golf Channel.",
    note: "Multi-division format (ages 10\u201311, 12\u201313, 14\u201315, 16\u201318). No single overall champion \u2014 each age group crowns its own winner.",
    pastResults: [
      { year: 2025, champion: "Girls Overall: Angela Nip", score: "-6 (210)" },
      { year: 2024, champion: "Girls 16-18: Kaylee Chung; Girls 14-15: Krishny Elwin; Girls 12-13: Kate Nakaoka; Girls 10-11: Jolie Pastorick" },
    ],
  },
  {
    slug: "rolex-tournament-of-champions",
    name: "Rolex Tournament of Champions",
    month: "November 2026",
    officialUrl: "https://www.ajga.org/tournaments/rolex-tournament-of-champions",
    course: "TPC San Antonio \u2013 Canyons Course",
    location: "San Antonio, TX",
    coursePar: 72,
    courseYardage: 7106,
    courseDesigner: "Pete Dye (2010)",
    format: "72-hole stroke play (boys and girls divisions played simultaneously)",
    fieldSize: "Top boys and girls on AJGA Rankings plus AJGA Junior All-Americans and award recipients",
    eligibility: "Boys and girls under age 19; invitation only based on AJGA Rankings, AJGA Junior All-Americans, and award winners; amateur status required",
    overview: "Established in 1978, the Rolex Tournament of Champions is the AJGA\u2019s flagship season-ending event and one of the longest-running junior golf championships in the world. Held during Thanksgiving week at TPC San Antonio\u2019s Pete Dye-designed Canyons Course, the 72-hole stroke play competition crowns the AJGA boy and girl champions of the year. The event has been held at TPC San Antonio since 2022.",
    pastResults: [
      { year: 2025, champion: "Boys: Luke Ringkamp / Girls: Nikki Oh", score: "Boys: -15 (273) / Girls: -8 (280)" },
      { year: 2024, champion: "Boys: Miles Russell / Girls: Amelie Zalsman", score: "Boys: -13 (275)" },
      { year: 2023, champion: "Boys: Tyler Mawhinney / Girls: Aphrodite Deng" },
      { year: 2022, champion: "Boys: Jackson Koivun / Girls: Meja Ortengren" },
      { year: 2021, champion: "Boys: Eric Lee / Girls: Meja Ortengren" },
      { year: 2020, champion: "Boys: David Ford / Girls: Rose Zhang" },
    ],
  },
  {
    slug: "elite-invitational",
    name: "The Elite Invitational",
    month: "November 2026",
    officialUrl: "https://theeliteinvitational.org/",
    course: "Ponte Vedra Inn & Club \u2013 Ocean Course",
    location: "Ponte Vedra Beach, FL",
    coursePar: 71,
    courseYardage: 6827,
    courseDesigner: "Herbert Strong; renovated by Bobby Weed",
    format: "54-hole stroke play",
    eligibility: "Invitation only; field organized by graduating year (not age); invitations finalized after USGA Junior and Amateur championships; exemptions granted to champions of select qualifying events",
    overview: "The Elite Invitational is an independent, invitation-only 54-hole stroke play championship held at the iconic Ponte Vedra Inn & Club Ocean Course in Ponte Vedra Beach, Florida. Unlike most junior events, the tournament organizes its field by graduating year, mirroring college and professional golf roster structures. The event draws separate boys and girls fields and has produced multiple future college All-Americans and LPGA/PGA Tour players.",
    pastResults: [
      { year: 2025, champion: "Boys: Grant DeLorenzo / Girls: Asterisk Talley" },
      { year: 2024, champion: "Boys: Miles Russell / Girls: Clara Ding", score: "Boys: 203" },
      { year: 2023, champion: "Boys: Blades Brown / Girls: Bridget Wilkie", score: "Boys: 200" },
      { year: 2022, champion: "Boys: Jackson Mitchell / Girls: Mia Gray" },
      { year: 2021, champion: "Boys: Jackson Mitchell / Girls: Morgan Ketchum" },
      { year: 2020, champion: "Boys: Will Morlan / Girls: Emerson Blair", score: "Boys: 205" },
    ],
  },
  {
    slug: "junior-jones-cup",
    name: "Junior Jones Cup",
    month: "December 2026",
    officialUrl: "https://jonescupinvitational.com/",
    course: "Sea Island Golf Club \u2013 Seaside Course",
    location: "Sea Island, GA",
    coursePar: 70,
    courseYardage: 6883,
    courseDesigner: "Harry S. Colt & Charles Alison (1929); redesigned by Tom Fazio (incorporating Joe Lee\u2019s 1974 Marshside nine)",
    format: "54-hole stroke play (may be reduced to 36 holes due to weather)",
    eligibility: "Boys only, ages 15\u201318; invitation only at the discretion of the Jones Cup Committee based on sustained excellence in junior and amateur golf; selections informed by USGA events, AJGA invitationals, Junior PGA results, and rankings",
    overview: "The Jones Cup Junior Invitational is one of the most prestigious boys-only junior invitationals in the American Southeast, held annually during the week of December 18\u201321 at Sea Island Resort\u2019s world-class Seaside Course in coastal Georgia. Named in the spirit of golf legend Bobby Jones, the event draws the nation\u2019s elite junior boys to a links-style oceanside course. The tournament is strictly invite-only and historically serves as a preview of the nation\u2019s top incoming college recruits.",
    pastResults: [
      { year: 2025, champion: "Ayden Fynaut", score: "-10 (won by 4 shots)" },
      { year: 2024, champion: "JD Culbreth", score: "-8 (66-67-69)" },
      { year: 2023, champion: "Tyler Watts", score: "36-hole total (event shortened by weather)" },
      { year: 2022, champion: "Rex Hargrove" },
      { year: 2021, champion: "Andrew McLauchlan" },
      { year: 2020, champion: "Shawn Lalmoni" },
    ],
  },
];

export function getJuniorMajorBySlug(slug: string): JuniorMajorEvent | null {
  return JUNIOR_MAJOR_EVENTS_2026.find((e) => e.slug === slug) ?? null;
}

export function listJuniorMajorSlugs(): string[] {
  return JUNIOR_MAJOR_EVENTS_2026.map((e) => e.slug);
}

export function listJuniorMajorsByMonth(): Array<{
  month: string;
  monthKey: string;
  events: JuniorMajorEvent[];
}> {
  const order = [
    "January 2026", "February 2026", "March 2026", "April 2026",
    "May 2026", "June 2026", "July 2026", "August 2026",
    "September 2026", "October 2026", "November 2026", "December 2026",
  ];
  const groups = new Map<string, JuniorMajorEvent[]>();
  for (const e of JUNIOR_MAJOR_EVENTS_2026) {
    const arr = groups.get(e.month) || [];
    arr.push(e);
    groups.set(e.month, arr);
  }
  const out: Array<{ month: string; monthKey: string; events: JuniorMajorEvent[] }> = [];
  for (const m of order) {
    const events = groups.get(m);
    if (!events || !events.length) continue;
    const monthKey = m.split(" ")[0].slice(0, 3).toLowerCase();
    out.push({ month: m, monthKey, events });
  }
  return out;
}
// Returns {tournament, article} for a given tournament slug + article slug, or undefined.
export function getJuniorMajorArticle(
  tournamentSlug: string,
  articleSlug: string
) {
  const tournament = getJuniorMajorBySlug(tournamentSlug);
  if (!tournament || !tournament.news) return undefined;
  const article = tournament.news.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { tournament, article };
}

// Returns all (tournamentSlug, articleSlug) pairs for static generation + sitemap.
export function listJuniorMajorArticleParams(): {
  slug: string;
  article: string;
}[] {
  const out: { slug: string; article: string }[] = [];
  for (const t of JUNIOR_MAJOR_EVENTS_2026) {
    if (!t.news) continue;
    for (const a of t.news) {
      out.push({ slug: t.slug, article: a.slug });
    }
  }
  return out;
}
