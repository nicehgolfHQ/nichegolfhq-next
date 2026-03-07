#!/usr/bin/env node
/**
 * generate-brief.mjs
 * Generates a daily brief for nichegolfHQ using the Claude API with web search.
 * Called by the daily-brief GitHub Action.
 */
import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from "node:fs";

const client = new Anthropic();

// Today's date in YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];
const [y, m, d] = today.split("-").map(Number);
const dateObj = new Date(Date.UTC(y, m - 1, d));
const prettyDate = dateObj.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const PROMPT = `You are a content writer for nichegolfHQ.com, a site covering competitive amateur golf across three categories: juniors, mid-am (mid-amateur), and seniors.

Today is ${today}. Generate a daily brief markdown file with EXACTLY this format:

---
title: Daily Brief â ${prettyDate}
---

- [Headline title here](https://source-url.com) â Source Name
  On ${today}: one or two sentence summary of why this matters
  Tags: category

- [Second headline](https://source-url.com) â Source Name
  On ${today}: summary text here
  Tags: category

- [Third headline](https://source-url.com) â Source Name
  On ${today}: summary text here
  Tags: category

RULES:
- Produce EXACTLY 3 items: 1 juniors, 1 mid-am, 1 senior
- Each item MUST link to a REAL, currently live web page (verify the URL exists via search)
- The "On" line MUST start with exactly "On ${today}:" (ISO date format)
- Tags MUST be exactly one of: juniors, mid-am, senior
- The "why" summary must NOT contain any URLs
- Headlines should cover current tournaments, rankings, qualifications, or notable news
- Keep summaries factual and concise (1-2 sentences)
- Use web search to find the latest real news in each category

Search for current junior golf news, mid-amateur golf news, and senior amateur golf news. Prioritize:
- Tournament announcements or results (USGA, HJGT, AJGA, state associations)
- Ranking updates from amateurgolfinfo.com
- Championship qualifications or entries
- Notable player stories

OUTPUT ONLY the raw markdown starting with --- and ending after the last Tags line. No code fences, no explanation, no extra text.`;

let messages = [{ role: "user", content: PROMPT }];

// Loop to handle pause_turn (multi-search scenarios)
let finalResponse;
for (let i = 0; i < 8; i++) {
  console.log(`API call ${i + 1}...`);
  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 15,
      },
    ],
    messages,
  });

  console.log(`  stop_reason: ${response.stop_reason}`);
  console.log(
    `  searches: ${response.usage?.server_tool_use?.web_search_requests ?? 0}`
  );

  if (response.stop_reason === "pause_turn") {
    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: "Continue searching and complete the brief.",
    });
  } else {
    finalResponse = response;
    break;
  }
}

if (!finalResponse) {
  console.error("Failed to get a complete response after 8 iterations");
  process.exit(1);
}

// Extract all text blocks from the response
const textBlocks = finalResponse.content
  .filter((b) => b.type === "text")
  .map((b) => b.text);

// The response may contain reasoning text before the actual brief.
// We need to find the markdown that starts with "---" frontmatter.
let markdown = "";

// Strategy 1: Check each text block for one that starts with ---
for (const block of textBlocks) {
  const trimmed = block.trim();
  if (trimmed.startsWith("---")) {
    markdown = trimmed;
    break;
  }
}

// Strategy 2: If no block starts with ---, search within the joined text
if (!markdown) {
  const joined = textBlocks.join("\n").trim();
  const fmStart = joined.indexOf("\n---\n");
  if (fmStart !== -1) {
    markdown = joined.slice(fmStart + 1).trim();
  } else {
    const fmStart2 = joined.indexOf("---\n");
    if (fmStart2 !== -1) {
      markdown = joined.slice(fmStart2).trim();
    }
  }
}

// Strategy 3: If still nothing, try to extract from code fences
if (!markdown) {
  const joined = textBlocks.join("\n");
  const fenceMatch = joined.match(/```(?:markdown)?\s*\n(---[\s\S]+?)```/);
  if (fenceMatch) {
    markdown = fenceMatch[1].trim();
  }
}

// Clean up: remove code fences if still present
markdown = markdown
  .replace(/^```(?:markdown)?\n?/m, "")
  .replace(/\n?```$/m, "")
  .trim();

// Final check
if (!markdown.startsWith("---")) {
  console.error("Generated content does not start with frontmatter ---");
  console.error(
    "All text blocks:",
    textBlocks.map((b) => b.slice(0, 100))
  );
  process.exit(1);
}

const outPath = `src/content/briefs/${today}.md`;
writeFileSync(outPath, markdown + "\n");
console.log(`\nWritten brief to ${outPath}`);
console.log(`\nContent:\n${markdown}`);
