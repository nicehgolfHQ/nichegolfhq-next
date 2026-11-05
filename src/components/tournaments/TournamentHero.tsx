import Image from "next/image";
import type { Tournament } from "@/lib/tournaments/types";
import { resolveDatesLabel } from "@/lib/tournaments/dates";

export function TournamentHero({ tournament }: { tournament: Tournament }) {
  const dates = resolveDatesLabel(
    tournament.startDate,
    tournament.endDate,
    tournament.dates2026 ?? tournament.typicalDates
  );

  return (
    <section className="text-center">
      {tournament.logo ? (
        <div className="flex items-center justify-center gap-4">
          <Image
            src={tournament.logo}
            alt="Event logo"
            width={60}
            height={60}
            className="h-[60px] w-auto"
          />
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            {tournament.name}
          </h1>
        </div>
      ) : (
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          {tournament.name}
        </h1>
      )}

      <div className="mt-4 text-sm text-zinc-500">
        {[tournament.course, tournament.location].filter(Boolean).join(" \u2022 ")}
      </div>
      {dates ? (
        <div className="mt-2 text-base font-semibold text-zinc-900">{dates}</div>
      ) : null}

      {tournament.tournamentWebsite ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <a
            href={tournament.tournamentWebsite}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-400 transition hover:border-zinc-300 hover:text-zinc-600"
          >
            <span>{tournament.tournamentWebsiteLabel ?? "Tournament Website / Data Source"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-3 w-3"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      ) : null}

      {tournament.prestige ? (
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm italic text-zinc-500">
            &ldquo;{tournament.prestige}&rdquo;
          </div>
        </div>
      ) : null}

      {tournament.golfGeniusUrl ? (
        <div className="mt-8">
          <a
            href={tournament.golfGeniusUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg"
            title={tournament.golfGeniusCode ? `Golf Genius ID: ${tournament.golfGeniusCode}` : undefined}
          >
            <span>
              {tournament.golfGeniusCode
                ? `Live Scoring · ${tournament.golfGeniusCode}`
                : (tournament.golfGeniusUrlLabel ?? "Live Scoring")}
            </span>
          </a>
        </div>
      ) : tournament.golfGeniusCode ? (
        <div className="mt-8">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-zinc-900 shadow-sm"
            title={`Golf Genius ID: ${tournament.golfGeniusCode}`}
          >
            <span>Live Scoring · {tournament.golfGeniusCode}</span>
          </span>
        </div>
      ) : null}
    </section>
  );
}
