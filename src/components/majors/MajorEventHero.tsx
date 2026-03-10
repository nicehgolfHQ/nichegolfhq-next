export function MajorEventHero({ name, subtitle }: { name: string; subtitle?: string }) {
  return (
    <section className="text-center">
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
        {name}
      </h1>
      {subtitle ? (
        <div className="mt-4 text-sm text-zinc-500">{subtitle}</div>
      ) : null}
    </section>
  );
}
