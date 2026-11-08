export type RoundPosting = {
  /** Gross better-ball strokes. Null when the source has not printed a number. */
  strokes: number | null;
  status: "not_posted" | "incomplete" | "complete";
};

export type FourBallScore = {
  rounds: [RoundPosting, RoundPosting, RoundPosting];
  /** Use the total printed by the source. Do not fill a missing round with zero. */
  total: number | null;
  toPar: number | null;
  thru: string | null;
};

export type FourBallTeam = {
  id: string;
  division: "mid-am" | "senior";
  divisionLabel: string;
  names: [string, string];
  score: FourBallScore | null;
};

export type FourBallStanding = FourBallTeam & { position: string | null };

export function notPostedRound(): RoundPosting {
  return { strokes: null, status: "not_posted" };
}

export function standings(teams: FourBallTeam[], division?: FourBallTeam["division"]): FourBallStanding[] {
  const rows = division ? teams.filter((team) => team.division === division) : teams.slice();
  const ranked = rows.filter((team) => team.score?.total != null);
  ranked.sort((a, b) => a.score!.total! - b.score!.total!);
  const position = new Map<string, string>();
  let index = 0;
  while (index < ranked.length) {
    let end = index + 1;
    const total = ranked[index].score!.total;
    while (end < ranked.length && ranked[end].score!.total === total) end += 1;
    const place = index + 1;
    const label = end - index > 1 ? `T${place}` : String(place);
    for (let cursor = index; cursor < end; cursor += 1) position.set(ranked[cursor].id, label);
    index = end;
  }
  return rows.map((team) => ({ ...team, position: position.get(team.id) ?? null }));
}

export function roundCell(score: FourBallScore | null, index: 0 | 1 | 2): string {
  const round = score?.rounds[index];
  if (!round || round.status === "not_posted" || round.strokes == null) return "";
  return String(round.strokes);
}

export function totalCell(score: FourBallScore | null): string {
  if (score?.total == null) return "";
  return String(score.total);
}
