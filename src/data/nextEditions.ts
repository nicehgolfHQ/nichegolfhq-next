/**
 * Officially announced 2027 dates for events that already have a 2026 hub.
 * Only events whose organizer has posted 2027 dates are listed; the rest are
 * left out until dates exist. Keyed by "<channel>/<slug>".
 */
export type NextEdition = {
  startDate: string; // ISO "YYYY-MM-DD"
  endDate: string; // ISO "YYYY-MM-DD"
  /** Venue as posted by the organizer. Omitted when not announced. */
  course?: string;
  /** True while the 2026 edition has not been played yet. */
  pending2026?: boolean;
};

export const NEXT_EDITIONS: Record<string, NextEdition> = {
  "midam/gasparilla-invitational": { startDate: "2027-02-18", endDate: "2027-02-20", course: "Palma Ceia Golf & Country Club" },
  "midam/champions-cup-four-ball": { startDate: "2027-04-14", endDate: "2027-04-17", course: "Champions Golf Club (Jackrabbit Course)" },
  "midam/european-mens-mid-amateur": { startDate: "2027-06-03", endDate: "2027-06-05", course: "Golf de Chiberta" },
  "midam/usga-womens-mid-am": { startDate: "2027-09-11", endDate: "2027-09-16", course: "Country Club of Buffalo" },
  "midam/usga-mens-mid-am": { startDate: "2027-09-18", endDate: "2027-09-23", course: "Jupiter Hills Club (Hills and Village Courses)" },
  "midam/snedeker-memorial": { startDate: "2027-03-11", endDate: "2027-03-14", course: "The Lakewood Club (Dogwood Course)" },
  "midam/the-stocker-cup": { startDate: "2027-10-20", endDate: "2027-10-23", course: "Preserve Golf Club" },
  "junior/nelly-invitational": { startDate: "2027-01-08", endDate: "2027-01-11", course: "The Concession Golf Club" },
  "junior/ajga-simplify-boys-championship": { startDate: "2027-02-12", endDate: "2027-02-15", course: "The Club at Carlton Woods (Fazio Championship Course)" },
  "junior/fortinet-stanford-invitational": { startDate: "2027-02-12", endDate: "2027-02-15", course: "Stanford Golf Course" },
  "junior/dustin-johnson-world-junior": { startDate: "2027-03-05", endDate: "2027-03-07", course: "TPC Myrtle Beach" },
  "junior/junior-invitational-sage-valley": { startDate: "2027-03-17", endDate: "2027-03-19", course: "Sage Valley Golf Club" },
  "junior/ajga-team-taylormade-invitational": { startDate: "2027-05-27", endDate: "2027-05-30", course: "Pelican Golf Club" },
  "junior/womens-western-junior": { startDate: "2027-06-07", endDate: "2027-06-11", course: "Park Ridge Country Club" },
  "junior/north-south-junior": { startDate: "2027-06-13", endDate: "2027-06-16", course: "Pinehurst Resort" },
  "junior/rolex-girls-junior": { startDate: "2027-06-14", endDate: "2027-06-17", course: "The Loxahatchee Club" },
  "junior/southern-junior-championship": { startDate: "2027-06-16", endDate: "2027-06-18", course: "Texarkana Country Club" },
  "junior/western-junior": { startDate: "2027-06-21", endDate: "2027-06-24", course: "Windsong Farm Golf Club (South Course)" },
  "junior/wyndham-cup": { startDate: "2027-06-28", endDate: "2027-07-01", course: "Old Town Club" },
  "junior/us-girls-junior": { startDate: "2027-07-12", endDate: "2027-07-17", course: "Canterbury Golf Club" },
  "junior/us-junior-amateur": { startDate: "2027-07-19", endDate: "2027-07-24", course: "Chambers Bay" },
  "junior/boys-junior-pga": { startDate: "2027-07-27", endDate: "2027-07-30", course: "NCR Country Club" },
  "junior/us-womens-amateur": { startDate: "2027-08-03", endDate: "2027-08-08", course: "Pinehurst Resort & C.C. (Course No. 2)" },
  "junior/rlx-ralph-lauren-junior-classic": { startDate: "2027-08-09", endDate: "2027-08-12", course: "Bethpage State Park (Black Course)" },
  "junior/us-amateur": { startDate: "2027-08-09", endDate: "2027-08-15", course: "Oak Hill Country Club (East and West Courses)" },
  "junior/junior-players-championship": { startDate: "2027-09-02", endDate: "2027-09-05", course: "TPC Sawgrass (THE PLAYERS Stadium Course)" },
  "junior/annika-invitational": { startDate: "2027-10-07", endDate: "2027-10-10", course: "The Golf Club of Georgia (Lakeside)" },
  "junior/ajga-ping-invitational": { startDate: "2027-10-08", endDate: "2027-10-11" },
  "junior/rolex-tournament-of-champions": { startDate: "2027-11-20", endDate: "2027-11-24", course: "TPC San Antonio (Canyons Course)" },
  "junior/junior-jones-cup": { startDate: "2027-12-17", endDate: "2027-12-20", course: "Sea Island Golf Club (Seaside Course)", pending2026: true },
  "junior/junior-orange-bowl": { startDate: "2027-01-03", endDate: "2027-01-06", course: "Biltmore Golf Course" },
  "senior/society-of-seniors-spring-classic": { startDate: "2027-02-07", endDate: "2027-02-10", course: "Aileron Golf Club" },
  "senior/gasparilla-invitational-senior-division": { startDate: "2027-02-18", endDate: "2027-02-20", course: "Palma Ceia Golf & Country Club" },
  "senior/jones-cup-senior-invitational": { startDate: "2027-03-01", endDate: "2027-03-04", course: "Sea Island Golf Club" },
  "senior/society-of-seniors-ed-tutwiler-four-ball": { startDate: "2027-03-14", endDate: "2027-03-17", course: "The Reserve Golf Club" },
  "senior/society-of-seniors-senior-masters": { startDate: "2027-04-08", endDate: "2027-04-10", course: "Indian Wells Golf Resort (Celebrity Course)" },
  "senior/trans-mississippi-senior-championship": { startDate: "2027-05-10", endDate: "2027-05-13", course: "Old Waverly Club (Old Waverly Course)" },
  "senior/ra-senior-amateur": { startDate: "2027-07-08", endDate: "2027-07-10", course: "Blairgowrie" },
  "senior/usga-mens-senior-amateur": { startDate: "2027-08-28", endDate: "2027-09-02", course: "Seattle Golf Club" },
  "senior/senior-porter-cup": { startDate: "2027-09-08", endDate: "2027-09-10", course: "Niagara Falls Country Club" },
  "senior/us-senior-womens-amateur": { startDate: "2027-09-25", endDate: "2027-09-30", course: "Columbia Country Club" },
  "senior/california-senior-amateur": { startDate: "2027-11-15", endDate: "2027-11-17", course: "Virginia CC" },
  "senior/north-south-senior-mens-amateur": { startDate: "2027-08-16", endDate: "2027-08-18", course: "Pinehurst Resort (Nos. 4, 5 & 8)" },
};
