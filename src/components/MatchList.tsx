import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { getMatches, saveMatches } from "../lib/storage";
import type { Match } from "../lib/types";
import MatchComponent from "./Match";

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

  const handleTimerUpdate = (matchId: string, duration: number) => {
    const updatedMatches = matches.map((match) =>
      match.id === matchId ? { ...match, duration } : match
    );
    setMatches(updatedMatches);
    saveMatches(updatedMatches);
    // Don't trigger onChange for timer updates to prevent interference with other timers
    // onChange is only called for deletions to update fee table
  };

  const handleDelete = (id: string) => {
    const updated = matches.filter((m) => m.id !== id);
    setMatches(updated);
    saveMatches(updated);
    // Trigger refresh of parent components (including fee table)
    if (onChange) onChange();
  };

  const matchContent = (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchComponent
          key={match.id}
          match={match}
          editingMatch={editingMatch}
          onEdit={onEdit}
          onDelete={handleDelete}
          onTimerUpdate={handleTimerUpdate}
        />
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
