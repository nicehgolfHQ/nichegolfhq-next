"use client";

import { useMemo, useState } from "react";
import type { Tournament } from "@/lib/tournaments/types";
import { TournamentOverview } from "@/components/tournaments/TournamentOverview";
import { TournamentResults } from "@/components/tournaments/TournamentResults";
import { TournamentFieldPlaceholder } from "@/components/tournaments/TournamentFieldPlaceholder";

type TabKey = "overview" | "results" | "field";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "results", label: "Results" },
  { key: "field", label: "Field & Rankings" },
];

export function TournamentTabs({ tournament }: { tournament: Tournament }) {
  const [active, setActive] = useState<TabKey>("overview");

  const content = useMemo(() => {
    if (active === "results") return <TournamentResults tournament={tournament} />;
    if (active === "field") return <TournamentFieldPlaceholder />;
    return <TournamentOverview tournament={tournament} />;
  }, [active, tournament]);

  return (
    <section className="mt-6">
      <div className="flex gap-4 border-b border-zinc-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
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

      <div className="mt-5">{content}</div>
    </section>
  );
}
