import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import briefsData from "@/content/briefs.generated.json";
import { FEEDS, getFeedBySlug } from "@/lib/feeds";
import { fetchFeedItems } from "@/lib/rss";

export const metadata = {
  title: "Lab: Home (Mostly Light) | nichegolfHQ",
  robots: { index: false, follow: false },
};

type DailyBrief = {
  date: string;
  title: string;
  items: Array<{ title: string; url: string; source: string; why: string; tags?: string[] }>;
};

function getBriefs(): DailyBrief[] {
  const raw: any = briefsData as any;
  const briefs = raw?.briefs ?? raw?.default?.briefs;
  return Array.isArray(briefs) ? (briefs as DailyBrief[]) : [];
}

function formatPrettyDate(iso: string): string {
  // iso: YYYY-MM-DD
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const MIDAM_2026_EVENTS: Array<{ month: string; name: string; note?: string; href?: string }> = [
  { month: "Jan 2026", name: "The Tree Farm Invitational", note: "Rescheduled (TBD)", href: "/midamgolfhq/majors/the-tree-farm-invitational" },
  { month: "Feb 2026", name: "Gasparilla Invitational", href: "/midamgolfhq/majors/gasparilla-invitational" },
  { month: "Mar 2026", name: "The Snedeker Memorial" },
  { month: "Mar 2026", name: "The Tabby Four-Ball" },
  { month: "Mar 2026", name: "Champions Cup Four-Ball" },
  { month: "May 2026", name: "The Giles Invitational" },
  { month: "May 2026", name: "The Jupiter Invitational" },
  { month: "May 2026", name: "The Walter J. Travis Invitational" },
  { month: "May 2026", name: "John T. Lupton Memorial" },
  { month: "May 2026", name: "The Huddleston Cup" },
  { month: "Jun 2026", name: "C.B Macdonald Invitational Tournament" },
  { month: "Jun 2026", name: "Anderson Memorial Four-Ball" },
  { month: "Jun 2026", name: "George C Thomas Invitational" },
  { month: "Aug 2026", name: "The Picard Cup" },
  { month: "Aug 2026", name: "The Valentine Invitational" },
  { month: "Sep 2026", name: "USGA Women’s Mid-Am" },
  { month: "Sep 2026", name: "Trans-Miss Mid-Master Championship" },
  { month: "Sep 2026", name: "The Farrell" },
  { month: "Sep 2026", name: "The Crump Cup" },
  { month: "Oct 2026", name: "USGA Men’s Mid-Am" },
  { month: "Oct 2026", name: "The Stocker Cup" },
  { month: "Oct 2026", name: "John R. Williams Four-Ball" },
  { month: "Oct 2026", name: "The Berkeley Cup" },
  { month: "Oct 2026", name: "Carlton Woods Invitational" },
  { month: "Nov 2026", name: "National Invitational Tournament" },
  { month: "Nov 2026", name: "Ewing Cup Four-Ball" },
];

export default async function LabHomeLight() {
  const briefs = getBriefs().slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const latest = briefs[0] ?? null;
  const recent = briefs.slice(0, 6);

  const midam = getFeedBySlug("midamgolfhq");
  const junior = getFeedBySlug("juniorgolfhq");
  const senior = getFeedBySlug("seniorgolfhq");

  const [midamItems, juniorItems, seniorItems] = await Promise.all([
    midam ? fetchFeedItems(midam.rssUrl, 1) : Promise.resolve([]),
    junior ? fetchFeedItems(junior.rssUrl, 1) : Promise.resolve([]),
    senior ? fetchFeedItems(senior.rssUrl, 1) : Promise.resolve([]),
  ]);

  const channels = [
    { slug: "midamgolfhq", label: "midamgolfHQ", accent: "#4a7c5e", item: midamItems[0] },
    { slug: "juniorgolfhq", label: "juniorgolfHQ", accent: "#1b4f8a", item: juniorItems[0] },
    { slug: "seniorgolfhq", label: "seniorgolfHQ", accent: "#7a3b1e", item: seniorItems[0] },
  ];

  return (
    <SiteShell>
      {/* Lightweight design-system CSS (lab only) */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --ink: #0a0a08;
            --paper: #ffffff;
            --bg: #f6f6f5;
            --muted: #6b6b5e;
            --border: rgba(10,10,8,.09);
            --gold: #c9a84c;
            --font-display: "Playfair Display", Georgia, serif;
            --font-body: "DM Sans", system-ui, sans-serif;
            --font-mono: "DM Mono", "Courier New", monospace;
          }
          .lab-body { background: var(--bg); }
          .lab-wrap { max-width: 1120px; margin: 0 auto; padding: 32px 20px 64px; }
          .lab-h1 { font-family: var(--font-display); font-weight: 900; letter-spacing: -0.02em; font-size: 46px; line-height: 1.05; color: var(--ink); }
          .lab-sub { margin-top: 10px; color: var(--muted); max-width: 70ch; }
          .lab-grid { margin-top: 24px; display: grid; gap: 16px; }
          @media (min-width: 900px) { .lab-grid { grid-template-columns: 1.2fr .8fr; } }
          .card { background: var(--paper); border: 1px solid var(--border); border-radius: 18px; padding: 18px; box-shadow: 0 1px 0 rgba(10,10,8,.02); }
          .eyebrow { font-family: var(--font-mono); font-size: .65rem; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
          .title { margin-top: 8px; font-family: var(--font-display); font-weight: 900; font-size: 22px; letter-spacing: -0.01em; color: var(--ink); }
          .list { margin-top: 10px; border-top: 1px solid var(--border); }
          .row { display:flex; justify-content:space-between; gap: 14px; padding: 12px 4px; border-bottom:1px solid var(--border); }
          .rowTitle { font-family: var(--font-display); font-weight: 700; color: var(--ink); }
          .rowMeta { font-family: var(--font-mono); font-size: .62rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
          .cta { display:inline-flex; align-items:center; gap:.5rem; font-family: var(--font-mono); font-size: .68rem; letter-spacing:.1em; text-transform: uppercase; padding:.55rem .9rem; border-radius:999px; border:1px solid var(--border); background: #fff; }
          .cta:hover { border-color: rgba(10,10,8,.25); }
          .briefItem { padding: 14px 0; border-bottom: 1px solid var(--border); }
          .briefKicker { font-family: var(--font-mono); font-size: .62rem; letter-spacing:.12em; text-transform: uppercase; color: var(--muted); }
          .briefH { margin-top: 6px; font-family: var(--font-display); font-weight: 900; font-size: 26px; line-height: 1.15; color: var(--ink); }
          .briefWhy { margin-top: 10px; font-size: 15px; line-height: 1.7; color: var(--muted); }
          .three { display:grid; gap: 12px; margin-top: 16px; }
          @media (min-width: 900px) { .three { grid-template-columns: repeat(3,1fr);} }
          .channelCard { background: var(--paper); border: 1px solid var(--border); border-radius: 18px; padding: 16px; }
          .channelTop { height: 2px; border-radius: 999px; margin: -16px -16px 14px; }
          .channelLabel { font-family: var(--font-mono); font-size: .62rem; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
          .channelIssue { margin-top: 8px; font-family: var(--font-display); font-weight: 700; line-height: 1.2; }
          .channelLinks { margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap; }
          .smallLink { font-family: var(--font-mono); font-size: .62rem; letter-spacing:.1em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid transparent; }
          .smallLink:hover { color: var(--ink); border-bottom-color: var(--ink); }
        `,
        }}
      />

      <div className="lab-body">
        <div className="lab-wrap">
          <div className="eyebrow">Lab · Mostly light UI</div>
          <div className="lab-h1">Home (mock)</div>
          <p className="lab-sub">
            Today’s Brief is the lead. Each channel shows the latest issue + “view all”. Upcoming majors module sits alongside.
          </p>

          <div className="lab-grid">
            <section className="card">
              <div className="eyebrow">Today’s Brief</div>
              <div className="title">{latest ? formatPrettyDate(latest.date) : "No brief yet"}</div>

              {latest ? (
                <div className="list">
                  {latest.items.slice(0, 3).map((it, idx) => (
                    <div key={it.url + idx} className="briefItem">
                      <div className="briefKicker">Item {idx + 1}</div>
                      <div className="briefH">{it.title}</div>
                      <div className="briefWhy">{it.why}</div>
                    </div>
                  ))}

                  <div style={{ paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link className="cta" href={latest ? `/briefs/${latest.date}` : "/briefs"}>
                      Read full brief →
                    </Link>
                    <Link className="smallLink" href="/briefs">
                      Briefs archive
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 10, color: "var(--muted)" }}>No briefs found.</div>
              )}

              <div className="three">
                {channels.map((c) => (
                  <div key={c.slug} className="channelCard">
                    <div className="channelTop" style={{ background: c.accent }} />
                    <div className="channelLabel">{c.label}</div>
                    <div className="channelIssue">{c.item?.title ?? "(no issues found yet)"}</div>
                    <div className="channelLinks">
                      <a className="smallLink" href={c.item?.link ?? `/${c.slug}`}>
                        Latest issue →
                      </a>
                      <Link className="smallLink" href={`/${c.slug}`}>
                        View all
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="card">
              <div className="eyebrow">Mid-Am Majors</div>
              <div className="title">2026 upcoming</div>
              <div className="list">
                {MIDAM_2026_EVENTS.slice(0, 8).map((e) => {
                  const Inner = (
                    <>
                      <div className="rowTitle">{e.name}</div>
                      <div className="rowMeta">{e.month}</div>
                    </>
                  );

                  return e.href ? (
                    <Link key={e.name} href={e.href} className="row">
                      {Inner}
                    </Link>
                  ) : (
                    <div key={e.name} className="row">
                      {Inner}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link className="cta" href="/midamgolfhq/majors">
                  View full schedule →
                </Link>
                <Link className="smallLink" href="/majors">
                  All brands
                </Link>
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="eyebrow">Recent briefs</div>
                <div className="list">
                  {recent.map((b) => (
                    <Link key={b.date} href={`/briefs/${b.date}`} className="row">
                      <div className="rowTitle">{b.title.replace(/^Daily Brief\s+—\s+/i, "")}</div>
                      <div className="rowMeta">{b.date}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
