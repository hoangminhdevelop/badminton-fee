import { Button } from "@/components/ui/button";
import { Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getPlayers } from "../lib/storage";
import type { Match as MatchType } from "../lib/types";

interface MatchProps {
  match: MatchType;
  editingMatch?: MatchType;
  onEdit: (match: MatchType) => void;
  onDelete: (id: string) => void;
  onTimerUpdate: (matchId: string, duration: number) => void;
}

export default function Match({
  match,
  editingMatch,
  onEdit,
  onDelete,
  onTimerUpdate,
}: MatchProps) {
  const players = getPlayers();

  // Timer state for this specific match
  const [currentTime, setCurrentTime] = useState(match.duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdatedDurationRef = useRef(match.duration);
  const isOwnUpdateRef = useRef(false);

  // Only update current time when match duration changes from external editing
  // (not from our own timer updates)
  useEffect(() => {
    // If this was our own update, ignore it
    if (isOwnUpdateRef.current) {
      isOwnUpdateRef.current = false;
      return;
    }

    // Don't sync duration changes while timer is running to prevent interference
    if (isRunning) {
      return;
    }

    // Only sync if the duration changed externally
    if (match.duration !== lastUpdatedDurationRef.current) {
      setCurrentTime(match.duration);
      lastUpdatedDurationRef.current = match.duration;
    }
  }, [match.duration, isRunning]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (isRunning) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        lastUpdatedDurationRef.current = newTime; // Track our own updates
        isOwnUpdateRef.current = true; // Mark this as our own update

        return newTime;
      });
    }, 60000); // Update every minute
  };

  const stopTimer = () => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Update the match duration with current time and track the update
    lastUpdatedDurationRef.current = currentTime;
    isOwnUpdateRef.current = true; // Mark this as our own update
    onTimerUpdate(match.id, currentTime);
  };

  const getPlayerNames = (ids: string[]) =>
    ids.map((id) => players.find((p) => p.id === id)?.name || "").join(", ");

  return (
    <div
      className={`relative bg-gradient-to-r p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 transition-all duration-200 shadow-sm hover:shadow-md ${
        editingMatch?.id === match.id
          ? "from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-2 ring-blue-200"
          : "from-white to-slate-50 hover:from-slate-50 hover:to-slate-100"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
              {getPlayerNames(match.team1)} vs {getPlayerNames(match.team2)}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {match.shuttlecockUsed} shuttlecocks
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
              </svg>
              {currentTime}min
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              Winner: {match.winner === "team1" ? "Team 1" : "Team 2"}
            </span>
          </div>
        </div>

        {/* Timer Controls and Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Timer Controls */}
          <div className="flex items-center gap-1">
            {isRunning ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  stopTimer();
                }}
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  startTimer();
                }}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(match);
            }}
          >
            Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 sm:p-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(match.id);
            }}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
