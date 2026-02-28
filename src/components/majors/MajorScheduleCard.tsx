import Link from "next/link";

export function MajorScheduleCard({
  href,
  name,
  subtitle,
  note,
  badge,
}: {
  href: string;
  name: string;
  subtitle?: string;
  note?: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-900/5 transition hover:border-zinc-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-xl font-semibold tracking-tight text-zinc-950">{name}</div>
          {subtitle ? <div className="mt-1 text-sm text-zinc-700">{subtitle}</div> : null}
          {note ? <div className="mt-2 text-xs text-zinc-500">{note}</div> : null}
        </div>
        {badge ? (
          <div className="shrink-0 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-[11px] font-medium text-zinc-700">
            {badge}
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-sm font-medium text-zinc-900">
        View event <span aria-hidden className="inline-block transition group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
