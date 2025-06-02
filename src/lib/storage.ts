import type { CostSettings, Match, Player } from "./types";

const COST_KEY_STORAGE = "costs";
// const FEES_KEY_STORAGE = "fees";
const PLAYERS_KEY_STORAGE = "players";
export const MATCHES_KEY_STORAGE = "match-";

export function getCosts(): CostSettings | null {
  const costs = localStorage.getItem(COST_KEY_STORAGE);
  return costs ? JSON.parse(costs) : null;
}

export function setCostsToStorage(costs: CostSettings) {
  localStorage.setItem(COST_KEY_STORAGE, JSON.stringify(costs));
}

export function getPlayers(): Player[] {
  const players = localStorage.getItem(PLAYERS_KEY_STORAGE);
  return players ? JSON.parse(players) : [];
}

export function setPlayersToStorage(players: Player[]) {
  localStorage.setItem(PLAYERS_KEY_STORAGE, JSON.stringify(players));
}

export function saveNewMatchToStorage(match: Match) {
  localStorage.setItem(match.id, JSON.stringify(match));
}

export function removeMatchFromStorage(matchId: string) {
  localStorage.removeItem(matchId);
}

export function getMatchesInStorage(): Match[] {
  const matches: Match[] = [];
  for (const key in localStorage) {
    if (key.startsWith(MATCHES_KEY_STORAGE)) {
      const match = JSON.parse(localStorage.getItem(key) || "{}");
      if (match.id) {
        matches.push(match);
      }
    }
  }
  return matches;
}

export function updateMatchInStorage(match: Match) {
  localStorage.setItem(match.id, JSON.stringify(match));
}

export function resetStorage() {
  localStorage.removeItem(COST_KEY_STORAGE);
  localStorage.removeItem(PLAYERS_KEY_STORAGE);

  // Remove all matches
  for (const key in localStorage) {
    if (key.startsWith(MATCHES_KEY_STORAGE)) {
      localStorage.removeItem(key);
    }
  }
}
