import {
  getCosts,
  getMatchesInStorage,
  removeMatchFromStorage,
  saveNewMatchToStorage,
  setCostsToStorage,
  updateMatchInStorage,
} from "@/lib/storage";
import type { CostSettings, Match } from "@/lib/types";
import React, { useCallback } from "react";
import { AppContext } from "./AppContext";
import { toast } from "sonner";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matches, setMatches] = React.useState(getMatchesInStorage());
  const [cost, setCost] = React.useState(getCosts());

  const updateCost = (newCost: CostSettings) => {
    setCost(newCost);
    setCostsToStorage(newCost);
  };

  const addNewMatch = (newMatch: Match) => {
    setMatches((prevMatches) => [...prevMatches, newMatch]);
    saveNewMatchToStorage(newMatch);
  };

  const removeMatch = (matchId: string) => {
    setMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== matchId)
    );
    removeMatchFromStorage(matchId);
  };

  const updateMatch = useCallback(
    (matchId: string, updatedMatch: Partial<Match>) => {
      const existingMatch = matches.find((match) => match.id === matchId);
      if (!existingMatch) {
        toast.error("Match not found");
        return;
      }

      const newMatch = { ...existingMatch, ...updatedMatch };
      setMatches((prevMatches) =>
        prevMatches.map((match) => (match.id === matchId ? newMatch : match))
      );
      updateMatchInStorage(newMatch);
    },
    [matches]
  );

  return (
    <AppContext.Provider
      value={{
        matches,
        addNewMatch,
        removeMatch,
        updateMatch,
        cost,
        updateCost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
