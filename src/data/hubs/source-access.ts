import type { HubChannel } from "@/data/hubs/inventory";

/** Internal audit. Not rendered. */
export type BoardCompleteness = "none" | "selected" | "full" | "partial" | "award-filter" | "retrieved-held";

export type SourceAccess = {
  channel: HubChannel;
  slug: string;
  /** What this run did with the stored scoring URL and its public on-site navigation. */
  access:
    | "no-url"
    | "login-page"
    | "public-page"
    | "external-page"
    | "local-file"
    | "inaccessible"
    | "not-yet-published";
  completeness: BoardCompleteness;
  note: string;
};

export const SOURCE_ACCESS: SourceAccess[] = [
  {
    channel: "midam",
    slug: "gasparilla-invitational",
    access: "public-page",
    completeness: "full",
    note: "Public page, widget, and HTML tables retrieved 2026-11-08 at 8:55 a.m. CT. The mid-am hub shows the official overall board of 144, which includes the 24 senior award entrants at their overall places. The existing senior hub shows those 24 award rows. Official link unchanged.",
  },
  {
    channel: "senior",
    slug: "gasparilla-invitational-senior-division",
    access: "public-page",
    completeness: "award-filter",
    note: "Same retrieval. The existing senior hub shows the 24 Low Senior award rows. They are not a second field.",
  },
  {
    channel: "midam",
    slug: "snedeker-memorial",
    access: "public-page",
    completeness: "full",
    note: "Individual Stroke Play table, 88 rows, sums and ties checked on 2026-11-08 at 9:05 a.m. CT. The separate Team Championship is pairings and is not mounted.",
  },
  {
    channel: "midam",
    slug: "champions-cup-four-ball",
    access: "public-page",
    completeness: "full",
    note: "54 team rows. Each side is stored as two players. Josh Gibbons and Kade Stewart 68, 63, 67, 65, total 263.",
  },
  {
    channel: "midam",
    slug: "giles-invitational",
    access: "public-page",
    completeness: "full",
    note: "Stored link is the pairings page. The same public site links Tournament Results. Mid-am division, 60 rows, three round columns, sums and to-par checked at 9:05 a.m. CT. Senior division, 30 rows, was checked and kept off this hub. Stored URL unchanged.",
  },
  {
    channel: "midam",
    slug: "the-jupiter-invitational",
    access: "public-page",
    completeness: "full",
    note: "Mid Amateur table, 51 rows, including two DNF cards, checked at 9:05 a.m. CT. Senior division, 17 rows, is a separate field and is not on this hub.",
  },
  {
    channel: "midam",
    slug: "walter-j-travis-invitational",
    access: "public-page",
    completeness: "selected",
    note: "Public Golf Genius page retrieved. Its qualifying table is 80 rows and labels 64 players CUT, including Matthew Naumec, who won the Devereux Emmet Cup, so that table was not mounted. The bracket JSON disagrees with the visible final, DeJohn 2 & 1. The hub keeps the recap match list.",
  },
  {
    channel: "midam",
    slug: "john-t-lupton-memorial",
    access: "not-yet-published",
    completeness: "none",
    note: "Dates are stored as rescheduled to 2027. No 2026 scoring URL is stored. The senior division is still stored as May 11-13, 2026. Do not change either year until that conflict is verified.",
  },
  {
    channel: "midam",
    slug: "the-huddleston-cup",
    access: "public-page",
    completeness: "full",
    note: "Mid-Amateur table, 36 rows, sums and to-par checked at 9:05 a.m. CT. Senior Amateur, 27 rows, is a separate field and is not on this hub.",
  },
  {
    channel: "midam",
    slug: "anderson-memorial-four-ball",
    access: "public-page",
    completeness: "partial",
    note: "Published championship matches are 8, 4, 2, and 1. The final is Costanza and Esteve def. Cavaliere and Minerva, 3 and 2. Earlier stroke-play team rows were not mixed into the matches. This is not a complete bracket.",
  },
  {
    channel: "midam",
    slug: "european-mens-mid-amateur",
    access: "public-page",
    completeness: "full",
    note: "The official EGA results PDF men's list is 104 rows: finishers, MC, and one RTD. Ladies and the +40 lists stay off this page. Schaffrath prints +19 and 81.",
  },
  {
    channel: "midam",
    slug: "cb-macdonald-invitational-tournament",
    access: "public-page",
    completeness: "partial",
    note: "Qualifying totals for 80 mid-am players and 48 senior players. The table has no round columns, so none were added. Bracket JSON scores disagreed with the visible final table, so the bracket was not imported.",
  },
  {
    channel: "midam",
    slug: "sanger-invitational",
    access: "no-url",
    completeness: "none",
    note: "No public Fishers Island results page was found. An unrelated club invitational PDF was not used. No 2026 champion is stored.",
  },
  {
    channel: "midam",
    slug: "george-c-thomas-invitational",
    access: "public-page",
    completeness: "full",
    note: "Mid-am board is 34 rows. Source to-par is preserved and was not recomputed from the stored course par. The 30-row senior board is on the existing senior hub. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "midam",
    slug: "the-picard-cup",
    access: "public-page",
    completeness: "full",
    note: "The public Leaderboard page embeds the mid-am board, 36 finished teams. Wyatt/Cave and Robillard/Vardaman are tied at 200. The scoreboard does not print a playoff. The senior board is 12 teams and stays off this page.",
  },
  {
    channel: "midam",
    slug: "canadian-mens-mid-amateur",
    access: "public-page",
    completeness: "full",
    note: "Championship board is 156 rows: 75 finishers, 76 CUT, 5 WD. Mid-Master is 61 rows and every name is also in the championship, with its own places. The two tables are separate. A dash round cell stays a dash. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "midam",
    slug: "the-valentine-invitational",
    access: "public-page",
    completeness: "full",
    note: "84 mid-am rows and 42 senior rows. Round cells keep the course code, such as 65 VSab. The senior board is on the existing senior hub.",
  },
  {
    channel: "midam",
    slug: "usga-womens-mid-am",
    access: "inaccessible",
    completeness: "selected",
    note: "The stored scoring URL returned HTTP 403 from Akamai. It was not fetched again by another client. The hub keeps the recap.",
  },
  {
    channel: "midam",
    slug: "trans-miss-mid-master-championship",
    access: "public-page",
    completeness: "full",
    note: "Mid-Amateur is 24 rows and Mid-Master is 45 rows. The names do not overlap, and each division keeps its own places. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "midam",
    slug: "the-crump-cup",
    access: "local-file",
    completeness: "none",
    note: "The stored PDF and the GAP brackets PDF are match sheets with tee times. They were not turned into a results board. No separate post-event results table was found.",
  },
  {
    channel: "midam",
    slug: "usga-mens-mid-am",
    access: "inaccessible",
    completeness: "selected",
    note: "The stored scoring URL returned HTTP 403 from Akamai. It was not fetched again by another client. The hub keeps the recap.",
  },
  {
    channel: "midam",
    slug: "john-r-williams-four-ball",
    access: "public-page",
    completeness: "full",
    note: "50 mid-am teams and 18 senior teams. Each team is two players. Skins tables were not imported. The senior board is on the existing senior hub.",
  },
  {
    channel: "midam",
    slug: "the-farrell",
    access: "public-page",
    completeness: "partial",
    note: "Men's and women's published matches are 8, 4, 2, and 1. David Kitt def. John Lazor is shown without a margin. The match sheet says 4 & 3 and the recap says 3 and 1. Senior matches stay off this page. Qualifying was not mixed in. This is not a complete event.",
  },
  {
    channel: "midam",
    slug: "the-stocker-cup",
    access: "external-page",
    completeness: "none",
    note: "The official site has 2024 and 2025 result posts and a 2026 live-video page. It has no 2026 results post or leaderboard table, so no board was mounted.",
  },
  {
    channel: "midam",
    slug: "the-berkeley-cup",
    access: "public-page",
    completeness: "full",
    note: "The cup board is 41 rows and includes Christopher Walton NC and Mike Milewski NS. The five-row senior award overlaps that board and has its own places. No senior hub exists, so the award is not shown on this page. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "midam",
    slug: "tree-farm-invitational",
    access: "local-file",
    completeness: "full",
    note: "The published board is 35 Stableford rows, total then R1 and R2, and every total is the sum of the rounds. The preview said 37 players. Matt Crenshaw and Ben Greve are named there and are on neither board, with no DNS or WD printed, so no rows were added. The final board prints Bill Williamson where the round-1 board prints Billy Williamson.",
  },
  {
    channel: "midam",
    slug: "carlton-woods-invitational",
    access: "public-page",
    completeness: "full",
    note: "Mid-am board is 66 rows. Kade Stewart 67, 71, 68, total 206. The senior division is 33 rows on the existing senior hub, leader Edward Fryatt. The names do not overlap. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "midam",
    slug: "east-vs-west-matches",
    access: "public-page",
    completeness: "selected",
    note: "The public page has Sunday singles and a two-team aggregate. The event is still in progress, so those tables were not treated as a final board. The hub keeps the published session recap.",
  },
  {
    channel: "midam",
    slug: "national-invitational-tournament",
    access: "login-page",
    completeness: "selected",
    note: "The stored scoring URL is a Golf Genius sign-in page. The 36-hole board is the Round 2 recap, not a final result.",
  },
  {
    channel: "senior",
    slug: "carlton-woods-senior-invitational",
    access: "public-page",
    completeness: "full",
    note: "Existing senior hub uses the same public results page as the mid-am event. 33 rows. Edward Fryatt 70, 74, 68, total 212. Not shown on the mid-am page.",
  },
  {
    channel: "senior",
    slug: "george-c-thomas-invitational-senior-division",
    access: "public-page",
    completeness: "full",
    note: "Existing senior hub. 30 rows, including one WD. Not shown on the mid-am page. Retrieved 2026-11-08 at 9:20 a.m. CT.",
  },
  {
    channel: "senior",
    slug: "giles-invitational-senior-division",
    access: "public-page",
    completeness: "full",
    note: "Public results page, senior division, 30 rows. Rick Stimmel 73, 66, 73, total 212. Five CUT cards and one DQ. No name is also on the mid-am board. Stored URL unchanged.",
  },
  {
    channel: "senior",
    slug: "jupiter-invitational-senior-division",
    access: "public-page",
    completeness: "full",
    note: "Public results page, senior division, 17 rows. Michael McCoy 70, 68, 66, total 204. The stored champion line still says Mike McCoy. No name is also on the mid-am board.",
  },
  {
    channel: "senior",
    slug: "huddleston-cup-senior-division",
    access: "public-page",
    completeness: "full",
    note: "Public results page, Senior Amateur, 27 rows. Bob Royak 70, 73, 73, total 216. WD and NC tokens kept. The widget dates the rounds May 28-30. Stored dates stay May 26-28.",
  },
  {
    channel: "midam",
    slug: "ewing-cup-four-ball",
    access: "not-yet-published",
    completeness: "none",
    note: "No scoring URL is stored. The event is scheduled for November 13-15, 2026.",
  },
];
