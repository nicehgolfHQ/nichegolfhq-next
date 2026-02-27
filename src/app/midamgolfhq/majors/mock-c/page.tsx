import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

type EventItem = { name: string; month: string };

type MonthBlock = { month: string; events: EventItem[] };

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/women’s/g, "womens")
    .replace(/’/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const MONTHS: MonthBlock[] = [
  { month: "January 2026", events: [{ name: "The Tree Farm Invitational", month: "January 2026" }] },
  { month: "February 2026", events: [{ name: "Gasparilla Invitational", month: "February 2026" }] },
  {
    month: "March 2026",
    events: [
      { name: "The Snedeker Memorial", month: "March 2026" },
      { name: "The Tabby Four-Ball", month: "March 2026" },
      { name: "Champions Cup Four-Ball", month: "March 2026" },
    ],
  },
  {
    month: "May 2026",
    events: [
      { name: "The Giles Invitational", month: "May 2026" },
      { name: "The Jupiter Invitational", month: "May 2026" },
      { name: "The Walter J. Travis Invitational", month: "May 2026" },
      { name: "John T. Lupton Memorial", month: "May 2026" },
      { name: "The Huddleston Cup", month: "May 2026" },
    ],
  },
  {
    month: "June 2026",
    events: [
      { name: "C.B Macdonald Invitational Tournament", month: "June 2026" },
      { name: "Anderson Memorial Four-Ball", month: "June 2026" },
      { name: "George C Thomas Invitational", month: "June 2026" },
    ],
  },
  {
    month: "September 2026",
    events: [
      { name: "USGA Women’s Mid-Am", month: "September 2026" },
      { name: "Trans-Miss Mid-Master Championship", month: "September 2026" },
      { name: "The Farrell", month: "September 2026" },
      { name: "The Crump Cup", month: "September 2026" },
    ],
  },
  {
    month: "October 2026",
    events: [
      { name: "USGA Men’s Mid-Am", month: "October 2026" },
      { name: "The Stocker Cup", month: "October 2026" },
      { name: "John R. Williams Four-Ball", month: "October 2026" },
      { name: "The Berkeley Cup", month: "October 2026" },
      { name: "Carlton Woods Invitational", month: "October 2026" },
    ],
  },
  {
    month: "November 2026",
    events: [
      { name: "National Invitational Tournament", month: "November 2026" },
      { name: "Ewing Cup Four-Ball", month: "November 2026" },
    ],
  },
];

export const metadata = {
  title: "Mid-Am Majors (Mock C) | midamgolfHQ",
  description: "Mock C: month grid with dense lists.",
};

export default function MidAmMajorsMockC() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6">
          <div className="text-xs font-medium text-zinc-500">Mock C</div>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-zinc-950">Mid-Am Majors</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Grouped by month. Dense month blocks with minimal chrome (built to fit lots of events).
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {MONTHS.map((m) => (
            <section key={m.month} className="rounded-3xl border border-zinc-200 bg-white p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{m.month}</h2>
              <div className="mt-3 space-y-1">
                {m.events.map((e) => (
                  <Link
                    key={e.name}
                    href={`/midamgolfhq/majors/${slugify(e.name)}`}
                    className="flex items-baseline justify-between gap-4 rounded-2xl px-3 py-2 text-sm transition hover:bg-zinc-50"
                  >
                    <span className="font-serif text-base font-semibold tracking-tight text-zinc-950">{e.name}</span>
                    <span className="text-[11px] font-medium text-zinc-500">{e.month}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
