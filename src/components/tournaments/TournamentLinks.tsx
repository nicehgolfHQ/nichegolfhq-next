import type { Tournament } from "@/lib/tournaments/types";

type LinkItem = { label: string; href: string };

export function TournamentLinks({ tournament }: { tournament: Tournament }) {
  const links: LinkItem[] = [];
  if (tournament.golfGeniusUrl) links.push({ label: "Live scoring (Golf Genius)", href: tournament.golfGeniusUrl });
  if (tournament.amateurgolfUrl) links.push({ label: "AmateurGolf.com page", href: tournament.amateurgolfUrl });
  if (tournament.courseWebsite) links.push({ label: "Course website", href: tournament.courseWebsite });

  if (links.length === 0 && !tournament.socialHashtag) return null;

  return (
    <aside className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
      <h2 className="text-sm font-semibold tracking-tight text-zinc-950">Links</h2>
      <div className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <div key={l.href}>
            <a href={l.href} target="_blank" rel="noreferrer" className="text-zinc-800 underline-offset-4 hover:underline">
              {l.label} →
            </a>
          </div>
        ))}
        {tournament.socialHashtag ? <div className="text-zinc-600">Hashtag: {tournament.socialHashtag}</div> : null}
      </div>
    </aside>
  );
}
