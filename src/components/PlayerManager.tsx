import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getPlayers, savePlayers } from "../lib/storage";
import type { Player } from "../lib/types";

export default function PlayerManager({ onChange }: { onChange?: () => void }) {
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [name, setName] = useState("");

  const addPlayer = () => {
    if (!name.trim()) return;
    const newPlayer: Player = { id: uuidv4(), name: name.trim() };
    const updated = [...players, newPlayer];
    setPlayers(updated);
    savePlayers(updated);
    setName("");
    if (onChange) onChange();
  };

  const removePlayer = (id: string) => {
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    savePlayers(updated);
    if (onChange) onChange();
  };

  return (
    <div>
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
          Player Management
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Add and manage badminton players
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Add New Player
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Enter player name"
              className="flex-1 bg-white border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
            />
            <Button
              onClick={addPlayer}
              disabled={!name.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 h-9 sm:h-10"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </Button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
            <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4.5l2-1.5v-2c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v6.5l6 4.5H4z" />
              </svg>
              Current Players ({players.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white border border-slate-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 min-w-0">
                    {player.name}
                  </span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="ml-1 text-slate-400 hover:text-red-500 transition-colors duration-200 p-1"
                    title="Remove player"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
