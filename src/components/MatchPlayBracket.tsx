export type BracketMatchup = {
  seed1: number;
  player1: string;
  club1?: string;
  seed2: number;
  player2: string;
  club2?: string;
};

export type BracketColor =
  | "green"
  | "blue"
  | "amber"
  | "purple"
  | "rose"
  | "slate";

export type MatchPlayBracketProps = {
  flightName: string;
  color?: BracketColor;
  size?: number;
  matchups: BracketMatchup[];
};

const HEADER_STYLES: Record<BracketColor, string> = {
  green: "bg-emerald-700 text-white",
  blue: "bg-sky-700 text-white",
  amber: "bg-amber-600 text-white",
  purple: "bg-violet-700 text-white",
  rose: "bg-rose-700 text-white",
  slate: "bg-slate-700 text-white",
};

const ACCENT_STYLES: Record<BracketColor, string> = {
  green: "text-emerald-700",
  blue: "text-sky-700",
  amber: "text-amber-700",
  purple: "text-violet-700",
  rose: "text-rose-700",
  slate: "text-slate-700",
};

function PlayerRow({
  seed,
  name,
  club,
  accent,
}: {
  seed: number;
  name: string;
  club?: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold tabular-nums ${accent}`}
      >
        {seed}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-zinc-900">
          {name}
        </div>
        {club ? (
          <div className="truncate text-xs text-zinc-500">{club}</div>
        ) : null}
      </div>
    </div>
  );
}

export function MatchPlayBracket({
  flightName,
  color = "slate",
  size,
  matchups,
}: MatchPlayBracketProps) {
  const headerClass = HEADER_STYLES[color];
  const accentClass = ACCENT_STYLES[color];
  const count = size ?? matchups.length * 2;

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5">
      <div
        className={`flex items-baseline justify-between gap-3 px-5 py-3 ${headerClass}`}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          {flightName}
        </h3>
        <span className="text-xs font-medium opacity-90 tabular-nums">
          {count} players
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
        {matchups.map((m, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
          >
            <PlayerRow
              seed={m.seed1}
              name={m.player1}
              club={m.club1}
              accent={accentClass}
            />
            <div className="flex items-center gap-2 px-4 py-1">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                vs
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
            <PlayerRow
              seed={m.seed2}
              name={m.player2}
              club={m.club2}
              accent={accentClass}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
