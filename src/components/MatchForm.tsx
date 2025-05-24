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
import { useEffect, useState } from "react";
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

  // Auto-open form when editingMatch is provided (for clicking on matches in the list)
  useEffect(() => {
    if (editingMatch) {
      setShow(true);
    } else {
      setShow(false);
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
          duration: 30,
          winner: "team1",
        },
  });

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
    reset();
    setShow(false);
    if (onSave) onSave();
  };

  const handleClose = () => {
    setShow(false);
    if (onSave) onSave();
  };

  return (
    <>
      {triggerOnly ? (
        <Button
          onClick={() => setShow(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base"
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
              {/* ...existing form content... */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Team 1
                </label>
                <Select
                  value=""
                  className="w-full h-10 sm:h-11"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !team1.includes(val) && team1.length < 2) {
                      setValue("team1", [...team1, val]);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Select player
                  </option>
                  {availableForTeam("team1")
                    .filter((p) => !team1.includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </Select>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {team1.map((id) => {
                    const player = players.find((p) => p.id === id);
                    if (!player) return null;
                    return (
                      <Badge
                        key={id}
                        variant="default"
                        className="text-xs sm:text-sm"
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
                {errors.team1 && (
                  <span className="text-destructive text-xs sm:text-sm">
                    {errors.team1.message as string}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Team 2
                </label>
                <Select
                  value=""
                  className="w-full h-10 sm:h-11"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !team2.includes(val) && team2.length < 2) {
                      setValue("team2", [...team2, val]);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Select player
                  </option>
                  {availableForTeam("team2")
                    .filter((p) => !team2.includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </Select>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {team2.map((id) => {
                    const player = players.find((p) => p.id === id);
                    if (!player) return null;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="text-xs sm:text-sm"
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
                {errors.team2 && (
                  <span className="text-destructive text-xs sm:text-sm">
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
