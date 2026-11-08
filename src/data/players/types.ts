/** Stable player identity. One id is one person. Do not reuse an id for a different person. */
export type PlayerId = string;

export type FactSource = {
  url: string;
  title: string;
  /** ISO-8601 with a numeric offset, in the event's local timezone. */
  checkedAt: string;
  /** What this source actually established. */
  established: string;
};

export type Player = {
  id: PlayerId;
  /** Exact name from the source that created the id. */
  name: string;
  sources: FactSource[];
};

export type PlayerAppearance = {
  playerId: PlayerId;
  eventSlug: string;
  year: number;
  /** Team or pairing label from the source, when the event is not individual. */
  sideLabel?: string;
  partnerIds?: PlayerId[];
  /** Result text copied from the source. Omit when the player is only listed. */
  result?: string;
  sources: FactSource[];
};
