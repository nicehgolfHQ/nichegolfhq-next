"use client";

import { useState } from "react";
import type { Tournament } from "@/lib/tournaments/types";
import { TournamentOverview } from "@/components/tournaments/TournamentOverview";
import { TournamentResults } from "@/components/tournaments/TournamentResults";

type TabKey = "overview" | "results";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "results", label: "Past winners" },
];

export function TournamentTabs({ tournament }: { tournament: Tournament }) {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <section className="mt-6">
      <div className="flex justify-center gap-4 border-b border-zinc-200 px-6" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={
              "pb-3 text-sm font-medium transition " +
              (active === t.key
                ? "text-zinc-950 border-b-2 border-zinc-950"
                : "text-zinc-600 hover:text-zinc-900")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Both panels are in the initial HTML. Tabs only show and hide them. */}
      <div className="mt-5" role="tabpanel" hidden={active !== "overview"}>
        <TournamentOverview tournament={tournament} />
      </div>
      <div className="mt-5" role="tabpanel" hidden={active !== "results"}>
        <TournamentResults tournament={tournament} />
      </div>
    </section>
  );
}
