import type { Player, PlayerAppearance, PlayerId } from "./types";

/**
 * Permanent player registry.
 * Ewing Cup 2026 has no published field, so this list starts empty.
 * Add a player only from a source that prints the full name. See src/data/hubs/UPDATE.md.
 */
export const PLAYERS: Player[] = [];

export const PLAYER_APPEARANCES: PlayerAppearance[] = [];

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
  return PLAYERS.filter((player) => ids.has(player.id));
}
