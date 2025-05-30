import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPlayer, getPlayers } from "@/lib/storage";
import { Plus, User, Users } from "lucide-react";
import { useState } from "react";
import PlayerTag from "../PlayerTag";

export default function PlayerManager() {
  const players = getPlayers();
  const [name, setName] = useState("");

  const handleAddPlayer = () => {
    if (name.trim()) {
      addPlayer(name.trim());
      setName("");
    }
  };

  return (
    <div>
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            Thêm người chơi
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
              placeholder="Nhập tên"
              className="flex-1 bg-white border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base h-9 sm:h-10"
            />
            <Button
              onClick={handleAddPlayer}
              disabled={!name.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 h-9 sm:h-10"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {players.length > 0 && (
          <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
            <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
              Số lượng: ({players.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <PlayerTag key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
