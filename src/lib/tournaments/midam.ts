import { MIDAM_TOURNAMENTS } from "@/data/tournaments/midam";
import type { Tournament } from "@/lib/tournaments/types";

export function listMidAmTournaments(): Tournament[] {
  return [...MIDAM_TOURNAMENTS].sort((a, b) => a.month - b.month);
}

export function listMidAmTournamentSlugs(): string[] {
  return listMidAmTournaments().map((t) => t.slug);
}

export function getMidAmTournamentBySlug(slug: string): Tournament | undefined {
  return MIDAM_TOURNAMENTS.find((t) => t.slug === slug);
}
