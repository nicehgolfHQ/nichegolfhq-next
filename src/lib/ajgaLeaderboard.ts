import * as cheerio from "cheerio";

/**
 * Live leaderboard from an AJGA tournament page.
 *
 * AJGA renders its Golf Genius board into the page HTML (there is no public
 * JSON feed), one `.BottomBorderTabItem` per division ("Boys", "Girls"), each
 * holding a `table.result_scope`. We read that table and nothing else, and we
 * never fill in a value the source left blank. If the markup changes and no
 * rows parse, callers get `null` and the hub falls back to the AJGA link.
 */

export type AjgaLeaderboardRow = {
  pos: string;
  name: string;
  hometown?: string;
  /** Total to par, e.g. "-8", "E", "+3". "-" when the source has none (WD). */
  toPar: string;
  /** Holes completed today, or "F" when the round is finished. Empty when teeTime is set. */
  thru: string;
  /** Today's score to par, e.g. "E", "-2", "+1". Empty when teeTime is set. */
  today: string;
  /** Tee time when the current round has not started, e.g. "10:12 AM". */
  teeTime?: string;
  /** Gross round scores in round order. null where the source cell is blank. */
  rounds: Array<string | null>;
  total: string;
};

export type AjgaLeaderboardDivision = {
  label: string;
  roundLabels: string[];
  rows: AjgaLeaderboardRow[];
};

export type AjgaLeaderboard = {
  tournamentId: string;
  url: string;
  divisions: AjgaLeaderboardDivision[];
  /** ISO time the board was read from AJGA. */
  fetchedAt: string;
  /** Where the scores come from, for source labels. Unset means AJGA. */
  source?: string;
};

/** Seconds between reads. Each hub render reuses the cached board until it expires. */
export const AJGA_LEADERBOARD_REVALIDATE_SECONDS = 120;

export function ajgaLeaderboardUrl(tournamentId: string) {
  return `https://www.ajga.org/tournaments/${encodeURIComponent(tournamentId)}/leaderboard`;
}

function clean(text: string | undefined | null) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/** "10:12 AM" or "9:36 AM*" — not hole counts ("1", "1*", "F"). */
const TEE_TIME_RE = /^(\d{1,2}:\d{2}\s*[AaPp]\.?\s*[Mm]\.?)(\*?)$/;

export function isTeeTime(value: string): boolean {
  return TEE_TIME_RE.test(value.trim());
}

/** Display label for a not-yet-started tee time, e.g. "Tee 10:12 AM". */
export function teeTimeLabel(value: string): string {
  const match = value.trim().match(TEE_TIME_RE);
  const time = (match ? match[1] : value).replace(/\s+/g, " ").trim();
  return time ? `Tee ${time}` : "";
}

/** Split a source thru/today pair so tee times are not treated as holes completed. */
export function progressFromSource(thruRaw: string, todayRaw: string): Pick<AjgaLeaderboardRow, "thru" | "today" | "teeTime"> {
  if (isTeeTime(thruRaw)) {
    return { thru: "", today: "", teeTime: thruRaw.replace(/\*+$/, "").replace(/\s+/g, " ").trim() };
  }
  return { thru: thruRaw, today: todayRaw || "-" };
}

export function parseAjgaLeaderboard(html: string): AjgaLeaderboardDivision[] {
  const $ = cheerio.load(html);
  const divisions: AjgaLeaderboardDivision[] = [];

  $(".BottomBorderTabItem").each((divisionIndex, item) => {
    const $item = $(item);
    const table = $item.find("table.result_scope").first();
    if (!table.length) return;

    const label = clean($item.find(".BottomBorderTabItem-title").first().text()) || `Division ${divisionIndex + 1}`;
    const roundLabels = table
      .find("tr.header th.past_round_total")
      .map((_, th) => clean($(th).text()))
      .get()
      .filter(Boolean);

    const rows: AjgaLeaderboardRow[] = [];
    table.find("tr.aggregate-row").each((_, tr) => {
      const $tr = $(tr);
      const cell = (selector: string) => $tr.children(`td.${selector}`).first();
      const nameCell = cell("name");
      const name =
        clean(nameCell.find(".player .Link").first().text()) ||
        clean($tr.attr("data-aggregate-name")) ||
        clean(nameCell.clone().find(".affiliation").remove().end().text());
      if (!name) return;

      const rounds = $tr
        .children("td.past_round_total")
        .map((_, td) => clean($(td).text()) || null)
        .get() as Array<string | null>;

      rows.push({
        pos: clean(cell("pos").text()),
        name,
        hometown: clean(nameCell.find(".affiliation").first().text()) || undefined,
        toPar: clean(cell("score").text()) || "-",
        ...progressFromSource(clean(cell("past_round_thru").text()), clean(cell("past_round_to_par").text())),
        rounds: roundLabels.map((_, index) => rounds[index] ?? null),
        total: clean(cell("total").text()),
      });
    });

    if (rows.length) divisions.push({ label, roundLabels, rows });
  });

  return divisions;
}

export async function fetchAjgaLeaderboard(tournamentId: string): Promise<AjgaLeaderboard | null> {
  const url = ajgaLeaderboardUrl(tournamentId);
  try {
    const res = await fetch(url, {
      next: { revalidate: AJGA_LEADERBOARD_REVALIDATE_SECONDS },
      headers: {
        "User-Agent": "nichegolfHQ live leaderboard (+https://www.nichegolfhq.com)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const divisions = parseAjgaLeaderboard(await res.text());
    if (!divisions.length) return null;
    return { tournamentId, url, divisions, fetchedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}
