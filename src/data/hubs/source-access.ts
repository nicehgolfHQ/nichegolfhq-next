import type { HubChannel } from "@/data/hubs/inventory";

/** Internal audit. Not rendered. */
export type BoardCompleteness = "none" | "selected" | "full" | "award-filter" | "retrieved-held";

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
    note: "Public page, widget, and HTML tables on 2026-11-08 at 8:55 a.m. CT. Main board 144: 72 finishers, 68 CUT, 3 WD, 1 DQ. Low Senior is 24 overlapping award rows, shown only as an award filter. Official link unchanged.",
  },
  {
    channel: "senior",
    slug: "gasparilla-invitational-senior-division",
    access: "public-page",
    completeness: "award-filter",
    note: "Same retrieval. The senior hub shows the Low Senior award only. Those players are already in the tournament field.",
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
    completeness: "retrieved-held",
    note: "Public team board has 54 pairing rows and the round sums check. Pairing strings are not individual players, so the board is not mounted.",
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
    access: "no-url",
    completeness: "selected",
    note: "No scoring URL is stored. The hub still has the recap match list. No bracket was inferred.",
  },
  {
    channel: "midam",
    slug: "john-t-lupton-memorial",
    access: "not-yet-published",
    completeness: "none",
    note: "Dates are stored as rescheduled to 2027. No 2026 scoring URL is stored.",
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
    completeness: "retrieved-held",
    note: "The public widget's final round is one championship match and one senior match. That is not a full bracket, so it is not mounted.",
  },
  {
    channel: "midam",
    slug: "european-mens-mid-amateur",
    access: "external-page",
    completeness: "none",
    note: "The stored EGA page returned 200. Its frames are not a Golf Genius results table. No scores were read from it.",
  },
  {
    channel: "midam",
    slug: "cb-macdonald-invitational-tournament",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Public customized results have place, player, to-par, and total for a Mid-Am table and a Senior-Am table, with no round columns. Rounds were not invented, and the tables are not mounted.",
  },
  {
    channel: "midam",
    slug: "sanger-invitational",
    access: "no-url",
    completeness: "none",
    note: "No scoring URL and no 2026 champion are stored. The hub says the results and field are unavailable here.",
  },
  {
    channel: "midam",
    slug: "george-c-thomas-invitational",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Mid-am table, 34 rows, and senior table, 30 rows, both parsed. Stored course par does not explain the source to-par, so the rows are held and not mounted. The hub is still the legacy page.",
  },
  {
    channel: "midam",
    slug: "the-picard-cup",
    access: "inaccessible",
    completeness: "none",
    note: "The stored portal URL returned no page on this run. No scores were imported.",
  },
  {
    channel: "midam",
    slug: "canadian-mens-mid-amateur",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Championship table parsed at 156 rows and the round sums check. A separate Mid-Master link was seen at 61 rows and was not kept as its own checked file. Neither board is mounted. The hub is still legacy.",
  },
  {
    channel: "midam",
    slug: "the-valentine-invitational",
    access: "public-page",
    completeness: "none",
    note: "The stored page is the event home. A results widget address is present, and a follow-up fetch did not yield a parsed leaderboard. No scores were imported.",
  },
  {
    channel: "midam",
    slug: "usga-womens-mid-am",
    access: "inaccessible",
    completeness: "selected",
    note: "The stored USGA scoring page returned 403 to an ordinary curl. The hub still has the recap, not an official board.",
  },
  {
    channel: "midam",
    slug: "trans-miss-mid-master-championship",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Mid-Amateur table, 24 rows, and Mid-Master table, 45 rows, both parsed and checked. They are separate divisions and are not mounted. The hub is still legacy.",
  },
  {
    channel: "midam",
    slug: "the-crump-cup",
    access: "local-file",
    completeness: "none",
    note: "Stored results are local PDFs. They were not parsed into rows, so the hub does not claim a full board.",
  },
  {
    channel: "midam",
    slug: "usga-mens-mid-am",
    access: "inaccessible",
    completeness: "selected",
    note: "The stored USGA scoring page returned 403 to an ordinary curl. The hub still has the recap, not an official board.",
  },
  {
    channel: "midam",
    slug: "john-r-williams-four-ball",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Public mid-am and senior leaderboards are team pairings, and the round sums check. They are not mounted as individual players. Skins tables are not scorecards.",
  },
  {
    channel: "midam",
    slug: "the-farrell",
    access: "public-page",
    completeness: "selected",
    note: "The stored page is pairings. The same site has Results and Stroke Play Qualifying Results pages. Those widgets were not opened, so the hub still has the recap only.",
  },
  {
    channel: "midam",
    slug: "the-stocker-cup",
    access: "external-page",
    completeness: "none",
    note: "The stored site returned 200 and no Golf Genius results table. No scores were read from it.",
  },
  {
    channel: "midam",
    slug: "the-berkeley-cup",
    access: "public-page",
    completeness: "retrieved-held",
    note: "Public boards were retrieved. One mid-am card uses NC and one uses NS, so the board is not mounted until those statuses are preserved in a checked import. Senior is a separate five-row table.",
  },
  {
    channel: "midam",
    slug: "tree-farm-invitational",
    access: "local-file",
    completeness: "none",
    note: "Stored results are a local Stableford HTML file. It was not parsed into the stroke board, so nothing new is mounted.",
  },
  {
    channel: "midam",
    slug: "carlton-woods-invitational",
    access: "public-page",
    completeness: "none",
    note: "The stored page is the player list. The same site links Tournament Results, and that widget was not opened. No scores were imported.",
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
    channel: "midam",
    slug: "ewing-cup-four-ball",
    access: "not-yet-published",
    completeness: "none",
    note: "No scoring URL is stored. The event is scheduled for November 13-15, 2026.",
  },
];
