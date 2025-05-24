// Local storage helpers for players, matches, and costs
import type { CostSettings, Match, Player } from "./types";

const PLAYER_KEY = "badminton_players";
const MATCH_KEY = "badminton_matches";
const COST_KEY = "badminton_costs";

export function getPlayers(): Player[] {
  return JSON.parse(localStorage.getItem(PLAYER_KEY) || "[]");
}

export function savePlayers(players: Player[]) {
  localStorage.setItem(PLAYER_KEY, JSON.stringify(players));
}

export function getMatches(): Match[] {
  return JSON.parse(localStorage.getItem(MATCH_KEY) || "[]");
}

export function saveMatches(matches: Match[]) {
  localStorage.setItem(MATCH_KEY, JSON.stringify(matches));
}

export function getCosts(): CostSettings | null {
  const data = localStorage.getItem(COST_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveCosts(costs: CostSettings) {
  localStorage.setItem(COST_KEY, JSON.stringify(costs));
}

export function resetAll() {
  localStorage.removeItem(PLAYER_KEY);
  localStorage.removeItem(MATCH_KEY);
  localStorage.removeItem(COST_KEY);
}
