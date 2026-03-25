import Link from "next/link";

type RelatedEventItem = {
    slug: string;
    name: string;
    month: string;
  };

type Props = {
    events: RelatedEventItem[];
    brandSlug: string;
    brandLabel: string;
  };

export function RelatedEvents({ events, brandSlug, brandLabel }: Props) {
    if (!events.length) return null;

    return (
          <section className="mt-12 border-t border-zinc-200 pt-10">
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              More {brandLabel} Events
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                          <Link
                            key={e.slug}
                            href={`/${brandSlug}/${e.slug}`}
                            className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3 text-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                          >
                            <span className="font-medium text-zinc-800">{e.name}</span>
                            <span className="ml-2 shrink-0 text-xs text-zinc-400">
                              {e.month}
                            </span>
                          </Link>
                        ))}
            </div>
          </section>
        );
  }
