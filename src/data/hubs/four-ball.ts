export type RoundPosting = {
  /** Gross better-ball strokes. Null when the source has not printed a number. */
  strokes: number | null;
  status: "not_posted" | "incomplete" | "complete";
};

export type FourBallScore = {
  rounds: [RoundPosting, RoundPosting, RoundPosting];
  /** Total printed by the source. Never invent one by treating a missing round as zero. */
  total: number | null;
  /** Only when the source prints it and each completed round has a course par. */
  toPar: number | null;
  /** Holes completed, when the source prints it. Required before an incomplete round can be ranked. */
  thru: string | null;
  /** Place printed by the source, such as "T3". Used instead of a computed place. */
  officialPosition: string | null;
};

export type FourBallTeam = {
  id: string;
  division: "mid-am" | "senior";
  divisionLabel: string;
  names: [string, string];
  score: FourBallScore | null;
};

export type RankNote = "official" | "computed" | "in_progress" | "not_posted";

export type FourBallStanding = FourBallTeam & {
  position: string | null;
  rankNote: RankNote;
};

export function notPostedRound(): RoundPosting {
  return { strokes: null, status: "not_posted" };
}

export function emptyScore(): FourBallScore {
  return {
    rounds: [notPostedRound(), notPostedRound(), notPostedRound()],
    total: null,
    toPar: null,
    thru: null,
    officialPosition: null,
  };
}

function completeCount(score: FourBallScore) {
  return score.rounds.filter((round) => round.status === "complete" && round.strokes != null).length;
}

function hasStrokes(score: FourBallScore | null) {
  return !!score && score.rounds.some((round) => round.strokes != null);
}

/**
 * Comparable progress. Null means this card cannot be ranked against others.
 * A partial key names how many rounds are already complete and which round is
 * in progress, so 9 holes of round 1 is not the same key as 9 holes of round 2.
 */
export function progressKey(score: FourBallScore): string | null {
  const incompleteAt = score.rounds
    .map((round, index) => (round.status === "incomplete" ? index : -1))
    .filter((index) => index >= 0);
  if (incompleteAt.length > 0) {
    if (incompleteAt.length !== 1 || !score.thru || score.total == null) return null;
    const roundIndex = incompleteAt[0];
    const prior = score.rounds.slice(0, roundIndex);
    if (prior.some((round) => round.status !== "complete" || round.strokes == null)) return null;
    return `partial:${prior.length}:${roundIndex}:${score.thru}`;
  }
  const done = completeCount(score);
  if (done === 0 || score.total == null) return null;
  return `complete:${done}`;
}

function progressValue(key: string) {
  if (key.startsWith("complete:")) return Number(key.slice("complete:".length)) * 1000;
  const parts = key.split(":");
  if (parts[0] === "partial" && parts.length === 4) {
    const done = Number(parts[1]);
    const thru = Number(parts[3]);
    if (!Number.isFinite(done) || !Number.isFinite(thru)) return 0;
    return done * 1000 + thru;
  }
  return 0;
}

