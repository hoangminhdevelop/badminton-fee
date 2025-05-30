import type { CostSettings, Match } from "@/lib/types";
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
};

export const AppContext = React.createContext<AppContextProps | null>(null);
