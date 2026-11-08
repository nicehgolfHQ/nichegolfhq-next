# Hub score updates

This is the checklist for a future once-daily read of a public scoring page. It is not a live feed. Do not describe a hub as real time.

The Ewing Cup is the first event on this model. Other tournament hubs stay on the existing pages until someone deliberately moves them.

## When to read

Once a day, in `America/Chicago`, while the event is on the calendar. Skip the read if nothing public could have changed, and still record that you looked when you do look.

## What to open

Use only public pages. Do not sign in, do not call a private Golf Genius API, and do not use an access code that is not already printed for readers.

For the Ewing Cup the current sources are on `EWING_SNAPSHOT` in `src/data/hubs/ewing-cup-four-ball.ts`:

- https://www.ewingcup.com/
- https://www.ewingcup.com/tournament-information

There is no public leaderboard URL yet. If a later page prints one, add that URL to the snapshot before copying any names or scores.

## Status values

Set these from what the page actually did.

- `not_published` on the field: the pages checked loaded, and none of them listed entrants.
- `posted` on the field: a supplied sheet or public list named the players. Record that check separately from the scoring check.
- `source_pending` on the leaderboard: no public scoring link was found on the pages checked. This is not a claim that no scoring page can exist, and it is not an error.
- `verified` on the leaderboard: names and scores were copied from a public page on this read.
- `source_unavailable`: a known URL failed, timed out, or asked for a sign-in. Write the URL and what blocked it under `missingInput`. Do not fill scores from memory.
- `verified`: names and scores were copied from a public page on this read.

Timestamps are ISO-8601 with a numeric offset. Central time is `-06:00` in standard time and `-05:00` during daylight saving time. The field sheet and the scoring-page check keep separate timestamps. Do not invent a minute you did not check.

## Adding a player

1. Copy the full name exactly as published.
2. The id is the lower-case name with hyphens: `charlie-holland`.
3. If that id already exists, attach the new appearance only when the full name matches. A shared last name is not a match.
4. If the same full name might be two people, do not merge them. Wait for the source to distinguish them, then use a new id and record why in `sources`.
5. Put the person in `src/data/players/registry.ts` and one `PlayerAppearance` per event. Four-ball partners go in `partnerIds` and `sideLabel`.
6. Every new fact needs a `FactSource` with the URL, title, `checkedAt`, and a sentence on what it established.

Do not add a bio, a headshot, a ranking, or a career record that the source did not print.

## Adding scores

Scores belong on the event snapshot, keyed by player id. A four-ball row has two ids. Leave a round blank when the board has not printed it. Do not type a zero for a round that has not started.

After the edit, `verifyEwingSnapshot()` must still pass. The hub page calls it.

## What not to change

Do not retarget East vs West, the National Invitational, or any other hub as part of a Ewing update. Do not change consent, and do not add a database migration for this registry.
