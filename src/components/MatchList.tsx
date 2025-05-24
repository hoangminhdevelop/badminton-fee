import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { getMatches, getPlayers, saveMatches } from "../lib/storage";
import type { Match } from "../lib/types";

export default function MatchList({
  onEdit,
  editingMatch,
  onChange,
  showCard = true,
}: {
  onEdit: (match: Match) => void;
  editingMatch?: Match;
  onChange?: () => void;
  showCard?: boolean;
}) {
  const [matches, setMatches] = useState<Match[]>(getMatches());
  const players = getPlayers();

  const removeMatch = (id: string) => {
    const updated = matches.filter((m) => m.id !== id);
    setMatches(updated);
    saveMatches(updated);
    // Trigger refresh of parent components (including fee table)
    if (onChange) onChange();
  };

  const getPlayerNames = (ids: string[]) =>
    ids.map((id) => players.find((p) => p.id === id)?.name || "").join(", ");

  const matchContent = (
    <div className="space-y-3">
      {matches.map((m) => (
        <div
          key={m.id}
          className={`relative bg-gradient-to-r p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
            editingMatch?.id === m.id
              ? "from-blue-50 to-indigo-50 border-blue-300 shadow-md ring-2 ring-blue-200"
              : "from-white to-slate-50 hover:from-slate-50 hover:to-slate-100"
          }`}
          onClick={() => onEdit(m)}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                  {getPlayerNames(m.team1)} vs {getPlayerNames(m.team2)}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {m.shuttlecockUsed} shuttlecocks
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                  </svg>
                  {m.duration}min
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                  Winner: {m.winner === "team1" ? "Team 1" : "Team 2"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 sm:p-2 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                removeMatch(m.id);
              }}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      ))}
      {matches.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
          <svg
            className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3 sm:mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            No matches recorded yet
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Click "Create New Match" to get started
          </p>
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return matchContent;
  }

  return (
    <Card className="w-full max-w-none sm:max-w-md sm:mx-auto">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Matches</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{matchContent}</CardContent>
    </Card>
  );
}
