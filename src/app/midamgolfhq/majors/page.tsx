import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getMajorBySlug } from "@/lib/majors";

type EventItem = { name: string; month: string; note?: string };

type MonthBlock = { month: string; monthKey: string; events: EventItem[] };

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/women’s/g, "womens")
    .replace(/’/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const YEAR = 2026;

const MONTHS: MonthBlock[] = [
  {
    month: `January ${YEAR}`,
    monthKey: "jan",
    events: [{ name: "The Tree Farm Invitational", month: `January ${YEAR}`, note: "Rescheduled (TBD)" }],
  },
  {
    month: `February ${YEAR}`,
    monthKey: "feb",
    events: [{ name: "Gasparilla Invitational", month: `February ${YEAR}` }],
  },
  {
    month: `March ${YEAR}`,
    monthKey: "mar",
    events: [
      { name: "The Snedeker Memorial", month: `March ${YEAR}` },
      { name: "The Tabby Four-Ball", month: `March ${YEAR}` },
      { name: "Champions Cup Four-Ball", month: `March ${YEAR}` },
    ],
  },
  {
    month: `May ${YEAR}`,
    monthKey: "may",
    events: [
      { name: "The Giles Invitational", month: `May ${YEAR}` },
      { name: "The Jupiter Invitational", month: `May ${YEAR}` },
      { name: "The Walter J. Travis Invitational", month: `May ${YEAR}` },
      { name: "John T. Lupton Memorial", month: `May ${YEAR}` },
      { name: "The Huddleston Cup", month: `May ${YEAR}` },
    ],
  },
  {
    month: `June ${YEAR}`,
    monthKey: "jun",
    events: [
      { name: "C.B Macdonald Invitational Tournament", month: `June ${YEAR}` },
      { name: "Anderson Memorial Four-Ball", month: `June ${YEAR}` },
      { name: "George C Thomas Invitational", month: `June ${YEAR}` },
    ],
  },
  {
    month: `August ${YEAR}`,
    monthKey: "aug",
    events: [
      { name: "The Picard Cup", month: `August ${YEAR}` },
      { name: "The Valentine Invitational", month: `August ${YEAR}` },
    ],
  },
  {
    month: `September ${YEAR}`,
    monthKey: "sep",
    events: [
      { name: "USGA Women’s Mid-Am", month: `September ${YEAR}` },
      { name: "Trans-Miss Mid-Master Championship", month: `September ${YEAR}` },
      { name: "The Farrell", month: `September ${YEAR}` },
      { name: "The Crump Cup", month: `September ${YEAR}` },
    ],
  },
  {
    month: `October ${YEAR}`,
    monthKey: "oct",
    events: [
      { name: "USGA Men’s Mid-Am", month: `October ${YEAR}` },
      { name: "The Stocker Cup", month: `October ${YEAR}` },
      { name: "John R. Williams Four-Ball", month: `October ${YEAR}` },
      { name: "The Berkeley Cup", month: `October ${YEAR}` },
      { name: "Carlton Woods Invitational", month: `October ${YEAR}` },
    ],
  },
  {
    month: `November ${YEAR}`,
    monthKey: "nov",
    events: [
      { name: "National Invitational Tournament", month: `November ${YEAR}` },
      { name: "Ewing Cup Four-Ball", month: `November ${YEAR}` },
    ],
  },
];

export const metadata = {
  title: `Mid-Am Majors — ${YEAR} | midamgolfHQ`,
  description: `Mid-Am Majors schedule for ${YEAR}: event hubs and year-by-year results pages.`,
};

export default function MidAmMajorsIndexPage() {
  const jump = MONTHS.map((m) => ({ key: m.monthKey, label: m.month.split(" ")[0] }));

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">Mid-Am Majors — {YEAR}</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">All events on one scrollable page, grouped by month.</p>
        </div>

        {/* Mock B → month module cards */}
        <div className="grid gap-4 lg:grid-cols-2">
          {MONTHS.map((m) => (
            <section key={m.monthKey} id={m.monthKey} className="scroll-mt-24 rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">{m.month}</h2>
                <div className="text-xs text-zinc-500">{m.events.length} events</div>
              </div>

              <div className="mt-4 space-y-2">
                {m.events.map((e) => {
                  const slug = slugify(e.name);
                  const hasHub = Boolean(getMajorBySlug(slug));
                  const href = `/midamgolfhq/majors/${slug}`;

                  const Row = (
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="font-serif text-lg font-semibold tracking-tight text-zinc-950">{e.name}</div>
                      <div className="text-[11px] font-medium text-zinc-500">{e.month}</div>
                    </div>
                  );

                  return hasHub ? (
                    <Link
                      key={e.name}
                      href={href}
                      className="block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition hover:border-zinc-300 hover:bg-white"
                    >
                      {Row}
                      {e.note ? <div className="mt-1 text-xs text-zinc-600">{e.note}</div> : null}
                    </Link>
                  ) : (
                    <div key={e.name} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                      {Row}
                      {e.note ? <div className="mt-1 text-xs text-zinc-600">{e.note}</div> : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
