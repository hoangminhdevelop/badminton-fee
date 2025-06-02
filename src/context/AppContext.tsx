import type { CostSettings, Match, Player } from "@/lib/types";
import React from "react";

export type AppContextProps = {
  // Cost settings
  cost: CostSettings | null;
  updateCost: (cost: CostSettings) => void;

  // Matches
  matches: Match[];
  addNewMatch: (match: Match) => void;
  removeMatch: (matchId: string) => void;
  updateMatch: (matchId: string, updatedMatch: Partial<Match>) => void;

  // Players
  players: Player[];
  addNewPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
};

export const AppContext = React.createContext<AppContextProps | null>(null);
