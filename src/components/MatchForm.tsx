import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getMatches, getPlayers, saveMatches } from "../lib/storage";
import type { Match } from "../lib/types";

const matchSchema = z.object({
  team1: z.array(z.string()).min(1).max(2),
  team2: z.array(z.string()).min(1).max(2),
  shuttlecockUsed: z.number().min(0),
  duration: z.number().min(1),
  winner: z.enum(["team1", "team2"]),
});

type MatchForm = z.infer<typeof matchSchema>;

export default function MatchForm({
  onSave,
  editingMatch,
  triggerOnly = false,
}: {
  onSave?: () => void;
  editingMatch?: Match;
  triggerOnly?: boolean;
}) {
  const players = getPlayers();
  const [show, setShow] = useState(false);

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [useDurationInput, setUseDurationInput] = useState(!!editingMatch);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-open form when editingMatch is provided (for clicking on matches in the list)
  useEffect(() => {
    if (editingMatch) {
      setShow(true);
      setUseDurationInput(true); // Force manual input for editing
    } else {
      setShow(false);
      setUseDurationInput(false); // Allow timer for new matches
    }
  }, [editingMatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<MatchForm>({
    resolver: zodResolver(matchSchema),
    defaultValues: editingMatch
      ? {
          team1: editingMatch.team1,
          team2: editingMatch.team2,
          shuttlecockUsed: editingMatch.shuttlecockUsed,
          duration: editingMatch.duration,
          winner: editingMatch.winner,
        }
      : {
          team1: [],
          team2: [],
          shuttlecockUsed: 0,
          duration: 1,
          winner: "team1",
        },
  });

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          const newSeconds = prev + 1;
          const minutes = Math.floor(newSeconds / 60);
          setValue("duration", minutes || 1); // Set minimum 1 minute
          return newSeconds;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, setValue]);

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    const minutes = Math.floor(timerSeconds / 60);
    setValue("duration", minutes || 1);
    setTimerSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const team1 = watch("team1");
  const team2 = watch("team2");

  const availableForTeam = (team: "team1" | "team2") => {
    if (team === "team1") return players.filter((p) => !team2.includes(p.id));
    return players.filter((p) => !team1.includes(p.id));
  };

  const onSubmit = (data: MatchForm) => {
    const matches = getMatches();
    if (editingMatch) {
      const updated = matches.map((m) =>
        m.id === editingMatch.id ? { ...editingMatch, ...data } : m
      );
      saveMatches(updated);
    } else {
      const newMatch: Match = { id: crypto.randomUUID(), ...data };
      saveMatches([...matches, newMatch]);
    }

    // Reset form and timer state
    reset();
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShow(false);
    if (onSave) onSave();
  };

  const handleClose = () => {
    // Reset timer state on close
    setIsTimerRunning(false);
    setTimerSeconds(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShow(false);
    if (onSave) onSave();
  };

  return (
    <>
      {triggerOnly ? (
        <Button
          onClick={() => setShow(true)}
          className="bg-green-500 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base"
        >
          {editingMatch ? "Edit Match" : "Create New Match"}
        </Button>
      ) : (
        <div className="w-full sm:max-w-md sm:mx-auto">
          <Button
            onClick={() => setShow(true)}
            className="w-full h-10 sm:h-11"
            variant={editingMatch ? "default" : "outline"}
          >
            {editingMatch ? "Edit Match" : "Create New Match"}
          </Button>
        </div>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {editingMatch ? "Edit Match" : "Create New Match"}
            </DialogTitle>
            <DialogClose onClick={handleClose} />
          </DialogHeader>

          <div className="px-1 sm:px-6 pb-6 pt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* Player Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700">
                  Team 1
                  {team1.length > 0 && (
                    <span className="ml-2 text-xs text-slate-500">
                      ({team1.length}/2 selected)
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {/* Selected players for Team 1 */}
                  {team1.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 bg-blue-50 rounded-lg border">
                      {team1.map((id) => {
                        const player = players.find((p) => p.id === id);
                        if (!player) return null;
                        return (
                          <Badge
                            key={id}
                            variant="default"
                            className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            onRemove={() =>
                              setValue(
                                "team1",
                                team1.filter((pid) => pid !== id)
                              )
                            }
                          >
                            {player.name}
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Available players for Team 1 */}
                  {team1.length < 2 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="text-xs text-slate-500 w-full mb-1">
                        Available players:
                      </span>
                      {availableForTeam("team1")
                        .filter((p) => !team1.includes(p.id))
                        .map((player) => (
                          <button
                            key={player.id}
                            type="button"
                            onClick={() => {
                              if (team1.length < 2) {
                                setValue("team1", [...team1, player.id]);
                              }
                            }}
                            className="px-2 py-1 text-xs sm:text-sm border border-slate-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors duration-150 bg-white text-slate-700"
                          >
                            {player.name}
                          </button>
                        ))}
                      {availableForTeam("team1").filter(
                        (p) => !team1.includes(p.id)
                      ).length === 0 && (
                        <span className="text-xs text-slate-400 italic">
                          No available players
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {errors.team1 && (
                  <span className="text-destructive text-xs sm:text-sm mt-1 block">
                    {errors.team1.message as string}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700">
                  Team 2
                  {team2.length > 0 && (
                    <span className="ml-2 text-xs text-slate-500">
                      ({team2.length}/2 selected)
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {/* Selected players for Team 2 */}
                  {team2.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 bg-green-50 rounded-lg border">
                      {team2.map((id) => {
                        const player = players.find((p) => p.id === id);
                        if (!player) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            onRemove={() =>
                              setValue(
                                "team2",
                                team2.filter((pid) => pid !== id)
                              )
                            }
                          >
                            {player.name}
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Available players for Team 2 */}
                  {team2.length < 2 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="text-xs text-slate-500 w-full mb-1">
                        Available players:
                      </span>
                      {availableForTeam("team2")
                        .filter((p) => !team2.includes(p.id))
                        .map((player) => (
                          <button
                            key={player.id}
                            type="button"
                            onClick={() => {
                              if (team2.length < 2) {
                                setValue("team2", [...team2, player.id]);
                              }
                            }}
                            className="px-2 py-1 text-xs sm:text-sm border border-slate-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors duration-150 bg-white text-slate-700"
                          >
                            {player.name}
                          </button>
                        ))}
                      {availableForTeam("team2").filter(
                        (p) => !team2.includes(p.id)
                      ).length === 0 && (
                        <span className="text-xs text-slate-400 italic">
                          No available players
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {errors.team2 && (
                  <span className="text-destructive text-xs sm:text-sm mt-1 block">
                    {errors.team2.message as string}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Shuttlecock Used
                </label>
                <Input
                  type="number"
                  className="h-10 sm:h-11"
                  {...register("shuttlecockUsed", {
                    valueAsNumber: true,
                    validate: (value) => value >= 0 || "Must be 0 or greater",
                  })}
                  min={0}
                  step={1}
                />
                {errors.shuttlecockUsed && (
                  <span className="text-destructive text-xs sm:text-sm">
                    {errors.shuttlecockUsed.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Duration (minutes)
                </label>

                {!editingMatch && (
                  <div className="mb-3">
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant={useDurationInput ? "outline" : "default"}
                        size="sm"
                        onClick={() => setUseDurationInput(false)}
                        className="flex-1"
                      >
                        Timer
                      </Button>
                      <Button
                        type="button"
                        variant={useDurationInput ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseDurationInput(true)}
                        className="flex-1"
                      >
                        Manual Input
                      </Button>
                    </div>
                  </div>
                )}

                {!useDurationInput && !editingMatch ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-slate-700 mb-2">
                        {formatTime(timerSeconds)}
                      </div>
                      <div className="text-sm text-slate-500">
                        Duration: {Math.floor(timerSeconds / 60) || 1} minutes
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {!isTimerRunning ? (
                        <Button
                          type="button"
                          onClick={startTimer}
                          variant="default"
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={pauseTimer}
                          variant="default"
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button
                        type="button"
                        onClick={stopTimer}
                        variant="outline"
                        size="sm"
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Stop
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="number"
                    className="h-10 sm:h-11"
                    {...register("duration", {
                      valueAsNumber: true,
                      validate: (value) =>
                        value >= 1 || "Must be at least 1 minute",
                    })}
                    min={1}
                    step={1}
                  />
                )}

                {errors.duration && (
                  <span className="text-destructive text-xs sm:text-sm">
                    {errors.duration.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Winner
                </label>
                <Select {...register("winner")} className="w-full h-10 sm:h-11">
                  <option value="team1">Team 1</option>
                  <option value="team2">Team 2</option>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 sm:pt-6">
                <Button type="submit" className="flex-1 h-10 sm:h-11">
                  {editingMatch ? "Update Match" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-10 sm:h-11"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
