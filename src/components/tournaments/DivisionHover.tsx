"use client";

import { useEffect, useRef, useState } from "react";
import type { DivisionWinner } from "@/lib/tournaments/types";

const WIDTH = 288;
const MARGIN = 12;

// Rendered with position: fixed so the popover is never clipped by the
// table's horizontal-scroll container.
export function DivisionHover({ year, divisions }: { year: number; divisions: DivisionWinner[] }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const open = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.min(Math.max(MARGIN, r.right - WIDTH), window.innerWidth - WIDTH - MARGIN);
    setPos({ top: r.bottom + 8, left });
  };
  const close = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!btnRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pos]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`See ${year} winners of the other age divisions`}
        aria-expanded={pos !== null}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onClick={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 outline-none transition hover:border-zinc-500 hover:text-zinc-900 focus-visible:border-zinc-700 focus-visible:text-zinc-900"
      >
        <span
          aria-hidden
          className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current text-[9px] font-semibold leading-none"
        >
          i
        </span>
        View
      </button>

      {pos ? (
        <div
          role="tooltip"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: WIDTH }}
          className="pointer-events-none z-50 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-xl shadow-zinc-900/15"
        >
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {year} age division winners
          </div>
          <ul className="mt-2 divide-y divide-zinc-100">
            {divisions.map((d) => (
              <li key={d.label} className="flex items-baseline justify-between gap-3 py-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-900">{d.label}</div>
                  {d.ages ? <div className="text-[11px] text-zinc-500">Ages {d.ages}</div> : null}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-zinc-950">{d.champion}</div>
                  {d.score ? <div className="text-[11px] tabular-nums text-zinc-500">{d.score}</div> : null}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-snug text-zinc-500">
            Age bands are set by each tournament and can differ between events.
          </p>
        </div>
      ) : null}
    </>
  );
}
