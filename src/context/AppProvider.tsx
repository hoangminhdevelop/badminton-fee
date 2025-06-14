import {
  getCosts,
  getMatchesInStorage,
  getPlayers,
  removeMatchFromStorage,
  saveNewMatchToStorage,
  setCostsToStorage,
  setPlayersToStorage,
  updateMatchInStorage,
} from "@/lib/storage";
import type { CostSettings, Match, Player } from "@/lib/types";
import React, { useCallback } from "react";
import { AppContext } from "./AppContext";
import { toast } from "sonner";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cost, setCost] = React.useState(getCosts());
  const [players, setPlayers] = React.useState<Player[]>(getPlayers());
  const [matches, setMatches] = React.useState(getMatchesInStorage());

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

  const addNewPlayer = (newPlayer: Player) => {
    const existedPlayer = players.find(
      (player) => player.name === newPlayer.name
    );
    if (existedPlayer) {
      toast.error("Người chơi đã tồn tại");
      return;
    }

    const newPlayersList = [...players, newPlayer];
    setPlayers(newPlayersList);
    setPlayersToStorage(newPlayersList);
  };

  const removePlayer = (playerId: string) => {
    const newPlayersList = players.filter((player) => player.id !== playerId);
    setPlayers(newPlayersList);
    setPlayersToStorage(newPlayersList);
  };

  return (
    <AppContext.Provider
      value={{
        matches,
        addNewMatch,
        removeMatch,
        updateMatch,
        cost,
        updateCost,
        players,
        addNewPlayer,
        removePlayer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
