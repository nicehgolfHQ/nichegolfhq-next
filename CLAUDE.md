# nichegolfHQ — Project Playbook

This file is auto-loaded by Claude Code / Dispatch when working in this repo. Read it before answering, before editing, before publishing. It captures conventions, workflows, and gotchas earned the hard way.

If something here is wrong or stale, fix it in the same commit as the code change so the doc never drifts.

---

## What this site is

nichegolfHQ is a multi-channel publication covering competitive amateur golf:

- **midamgolfHQ** — Mid-Amateur (25+) tournaments and news
- **seniorgolfHQ** — Senior Amateur (50+) tournaments and news
- **juniorgolfHQ** — Junior amateur tournaments and news
- **Daily Briefs** — daily news roundup across all three channels

Each channel has its own home page, schedule, tournament hubs, and news articles.

Stack: Next.js 16 (App Router) on Vercel, TypeScript, Tailwind, Supabase for newsletter issues.

Deployments: every commit to `main` triggers an automatic Vercel build at https://vercel.com/jonathans-projects-0ce6ff60/nichegolfhq-next/deployments. Builds typically take 60–90 seconds.

---

## Repo map (start here)

### Tournament data (where most content edits happen)
- `src/data/tournaments/midam.ts` — Mid-Am tournaments, schedules, and `news[]` per event
- `src/lib/juniorMajors.ts` — Junior major events + news + helper functions
- `src/lib/seniorMajors.ts` — Senior major events + news + helper functions
- `src/lib/tournaments/midam.ts` — Mid-Am helpers: `getMidAmTournamentBySlug`, `getMidAmTournamentArticle`, `listMidAmTournamentArticleParams`, `getLiveMidAmTournament`
- `src/lib/tournaments/types.ts` — `Tournament`, `NewsArticle`, `liveStatus` type definitions

### Tournament hub pages (one per event)
- `src/app/midamgolfhq/[slug]/page.tsx` — e.g. `/midamgolfhq/the-jupiter-invitational`
- `src/app/seniorgolfhq/[slug]/page.tsx`
- `src/app/juniorgolfhq/[slug]/page.tsx`

### Article detail pages (dedicated SEO URLs, one per article)
- `src/app/midamgolfhq/[slug]/[article]/page.tsx`
- `src/app/seniorgolfhq/[slug]/[article]/page.tsx`
- `src/app/juniorgolfhq/[slug]/[article]/page.tsx`

These pages have NewsArticle JSON-LD, BreadcrumbList JSON-LD, og:tags, twitter:summary_large_image cards, and back-to-hub navigation built in. Static-generated (`dynamicParams = false`) — adding a new article in the data file creates a new URL on the next build.

### Hub UI components
- `src/components/tournaments/TournamentNews.tsx` — news section (featured most-recent expanded + collapsible older list with date prefix)
- `src/components/ActiveTournamentWidget.tsx` — channel home-page Live Now / Up Next widget
- `src/app/[newsletter]/page.tsx` — channel home pages (e.g. `/midamgolfhq`)

### SEO / discovery
- `src/app/sitemap.ts` — generates sitemap including all article URLs across channels

### Site root
- `src/app/page.tsx` — site home page (nichegolfhq.com root)

---

## Article schema

Articles live inside the `news?: NewsArticle[]` array on each Tournament/Major event.

```ts
{
  slug: "2026-jupiter-invitational-field-preview",   // url-safe, unique within a tournament
  title: "The Jupiter Invitational Tees Off: ...",
  date: "2026-05-06",                                // ISO date string, drives sort order
  author: "midamgolfHQ Staff",                       // or seniorgolfHQ Staff / juniorgolfHQ Staff
  summary: "One-sentence hook used as og:description and the article subhead.",
  content: [                                         // each string = one paragraph
    "Paragraph 1 ...",
    "Paragraph 2 ...",
  ],
  photos?: ["https://..."],                          // optional; first photo becomes og:image
}
```

### URL pattern (auto-generated)

