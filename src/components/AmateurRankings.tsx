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
  strokesGained: number | null;
  playerRecord: { wins: number; losses: number; ties: number };
}

interface RankingsTableProps {
  title: string;
  players: RankedPlayer[];
  loading: boolean;
}

function RankingsTable({ title, players, loading }: RankingsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-black/60 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
          {title}
        </h3>
        <div className="flex items-center justify-center py-8 text-sm text-white/30">
          Loading rankings…
        </div>
      </div>
    );
  }

  if (!players.length) return null;

  return (
    <div className="rounded-2xl bg-black/60 p-6 backdrop-blur-md">
      <h3 className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </h3>
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
                  {p.strokesGained != null
                    ? `${p.strokesGained > 0 ? "+" : ""}${p.strokesGained.toFixed(2)}`
                    : "—"}
                </td>
                <td className="hidden py-2.5 text-right font-mono text-xs text-white/50 md:table-cell">
                  {p.playerRecord.wins}-{p.playerRecord.losses}-{p.playerRecord.ties}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const BASE_URL =
  "https://www.amateurgolfinfo.com/apiv1/players?page=1&limit=10";

type BrandSlug = "midamgolfhq" | "juniorgolfhq" | "seniorgolfhq";

const BRAND_CONFIG: Record<
  BrandSlug,
  {
    heading: string;
    tables: { title: string; mensDivision: boolean; level: string }[];
    linkUrl: string;
    linkLabel: string;
  }
> = {
  midamgolfhq: {
    heading: "Mid-Am Rankings",
    tables: [
      { title: "Men’s Top 10", mensDivision: true, level: "Mid-Am" },
      { title: "Women’s Top 10", mensDivision: false, level: "Mid-Am" },
    ],
    linkUrl: "https://www.amateurgolfinfo.com/rankings/mens",
    linkLabel: "Full rankings at Amateur Golf Info",
  },
  juniorgolfhq: {
    heading: "Junior Rankings",
    tables: [
      { title: "Boys Top 10", mensDivision: true, level: "Junior" },
      { title: "Girls Top 10", mensDivision: false, level: "Junior" },
    ],
    linkUrl: "https://www.amateurgolfinfo.com/rankings/mens",
    linkLabel: "Full rankings at Amateur Golf Info",
  },
  seniorgolfhq: {
    heading: "Senior Rankings",
    tables: [
      { title: "Men’s Top 10", mensDivision: true, level: "Senior" },
      { title: "Women’s Top 10", mensDivision: false, level: "Senior" },
    ],
    linkUrl: "https://www.amateurgolfinfo.com/rankings/mens",
    linkLabel: "Full rankings at Amateur Golf Info",
  },
};

export function AmateurRankings({ brand }: { brand: BrandSlug }) {
  const config = BRAND_CONFIG[brand];
  const [data, setData] = useState<RankedPlayer[][]>(
    config.tables.map(() => [])
  );
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      config.tables.map((t) =>
        fetch(
          `${BASE_URL}&mensDivision=${t.mensDivision}&level=${t.level}`
        )
          .then((r) => r.json())
          .then((d) => (d.items ?? []) as RankedPlayer[])
          .catch(() => [] as RankedPlayer[])
      )
    ).then((results) => {
      if (cancelled) return;
      setData(results);
      setRefreshedAt(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [config.tables]);

  return (
    <div>
      <h2 className="mb-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {config.heading}
      </h2>
      {refreshedAt ? (
        <p className="mb-5 text-center text-[10px] text-white/25">
          Updated {refreshedAt}
        </p>
      ) : (
        <div className="mb-5" />
      )}

      <div className="space-y-6">
        {config.tables.map((t, i) => (
          <RankingsTable
            key={t.title}
            title={t.title}
            players={data[i]}
            loading={loading}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={config.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-white/30 underline underline-offset-2 transition hover:text-white/50"
        >
          {config.linkLabel}
        </Link>
      </div>
    </div>
  );
}
