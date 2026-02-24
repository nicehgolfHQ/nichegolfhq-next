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
      {/* Design-system-ish CSS (lab only). Goal: closer to the Claude mock vibe. */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          :root{
            --black:#0a0a08;--cream:#f5f0e8;--green:#1a3d2b;--gold:#c9a84c;--gold-hover:#e0bb5a;--text-muted:#6b6b5e;--border:rgba(10,10,8,0.1);
            --mid:#4a7c5e;--mid-light:#5fa882;--junior:#1b4f8a;--junior-light:#6b9cd4;--senior:#7a3b1e;--senior-light:#c97d50;
            --font-display:"Playfair Display", Georgia, serif;--font-body:"DM Sans", system-ui, sans-serif;--font-mono:"DM Mono", "Courier New", monospace;
          }
          .lab{background:#f6f6f5;color:var(--black);font-family:var(--font-body)}
          .container{max-width:1320px;margin:0 auto;padding:0 2.5rem}
          .btn{display:inline-block;font-family:var(--font-mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;padding:.85rem 2rem;font-weight:500;transition:all .18s;cursor:pointer;border:none}
          .btn--primary{background:var(--gold);color:var(--black)}
          .btn--primary:hover{background:var(--gold-hover);transform:translateY(-1px)}
          .btn--ghost-dark{border:1px solid rgba(245,240,232,.25);color:rgba(245,240,232,.7)}
          .btn--ghost-dark:hover{border-color:var(--gold);color:var(--gold)}
          .eyebrow{font-family:var(--font-mono);font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem}
          .eyebrow::before{content:"";display:block;width:28px;height:1px;background:var(--gold);flex-shrink:0}
          .ticker{background:var(--gold);overflow:hidden;white-space:nowrap;padding:.55rem 0}
          .ticker__inner{display:inline-block;animation:ticker-scroll 35s linear infinite}
          @keyframes ticker-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          .ticker__item{display:inline-block;font-family:var(--font-mono);font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--black);padding:0 2rem}
          .ticker__sep{display:inline-block;width:3px;height:3px;border-radius:50%;background:rgba(10,10,8,.35);vertical-align:middle;margin:0 .5rem}
          .section{padding:4.5rem 0}
          .section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2.25rem}
          .section-header__title{font-family:var(--font-display);font-size:2rem;font-weight:900;letter-spacing:-.02em}
          .section-header__link{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center;gap:.4rem}
          .section-header__link::after{content:"→"}
          .card-grid{display:grid;gap:1.5px;background:var(--border)}
          .card-grid--3{grid-template-columns:repeat(3,1fr)}
          .issue-card{background:var(--cream);padding:2.25rem;position:relative;overflow:hidden;transition:background .15s,transform .2s;cursor:pointer;display:flex;flex-direction:column}
          .issue-card:hover{background:#ede8e0;transform:translateY(-2px)}
          .issue-card__accent{position:absolute;top:0;left:0;right:0;height:2px}
          .issue-card--mid .issue-card__accent{background:var(--mid)}
          .issue-card--junior .issue-card__accent{background:var(--junior)}
          .issue-card--senior .issue-card__accent{background:var(--senior)}
          .issue-card__tag{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.75rem}
          .issue-card--mid .issue-card__tag{color:var(--mid)}
          .issue-card--junior .issue-card__tag{color:var(--junior-light)}
          .issue-card--senior .issue-card__tag{color:var(--senior-light)}
          .issue-card__title{font-family:var(--font-display);font-size:1.2rem;font-weight:700;line-height:1.25;margin-bottom:.6rem;flex:1}
          .issue-card__date{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.08em;color:var(--text-muted);margin-top:1rem}
          .issue-card__arrow{position:absolute;bottom:1.5rem;right:1.5rem;color:var(--text-muted);font-size:1.1rem;opacity:0;transform:translate(-4px,4px);transition:all .2s}
          .issue-card:hover .issue-card__arrow{opacity:1;transform:translate(0,0)}
          @media(max-width:980px){.container{padding:0 1.25rem}.card-grid--3{grid-template-columns:1fr}}
        `,
        }}
      />

      <div className="lab">
        {/* HERO (keeps the “design forward” feel, but still ‘mostly light’ overall) */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 56px - 40px)", marginTop: 40 }}>
          <div style={{ background: "var(--green)", padding: "5rem 4rem", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: 9999, background: "radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div>
              <div className="eyebrow">Independent Golf Media</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,5vw,5.5rem)", fontWeight: 900, color: "var(--cream)", lineHeight: 1, letterSpacing: "-0.025em", marginBottom: "1.75rem" }}>
                The Golf<br />Stories No<br />One <em style={{ color: "var(--gold)" }}>Else</em><br />Tells.
              </h1>
              <p style={{ fontSize: "1rem", color: "rgba(245,240,232,0.6)", maxWidth: 380, lineHeight: 1.75, fontWeight: 300, marginBottom: "2.5rem" }}>
                Covering mid-amateur, junior, and senior competitive golf with the depth it deserves. Sharp opinions, real results, zero fluff.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href={latest ? `/briefs/${latest.date}` : "/briefs"} className="btn btn--primary">
                  Today’s Brief
                </Link>
                <Link href="/majors" className="btn btn--ghost-dark">
                  Majors
                </Link>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--black)", padding: "5rem 3.5rem", display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.63rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.3)", padding: "0.3rem 0.7rem", display: "inline-block", alignSelf: "flex-start", marginBottom: "1.75rem" }}>
              Today’s Brief
            </span>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "2.5rem" }}>
              {latest ? formatPrettyDate(latest.date) : "(no brief yet)"}
            </div>

            <div style={{ flex: 1 }}>
              {(latest?.items ?? []).slice(0, 3).map((it, idx) => (
                <div key={it.url + idx} style={{ padding: "1.5rem 0", borderBottom: idx < 2 ? "1px solid rgba(245,240,232,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: "0.5rem" }}>
                    ● Item {idx + 1}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "var(--cream)", lineHeight: 1.3, marginBottom: "0.5rem" }}>
                    {it.title}
                  </div>
                  <div style={{ fontSize: "0.83rem", color: "rgba(245,240,232,0.45)", lineHeight: 1.6, fontWeight: 300 }}>{it.why}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href={latest ? `/briefs/${latest.date}` : "/briefs"} style={{ fontFamily: "var(--font-mono)", fontSize: "0.63rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                View full brief →
              </Link>
            </div>
          </div>
        </section>

        <div className="ticker">
          <div className="ticker__inner">
            <span className="ticker__item">Gasparilla Invitational — Results<span className="ticker__sep" /></span>
            <span className="ticker__item">Tree Farm Invitational — Rescheduled<span className="ticker__sep" /></span>
            <span className="ticker__item">Mid-Am Majors — 2026 schedule live<span className="ticker__sep" /></span>
            <span className="ticker__item">Gasparilla Invitational — Results<span className="ticker__sep" /></span>
            <span className="ticker__item">Tree Farm Invitational — Rescheduled<span className="ticker__sep" /></span>
            <span className="ticker__item">Mid-Am Majors — 2026 schedule live<span className="ticker__sep" /></span>
          </div>
        </div>

        <section className="section container">
          <div className="section-header">
            <h2 className="section-header__title">Our Channels</h2>
            <Link href="/" className="section-header__link">
              All issues
            </Link>
          </div>

          <div className="card-grid card-grid--3">
            {channels.map((c) => (
              <a key={c.slug} href={c.item?.link ?? `/${c.slug}`} className={`issue-card issue-card--${c.slug === "midamgolfhq" ? "mid" : c.slug === "juniorgolfhq" ? "junior" : "senior"}`}>
                <div className="issue-card__accent" />
                <div className="issue-card__tag">● Latest Issue</div>
                <div className="issue-card__title">{c.item?.title ?? c.label}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <Link href={`/${c.slug}`} className="section-header__link" style={{ marginBottom: 0 }}>
                    View all
                  </Link>
                </div>
                <div className="issue-card__arrow">↗</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
