import Link from "next/link";
import Image from "next/image";

type Item = {
  title: string;
  link: string;
  date?: string;
  image?: string | null;
};

type Channel = {
  name: string;
  slug: string; // midamgolfhq etc
  accent: { text: string; border: string; hoverBg: string; glow: string };
  items: Item[];
};

function accentFor(slug: string) {
  if (slug === "seniorgolfhq") {
    return { text: "text-emerald-400", border: "border-emerald-500/20", hoverBg: "hover:bg-emerald-500/5", glow: "bg-emerald-500/5" };
  }
  if (slug === "juniorgolfhq") {
    return { text: "text-amber-400", border: "border-amber-500/20", hoverBg: "hover:bg-amber-500/5", glow: "bg-amber-500/5" };
  }
  return { text: "text-sky-400", border: "border-sky-500/20", hoverBg: "hover:bg-sky-500/5", glow: "bg-sky-500/5" };
}

function formatDate(d?: string) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

export default function ChannelsSection({ channels }: { channels: Array<{ name: string; slug: string; items: Item[] }> }) {
  const rows: Channel[] = channels.map((c) => ({
    name: c.name,
    slug: c.slug,
    accent: accentFor(c.slug),
    items: (c.items || []).slice(0, 2),
  }));

  return (
    <section className="relative bg-[#080811] py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="mono-label text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">Explore</span>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">Channels</h2>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {rows.map((channel, ci) => (
            <div
              key={channel.slug}
              className="group/channel overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]"
              style={{ animationDelay: `${ci * 150}ms` }}
            >
              <div className="flex flex-col gap-4 border-b border-white/[0.06] px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 ${channel.accent.glow}`}>
                    <Image src={`/brand/${channel.slug}/logo.png`} alt={`${channel.name} logo`} fill className="object-contain p-2" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white">{channel.name}</h3>
                </div>

                <Link
                  href={`/${channel.slug}`}
                  className={`inline-flex items-center gap-2 rounded-lg border ${channel.accent.border} bg-transparent px-4 py-2 text-sm font-semibold ${channel.accent.text} transition-all duration-300 ${channel.accent.hoverBg}`}
                >
                  View All
                  <span aria-hidden className="transition-transform duration-300 group-hover/channel:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                {channel.items.map((it) => (
                  <a
                    key={it.link + it.title}
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                      {it.image ? (
                        <Image src={it.image} alt={it.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-white/[0.03] to-transparent" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080811]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>
                    <div className="p-5">
                      <div className="mono-label text-[10px] font-bold text-zinc-500">{formatDate(it.date)}</div>
                      <div className="mt-2 text-sm font-semibold tracking-tight text-zinc-200 transition-colors duration-200 group-hover:text-white">
                        {it.title}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
