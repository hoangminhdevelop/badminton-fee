import type { Player } from "@/lib/types";
import { X } from "lucide-react";
import { Avatar } from "./Avatar";

interface PlayerTagProps {
  player: Player;
  onRemove?: (playerId: string) => void;
  onClick?: (playerId: string) => void;
}

const PlayerTag = ({ player, onClick, onRemove }: PlayerTagProps) => {
  return (
    <div
      onClick={() => onClick?.(player.id)}
      key={player.id}
      className="bg-white border border-slate-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      <Avatar name={player.name} size="sm" />
      <span className="text-xs sm:text-sm font-medium text-slate-800 min-w-0">
        {player.name}
      </span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(player.id);
          }}
          className="ml-1 text-slate-400 hover:text-red-500 transition-colors duration-200 p-1"
          title="Remove player"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default PlayerTag;
