"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  if (!events.length) return null;

  return (
    <section className="mt-12 border-t border-zinc-200 pt-8">
      <div className="mx-auto max-w-md text-center">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900"
        >
          <span>More {brandLabel} Events</span>
          <span
            className={`inline-block text-xs text-zinc-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            &#9660;
          </span>
        </button>

        {open && (
          <ul className="mt-4 space-y-1">
            {events.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/${brandSlug}/${e.slug}`}
                  className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
                >
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
