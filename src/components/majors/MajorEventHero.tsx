export function MajorEventHero({
  name,
  subtitle,
}: {
  name: string;
  subtitle?: string;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white px-6 py-8 shadow-sm shadow-zinc-900/5">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-950">{name}</h1>
      {subtitle ? <div className="mt-3 text-sm text-zinc-700">{subtitle}</div> : null}
    </section>
  );
}
