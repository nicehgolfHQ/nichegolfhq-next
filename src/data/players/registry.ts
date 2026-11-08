import { EWING_2026_APPEARANCES, EWING_2026_PLAYERS } from "@/data/hubs/ewing-2026-field";
import type { Player, PlayerAppearance, PlayerId } from "./types";

/**
 * Permanent player registry. Ids come from the full published name.
 * John Stollenwerck Jr and John Stollenwerck are different ids.
 * See src/data/hubs/UPDATE.md before adding anyone.
 */
export const PLAYERS: Player[] = [...EWING_2026_PLAYERS];

export const PLAYER_APPEARANCES: PlayerAppearance[] = [...EWING_2026_APPEARANCES];

export function getPlayer(id: PlayerId): Player | undefined {
  return PLAYERS.find((player) => player.id === id);
}

export function appearancesFor(id: PlayerId): PlayerAppearance[] {
  return PLAYER_APPEARANCES.filter((row) => row.playerId === id);
}

export function playersInEvent(eventSlug: string): Player[] {
  const ids = new Set(
    PLAYER_APPEARANCES.filter((row) => row.eventSlug === eventSlug).map((row) => row.playerId),
  );
  return PLAYERS.filter((player) => ids.has(player.id)).sort((a, b) => a.name.localeCompare(b.name));
}
