"use client";

import { useMemo, useState } from "react";
import { MajorEventOverview } from "@/components/majors/MajorEventOverview";
import { MajorEventResults } from "@/components/majors/MajorEventResults";

type TabKey = "overview" | "results";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "results", label: "Past winners" },
];

export function MajorEventTabs({
  brand,
  name,
  month,
  officialUrl,
  note,
  resultsHref,
  winners,
}: {
  brand: "juniorgolfHQ" | "seniorgolfHQ";
  name: string;
  month: string;
  officialUrl?: string;
  note?: string;
  resultsHref?: string;
  winners: { year: number; champion: string }[];
}) {
  const [active, setActive] = useState<TabKey>("overview");

  const content = useMemo(() => {
    if (active === "results") return <MajorEventResults rows={winners} />;
    return (
      <MajorEventOverview
        brand={brand}
        name={name}
        month={month}
        officialUrl={officialUrl}
        note={note}
        resultsHref={resultsHref}
        winners={winners}
      />
    );
  }, [active, brand, month, name, note, officialUrl, resultsHref, winners]);

  return (
    <section className="mt-6">
      <div className="flex justify-center gap-4 border-b border-zinc-200 px-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={
              "pb-3 text-sm font-medium transition " +
              (active === t.key ? "text-zinc-950 border-b-2 border-zinc-950" : "text-zinc-600 hover:text-zinc-900")
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