- `/midamgolfhq/{tournament-slug}/{article-slug}`
- `/seniorgolfhq/{tournament-slug}/{article-slug}`
- `/juniorgolfhq/{tournament-slug}/{article-slug}`

### Sort order

Articles on the hub page are sorted by `date` descending. The newest is featured (always expanded). Older ones appear in a collapsible row list with `MMM D, YYYY` date prefix.

### Inline links in article content

Article paragraphs support `[link text](url)` markdown syntax. The renderer converts these to real `<Link>` elements with emerald-700 styling. Use this to link back to the tournament hub for live scoring, e.g.:

```ts
"Live scoring and full tournament coverage can be found on the [Jupiter Invitational tournament hub here](/midamgolfhq/the-jupiter-invitational).",
```

Always include this kind of internal link in paragraph 1 of new articles. Good for UX and SEO.

---

## Tournament lifecycle and `liveStatus`

The channel home-page widget (`ActiveTournamentWidget`) reads `liveStatus` to decide what to show:

- `"next"` — widget shows "UP NEXT" eyebrow, no green Live Scoring button
- `"live"` — widget shows "LIVE NOW" eyebrow + green Live Scoring button (requires `golfGeniusUrl`)
- `"completed"` — widget hidden
- omitted — widget hidden

### Standard event flow

1. Event ~2 weeks out → set `liveStatus: "next"`. Optionally publish a preview article.
2. Event starts → flip to `liveStatus: "live"`. Confirm `golfGeniusUrl` is set. Publish round-by-round recaps.
3. Event ends → flip to `liveStatus: "completed"`. Publish final recap.

Only one tournament per channel should be `live` or `next` at a time, since the widget shows the first match it finds.

---

## Voice and style rules (HARD — do not violate without asking)

These came from explicit user feedback. The user reads every article before it ships and will catch violations.

### No em-dashes
Anywhere. Replace with periods, commas, semicolons, or restructure. Em-dashes feel AI-generated and the user has called this out specifically.

### No course architect references in editorial copy
Don't write "the Hanse-designed Match Course" or "Tom Doak's masterpiece." The course can be named, but its architect is not relevant to the story. (`courseDesigner` can still be filled in the data — it's just not for editorial.)

### No "picks" or "favorites to win" unless explicitly asked
Don't write "the pick here is X" or "X is the clear favorite to win." Stick to credentials, recent results, ranking citations, and storylines. If the user explicitly asks for picks, you can include them.

