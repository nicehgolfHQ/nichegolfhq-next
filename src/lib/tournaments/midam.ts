import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import type { Tournament } from "@/lib/tournaments/types";

export function listMidAmTournaments(): Tournament[] {
  return [...MIDAM_TOURNAMENTS].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.name.localeCompare(b.name);
  });
}

export function listMidAmTournamentSlugs(): string[] {
  return listMidAmTournaments().map((t) => t.slug);
}

export function getMidAmTournamentBySlug(slug: string): Tournament | undefined {
  return MIDAM_TOURNAMENTS.find((t) => t.slug === slug);
}
