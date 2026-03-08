"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RankedPlayer {
  id: number;
  firstName: string;
  lastName: string;
  slug: string;
  rank: number;
  filteredRank: number;
  countryCode: string;
  countryName: string;
  countingEvents: number;
  pointsPerEvent: number;
  strokesGained: number;
  playerRecord: { wins: number; losses: number; ties: number };
}

const API_URL =
  "https://www.amateurgolfinfo.com/apiv1/players?page=1&limit=10&mensDivision=true&level=Mid-Am";

export function MidAmRankings() {
  const [players, setPlayers] = useState<RankedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch(API_URL)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setPlayers(d.items ?? []);
          setRefreshedAt(
            new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-black/60 p-6 backdrop-blur-md">
        <h2 className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Mid-Am Rankings
        </h2>
        <div className="flex items-center justify-center py-8 text-sm text-white/30">
          Loading rankings\u2026
        </div>
      </div>
    );
  }

  if (!players.length) return null;

  return (
    <div className="rounded-2xl bg-black/60 p-6 backdrop-blur-md">
      <h2 className="mb-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Mid-Am Rankings
      </h2>
      {refreshedAt ? (
        <p className="mb-5 text-center text-[10px] text-white/25">
          Updated {refreshedAt}
        </p>
      ) : null}

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/30">
              <th className="pb-3 pr-3 font-semibold">#</th>
              <th className="pb-3 pr-3 font-semibold">Player</th>
              <th className="pb-3 pr-3 text-right font-semibold">Pts/Evt</th>
              <th className="hidden pb-3 pr-3 text-right font-semibold sm:table-cell">SG</th>
              <th className="hidden pb-3 text-right font-semibold md:table-cell">Record</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 last:border-b-0"
              >
                <td className="py-2.5 pr-3 font-mono text-xs text-white/50">
                  {p.filteredRank}
                </td>
                <td className="py-2.5 pr-3 font-medium text-white">
                  {p.firstName} {p.lastName}
                </td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs text-white/70">
                  {p.pointsPerEvent.toFixed(2)}
                </td>
                <td className="hidden py-2.5 pr-3 text-right font-mono text-xs text-white/70 sm:table-cell">
                  {p.strokesGained > 0 ? "+" : ""}{p.strokesGained.toFixed(2)}
                </td>
                <td className="hidden py-2.5 text-right font-mono text-xs text-white/50 md:table-cell">
                  {p.playerRecord.wins}-{p.playerRecord.losses}-{p.playerRecord.ties}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* attribution link */}
      <div className="mt-4 text-center">
        <Link
          href="https://www.amateurgolfinfo.com/rankings/mens"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-white/30 underline underline-offset-2 transition hover:text-white/50"
        >
          Full rankings at Amateur Golf Info
        </Link>
      </div>
    </div>
  );
}