### Article length conventions
- **Preview articles**: 3 paragraphs (event setup → top contenders with credentials → dark horses + storylines + sign-off)
- **Round recaps**: 2 paragraphs (what happened in the round → what to watch tomorrow)
- **Final recap**: 2 paragraphs (the win + how it happened → context, season impact, what's next)

### Always show drafts before publishing — DEFAULT BEHAVIOR
Unless the user explicitly says "ship it" or "publish directly," draft the article in chat and wait for approval before adding it to the data file. Even for round recaps, default to "show first." If the user gets impatient, ask once for confirmation, then ship.

### Link back to the tournament hub from every article
Mention live scoring (or the tournament hub) inline in paragraph 1 using markdown link syntax. Internal linking is critical for both UX and Google News indexing.

### Mid-Am vs Senior vs Junior content
The user has specified that some events are mid-am-only coverage. Default for `midamgolfhq` channel articles: cover only mid-am players. Ask before mixing in senior/junior coverage.

### Sign-off
End preview and recap articles with: `"midamgolfHQ will be tracking the action all week from {location}."` (or the equivalent for other channels). For final recaps, swap in something like: `"midamgolfHQ will be back next week with coverage from {next event}."`

---

## Player identification (read carefully — wrong-player attributions are an emergency)

- **Nate Smith**: There are two competitive amateurs named Nate Smith. The four-time U.S. Mid-Amateur champion is NOT typically the one in the fields we cover. NEVER ascribe USGA championship wins to a Nate Smith without verifying via amateurgolfinfo.com. The user has flagged this once already.
- **Snedekers**: Brandt Snedeker is the PGA Tour pro. Haymes Snedeker is the brother and a competitive mid-am who hosts the Snedeker Memorial. They are different people. When writing about Haymes, do not mention Brandt unless the user explicitly asks.
- **Clemens**: Kacy Clemens is a former University of Texas Baseball player who plays serious mid-am golf. Roger Clemens is his father. DO NOT mention Roger in editorial copy unless the user explicitly asks.

---

## Sources and research

### Player rankings
- **Use**: https://www.amateurgolfinfo.com/rankings/mens (apply the Level filter for Mid-Am or Senior)
- Individual player pages: `https://www.amateurgolfinfo.com/rankings/mens/{first-last}-{id}`
- **Do NOT use** amateurgolf.com — different site, the user has explicitly redirected away from it.

### Live scoring / round results
Each tournament has a `golfGeniusUrl` pointing to its Golf Genius page. Pull leaderboards and round-by-round scores from there. Verify the round-of-the-day, leader, and ties before writing — do not assume.

### Tournament context
Use the tournament's own page, USGA records, and the player's amateurgolfinfo profile. When citing rankings or stats, name the source ("ranked 12th among mid-amateurs in the world on amateurgolfinfo.com"). Don't make up numbers.

---

## Common workflows (with concrete steps)

### "Write a preview for [event]"
1. Find the event in `src/data/tournaments/midam.ts` (or junior/senior file). Note `slug`, `course`, `location`, `dates2026`, `golfGeniusUrl`.
2. Pull the player field from the user's message OR from the tournament hub page if available.
3. Cross-reference against amateurgolfinfo.com Mid-Am (or Senior) rankings. Search top players individually if needed.
4. Draft 3 paragraphs (event setup → top contenders with rankings → dark horses + storylines + sign-off).
5. Include a markdown link in paragraph 1 to the tournament hub for live scoring.
6. **Show the draft to the user. Wait for approval.**
7. On approval, add the article to the event's `news: [...]` array as the FIRST item (newest first).
8. Commit with a message like "Add 2026 {event} field preview article."

### "Round 1 / Round 2 recap for [event]"
1. Pull leaderboard from the event's Golf Genius page.
2. Identify the leader, anyone tied, the round-of-the-day score, notable names. Verify each name and number before writing.
3. Draft 2 paragraphs (what happened → what to watch tomorrow).
4. Show to user. Default: show first. Only ship without review if the user says "ship it" explicitly.
5. Add to news array as the newest item (top of the array).
6. Commit.

### "Final recap"
1. Pull final leaderboard and winning score.
2. Draft 2 paragraphs (the win and key moments → context and what's next).
3. Same review-then-publish flow.
4. Also flip `liveStatus` from `"live"` to `"completed"` in the same commit, or as a follow-up.

### "Flip the home-page widget to the next event"
1. Find the just-completed event's entry, change `liveStatus` to `"completed"`.
2. Find the next event's entry, set `liveStatus: "next"` (or `"live"` if it has actually started).
3. Verify `golfGeniusUrl` is present on the next event before flipping to `"live"`.
4. Commit.

### "Add a live scoring link"
The field is `golfGeniusUrl: "https://www.golfgenius.com/pages/..."` on the tournament entry. Place it near `format`, `howToPlay`, etc. It's read by both the tournament hub page and the home-page widget.

### "Add a tournament to the schedule"
Add a new object to the `MIDAM_TOURNAMENTS` (or `JUNIOR_MAJOR_EVENTS_2026` / `SENIOR_MAJOR_EVENTS_2026`) array. Required fields: `slug`, `name`, `channel`, `month`. Optional but commonly set: `dates2026`, `course`, `location`, `coursePar`, `courseYardage`, `courseRating`, `courseSlope`, `courseTeeName`, `courseDesigner`, `format`, `howToPlay`, `golfGeniusUrl`.

---

## Editor and commit workflow notes (when working in the GitHub web editor)

This codebase is edited via the GitHub web editor (CodeMirror 6) when working from Dispatch on mobile.

- **Cmd+F** opens find. **Cmd+H** opens find/replace. Click into the editor first; if the shortcut doesn't fire, dispatch a synthetic `KeyboardEvent` with `metaKey: true` from the JS console.
- **Triple-click** selects a full line including the trailing newline. If you replace with content that doesn't end in `\n`, you smash the next line onto the current one. Always include `\n` in your replacement, OR re-add a newline after the insertion. This bug has caused multiple Vercel build failures.
- **Cmd+A** does NOT reliably select the entire file in CM6 when the file is virtualized. For full-file replacements, use Cmd+H with regex, or delete-then-insert in chunks.
- After every commit, Vercel kicks off an automatic deploy. Check `https://vercel.com/jonathans-projects-0ce6ff60/nichegolfhq-next/deployments` ~60–90 seconds later for build status.
- Build errors surface within 30 seconds of the build starting. If a build fails, click into the deployment, scroll the Build Logs, and look for the line number — it's almost always a smashed line, dropped quote, or missing brace from a previous edit.

### Commit message style
Short, imperative, present tense:
- "Add 2026 Jupiter Invitational field preview article"
- "Change liveStatus from 'next' to 'live'"
- "Fix typo in RelatedEvents prop from 'vents' to 'events'"

---

## SEO setup (already wired)

What's done:
- Each article has a dedicated static URL with NewsArticle JSON-LD, BreadcrumbList JSON-LD, og:tags, twitter:summary_large_image.
- All article URLs are listed in `src/app/sitemap.ts`.
- Hub pages link to article URLs via the "View full article →" link beneath the featured article and the click target on each collapsible older row.
- Inline `[text](url)` markdown in article content renders as proper internal links.

What is NOT yet automated and needs the user to do manually:
- Submitting the publication to Google News Publisher Center (publishercenter.google.com)
- Verifying sitemap submission in Google Search Console
- Requesting indexing for newly published article URLs in GSC

If the user asks why articles aren't appearing in Google News, point at those manual steps.

---

## Things to never do

- Never publish an article without the user's review (unless they explicitly say "ship it").
- Never use em-dashes in editorial copy.
- Never make a "pick to win" claim unless the user explicitly asks for one.
- Never reference course architects in editorial copy.
- Never confuse Brandt Snedeker (PGA pro) with Haymes Snedeker (mid-am host of Snedeker Memorial).
- Never use amateurgolf.com as a source. Use amateurgolfinfo.com.
- Never reference Roger Clemens when writing about Kacy Clemens.
- Never claim a player has won the U.S. Mid-Amateur unless verified via a primary source.
- Never push code that smashes a line break (it'll break Vercel build). Re-read the diff before committing.

---

## Quick reference: tournament data shape

```ts
type Tournament = {
  slug: string;
  name: string;
  channel: "midam" | "junior" | "senior";
  liveStatus?: "live" | "next" | "completed" | "upcoming";
  logo?: string;
  month?: number;
  dates2026?: string;
  course?: string;
  location?: string;
  coursePar?: number;
  courseYardage?: number;
  courseRating?: number;
  courseSlope?: number;
  courseTeeName?: string;
  courseDesigner?: string;          // ok in data, not in editorial copy
  courseNotes?: string;
  golfGeniusUrl?: string;           // live scoring link
  format?: string;
  howToPlay?: HowToPlayEntry[];
  news?: NewsArticle[];
  pastResults?: { year: number; champion: string }[];
};

type NewsArticle = {
  slug: string;
  title: string;
  date: string;                     // ISO yyyy-mm-dd
  author?: string;
  summary?: string;
  content: string[];                // each string is one paragraph; supports [text](url) markdown links
  photos?: string[];
};
```

---

End of playbook. If you find yourself re-explaining a convention to the user, that convention probably belongs in this file. Add it.
