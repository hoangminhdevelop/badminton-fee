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
import { getPlayers, MATCHES_KEY_STORAGE } from "@/lib/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PlayerTag from "./PlayerTag";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { subMinutes } from "date-fns";

import { useAppContext } from "@/hooks/useAppContext";
import type { Match } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { milisecondsToMinutes } from "@/lib/time";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

const matchSchema = z.object({
  team1: z
    .array(z.string())
    .min(1, "Phải chọn ít nhất 1 người")
    .max(2, "Tối đa là 2 người"),
  team2: z
    .array(z.string())
    .min(1, "Phải chọn ít nhất 1 người")
    .max(2, "Tối đa là 2 người"),
  shuttlecockUsed: z.coerce.number().min(0),
  duration: z.coerce.number().min(0),
  winner: z
    .enum(["team1", "team2"], {
      message: "Phải chọn đội thắng",
    })
    .nullable()
    .optional(),
  betShuttlecockUsed: z.boolean(),
  applyStageFee: z.boolean(),
});

type MatchForm = z.infer<typeof matchSchema>;

type MatchFormProps = {
  defaultValues?: Match;
};

export default function MatchForm({ defaultValues }: MatchFormProps) {
  const { addNewMatch, updateMatch } = useAppContext();
  const players = getPlayers();
  const [show, setShow] = useState(false);

  const isUpdateForm = !!defaultValues;

  const form = useForm<MatchForm>({
    resolver: zodResolver(matchSchema),
    defaultValues: isUpdateForm
      ? {
          ...defaultValues,
          duration: milisecondsToMinutes(
            defaultValues.endedAt && defaultValues.startedAt
              ? new Date(defaultValues.endedAt).getTime() -
                  new Date(defaultValues.startedAt).getTime()
              : 0
          ),
        }
      : {
          team1: [],
          team2: [],
          shuttlecockUsed: 0,
          duration: 0,
          winner: null,
          betShuttlecockUsed: false,
          applyStageFee: false,
        },
  });

  const { handleSubmit, watch } = form;

  const team1 = watch("team1");
  const team2 = watch("team2");

  const availableForTeam = (team: "team1" | "team2") => {
    if (team === "team1") return players.filter((p) => !team2.includes(p.id));
    return players.filter((p) => !team1.includes(p.id));
  };

  const onSubmit = ({ duration, ...data }: MatchForm) => {
    const gameTimes: {
      startedAt: Date;
      endedAt?: Date;
    } = {
      startedAt: new Date(),
      endedAt: undefined,
    };

    if (duration) {
      const now = new Date();
      gameTimes.startedAt = subMinutes(now, duration);
      gameTimes.endedAt = now;
    }

    if (isUpdateForm) {
      // Update match processing
      const updatedMatchData: Match = {
        ...defaultValues,
        ...data,
        ...gameTimes,
      };
      updateMatch(defaultValues.id, updatedMatchData);
      toast.success("Cập nhật trận đấu thành công!");
    }

    // Add new match processing
    if (!isUpdateForm) {
      const matchId = `${MATCHES_KEY_STORAGE}${uuid()}`;
      const matchData: Match = {
        ...data,
        id: matchId,
        isRunning: false,
        createdAt: new Date(),
        ...gameTimes,
      };
      addNewMatch(matchData);
      toast.success("Tạo trận đấu mới thành công!");
    }
    // Close the dialog and reset the form
    setShow(false);
    form.reset();
  };

  const handleClose = () => {
    setShow(false);
    form.reset();
  };

  return (
    <>
      {isUpdateForm ? (
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 rounded-lg px-3 py-1.5"
          onClick={() => setShow(true)}
        >
          Edit
        </Button>
      ) : (
        <Button
          onClick={() => setShow(true)}
          className="bg-green-500 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base"
        >
          Thêm mới
        </Button>
      )}

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {isUpdateForm ? "Cập nhật trận đấu" : " Tạo trận đấu mới"}
            </DialogTitle>
            <DialogClose onClick={handleClose} />
          </DialogHeader>

          <div className="px-1 sm:px-6 pb-6 pt-0">
            <Form {...form}>
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Team 1 selection */}
                <FormField
                  control={form.control}
                  name="team1"
                  render={({ field: { value, onChange } }) => {
                    const availablePlayers = availableForTeam("team1").filter(
                      (p) => !value.includes(p.id)
                    );

                    return (
                      <FormItem>
                        <FormLabel>
                          Team 1
                          {value.length > 0 && (
                            <span className="ml-2 text-xs text-slate-500">
                              ({value.length}/2 selected)
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {/* Selected players for Team 1 */}
                            {value.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 bg-blue-50 rounded-lg border">
                                {value.map((id) => {
                                  const player = players.find(
                                    (p) => p.id === id
                                  );
                                  if (!player) return null;
                                  return (
                                    <Badge
                                      key={id}
                                      variant="default"
                                      className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                      onRemove={() =>
                                        onChange(
                                          value.filter((pid) => pid !== id)
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
                            {value.length < 2 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-xs text-slate-500 w-full mb-1">
                                  Chọn người chơi:
                                </span>
                                {availablePlayers.map((player) => (
                                  <PlayerTag
                                    player={player}
                                    key={player.id}
                                    onClick={() => {
                                      if (value.length < 2) {
                                        onChange([...value, player.id]);
                                      }
                                    }}
                                  />
                                ))}
                                {availablePlayers.length === 0 && (
                                  <span className="text-xs text-slate-400 italic">
                                    Không có người chơi khả dụng
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Team 2 selection (moved and refactored) */}
                <FormField
                  control={form.control}
                  name="team2"
                  render={({ field: { value, onChange } }) => {
                    const availablePlayers = availableForTeam("team2").filter(
                      (p) => !value.includes(p.id)
                    );

                    return (
                      <FormItem>
                        <FormLabel>
                          Team 2
                          {value.length > 0 && (
                            <span className="ml-2 text-xs text-slate-500">
                              ({value.length}/2 selected)
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {/* Selected players for Team 2 */}
                            {value.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 p-2 bg-green-50 rounded-lg border">
                                {value.map((id) => {
                                  const player = players.find(
                                    (p) => p.id === id
                                  );
                                  if (!player) return null;
                                  return (
                                    <Badge
                                      key={id}
                                      variant="secondary"
                                      className="text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                                      onRemove={() =>
                                        onChange(
                                          value.filter((pid) => pid !== id)
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
                            {value.length < 2 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-xs text-slate-500 w-full mb-1">
                                  Chọn người chơi:
                                </span>
                                {availablePlayers.map((player) => (
                                  <PlayerTag
                                    player={player}
                                    key={player.id}
                                    onClick={() => {
                                      if (value.length < 2) {
                                        onChange([...value, player.id]);
                                      }
                                    }}
                                  />
                                ))}
                                {availablePlayers.length === 0 && (
                                  <span className="text-xs text-slate-400 italic">
                                    Không có người chơi khả dụng
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="shuttlecockUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số cầu sử dụng</FormLabel>
                      <FormControl>
                        <Input
                          className="h-10 sm:h-11"
                          min={0}
                          step={1}
                          type="number"
                          inputMode="numeric"
                          value={field.value || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian (phút)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="h-10 sm:h-11"
                          step={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="winner"
                  defaultValue={undefined}
                  render={({ field: { value, onChange } }) => {
                    const isTeam1Winner = value === "team1";
                    const isTeam2Winner = value === "team2";

                    return (
                      <FormItem>
                        <FormLabel>Đội thắng</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              className="px-4 py-2"
                              variant={isTeam1Winner ? "default" : "secondary"}
                              onClick={() =>
                                onChange(isTeam1Winner ? null : "team1")
                              }
                            >
                              Team 1
                            </Badge>
                            <Badge
                              className="px-4 py-2"
                              variant={isTeam2Winner ? "default" : "secondary"}
                              onClick={() =>
                                onChange(isTeam2Winner ? null : "team2")
                              }
                            >
                              Team 2
                            </Badge>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="betShuttlecockUsed"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center">
                            <FormLabel
                              htmlFor="betShuttlecockUsed"
                              className="ml-2"
                            >
                              Độ tiền cầu:&nbsp;
                            </FormLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="applyStageFee"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center">
                            <FormLabel
                              htmlFor="betShuttlecockUsed"
                              className="ml-2"
                            >
                              Tính tiền sân:&nbsp;
                            </FormLabel>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 sm:pt-6">
                  {isUpdateForm ? (
                    <Button
                      type="submit"
                      className="flex-1 h-10 sm:h-11 bg-blue-500 hover:bg-blue-600"
                    >
                      Cập nhật
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1 h-10 sm:h-11">
                      Tạo
                    </Button>
                  )}
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
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
