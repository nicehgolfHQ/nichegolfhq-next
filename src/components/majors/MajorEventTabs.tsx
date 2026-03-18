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
  course,
  location,
  coursePar,
  format,
  fieldSize,
  eligibility,
  overview,
  pastResults,
}: {
  brand: "juniorgolfHQ" | "seniorgolfHQ";
  name: string;
  month: string;
  officialUrl?: string;
  note?: string;
  resultsHref?: string;
  winners: { year: number; champion: string }[];
  course?: string;
  location?: string;
  coursePar?: number;
  format?: string;
  fieldSize?: string;
  eligibility?: string;
  overview?: string;
  pastResults?: { year: number; champion: string; score?: string; runnerUp?: string }[];
}) {
  const [active, setActive] = useState<TabKey>("overview");

  const content = useMemo(() => {
    if (active === "results") {
      const pastRows = (pastResults || []).map(r => ({ year: r.year, champion: r.champion + (r.score ? " (" + r.score + ")" : "") }));
      const allWinners = [...winners, ...pastRows].sort((a, b) => b.year - a.year);
      return <MajorEventResults rows={allWinners} />;
    }
    return (
      <MajorEventOverview
        brand={brand}
        name={name}
        month={month}
        officialUrl={officialUrl}
        note={note}
        resultsHref={resultsHref}
        winners={winners}
        course={course}
        location={location}
        coursePar={coursePar}
        format={format}
        fieldSize={fieldSize}
        eligibility={eligibility}
        overview={overview}
      />
    );
  }, [active, brand, month, name, note, officialUrl, resultsHref, winners, course, location, coursePar, format, fieldSize, eligibility, overview, pastResults]);

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