function placeNumber(label: string) {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function rankGroup(teams: FourBallTeam[]) {
  const sorted = teams.slice().sort((a, b) => a.score!.total! - b.score!.total!);
  const position = new Map<string, string>();
  let index = 0;
  while (index < sorted.length) {
    let end = index + 1;
    const total = sorted[index].score!.total;
    while (end < sorted.length && sorted[end].score!.total === total) end += 1;
    const place = index + 1;
    const label = end - index > 1 ? `T${place}` : String(place);
    for (let cursor = index; cursor < end; cursor += 1) position.set(sorted[cursor].id, label);
    index = end;
  }
  return position;
}

export function standings(teams: FourBallTeam[], division?: FourBallTeam["division"]): FourBallStanding[] {
  const divisions: FourBallTeam["division"][] = division ? [division] : ["mid-am", "senior"];
  const ordered: FourBallStanding[] = [];
  for (const group of divisions) {
    const rows = teams.filter((team) => team.division === group);
    const notes = new Map<string, { position: string | null; rankNote: RankNote }>();
    const official = rows.filter((team) => team.score?.officialPosition);
    for (const team of official) {
      notes.set(team.id, { position: team.score!.officialPosition, rankNote: "official" });
    }
    const rest = rows.filter((team) => !notes.has(team.id));
    // An official place and a derived place must not share one board.
    // Until every card has an official place, the rest stay unranked.
    const keyed = official.length
      ? []
      : rest.map((team) => ({ team, key: team.score ? progressKey(team.score) : null }));
    const keys = [...new Set(keyed.map((item) => item.key).filter((key): key is string => !!key))];
    const leadKey = keys.sort((a, b) => progressValue(b) - progressValue(a))[0];
    const lead = leadKey ? keyed.filter((item) => item.key === leadKey).map((item) => item.team) : [];
    const places = rankGroup(lead);
    for (const team of rest) {
      const place = places.get(team.id);
      if (place) notes.set(team.id, { position: place, rankNote: "computed" });
      else notes.set(team.id, { position: null, rankNote: hasStrokes(team.score) ? "in_progress" : "not_posted" });
    }
    const decorated = rows.map((team) => ({ team, ...notes.get(team.id)! }));
    decorated.sort((a, b) => {
      if (a.position && b.position) return placeNumber(a.position) - placeNumber(b.position);
      if (a.position) return -1;
      if (b.position) return 1;
      return 0;
    });
    for (const row of decorated) ordered.push({ ...row.team, position: row.position, rankNote: row.rankNote });
  }
  return ordered;
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

export function auditScore(score: FourBallScore, pars: Array<number | null>): string[] {
  const problems: string[] = [];
  const incomplete = score.rounds.filter((round) => round.status === "incomplete");
  const complete = score.rounds.filter((round) => round.status === "complete");
  score.rounds.forEach((round, index) => {
    if (round.status === "not_posted" && round.strokes != null) problems.push(`round ${index + 1} has strokes but is not posted`);
    if (round.status !== "not_posted" && round.strokes == null) problems.push(`round ${index + 1} is posted without strokes`);
    if (round.strokes != null && round.strokes <= 0) problems.push(`round ${index + 1} strokes are not a posted total`);
  });
  if (incomplete.length > 0 && !score.thru && score.total != null) {
    problems.push("partial total without thru");
  }
  if (incomplete.length === 0 && score.total != null && complete.length > 0) {
    const sum = complete.reduce((total, round) => total + (round.strokes as number), 0);
    if (score.total !== sum) problems.push(`total ${score.total} does not match completed rounds ${sum}`);
  }
  if (incomplete.length > 0 && score.total != null && score.thru) {
    const posted = score.rounds.filter((round) => round.strokes != null);
    const sum = posted.reduce((total, round) => total + (round.strokes as number), 0);
    if (posted.length > 0 && score.total !== sum) {
      problems.push(`partial total ${score.total} does not match posted strokes ${sum}`);
    }
  }
  if (score.toPar != null) {
    const missingPar = score.rounds.some((round, index) => round.status === "complete" && pars[index] == null);
    if (incomplete.length > 0 || missingPar || score.total == null) {
      problems.push("to-par needs a total and a par for every completed round");
    } else {
      const parSum = score.rounds.reduce((total, round, index) => {
        if (round.status !== "complete") return total;
        return total + (pars[index] as number);
      }, 0);
      if (score.toPar !== score.total - parSum) problems.push(`to-par ${score.toPar} does not match ${score.total} minus par ${parSum}`);
    }
  }
  return problems;
}

export function leaderboardCopy(status: "source_pending" | "verified" | "source_unavailable") {
  if (status === "verified") {
    return {
      field: "Posted",
      board: "Posted",
      note: "Scores are from the last verified read, not a live feed.",
    };
  }
  if (status === "source_unavailable") {
    return {
      field: "Posted",
      board: "Unavailable",
      note: "The scoring page could not be read. No scores are shown.",
    };
  }
  return {
    field: "Posted",
    board: "Not posted",
    note: "No public scoring link was found on the pages checked.",
  };
}

export function roundHasScores(teams: Array<{ score: FourBallScore | null }>, index: 0 | 1 | 2) {
  return teams.some((team) => team.score?.rounds[index]?.strokes != null);
}
