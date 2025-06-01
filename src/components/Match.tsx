import { Button } from "@/components/ui/button";
import { useAppContext } from "@/hooks/useAppContext";
import { getPlayers } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Swords } from "lucide-react";
import React, { useEffect } from "react";
import type { Match as MatchType } from "../lib/types";
import { Badge } from "./ui/badge";
import MatchForm from "./MatchForm";
import { SIXTY_SECONDS } from "@/constants";
import { secondsToMinutes } from "@/lib/time";

interface MatchProps {
  match: MatchType;
}

export default function Match({ match }: MatchProps) {
  const { removeMatch, updateMatch } = useAppContext();

  const timer = React.useRef<NodeJS.Timeout | string | number | undefined>(
    undefined
  );

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(
    match.duration || SIXTY_SECONDS
  );
  const players = getPlayers();
  const team1Players = players.filter((p) => match.team1.includes(p.id));
  const team2Players = players.filter((p) => match.team2.includes(p.id));

  const isTeam1Winner = match.winner === "team1";
  const isTeam2Winner = match.winner === "team2";

  const startMatch = () => {
    setIsPlaying(true);
    updateMatch(match.id, {
      isRunning: true,
    });
  };

  const stopMatch = () => {
    setIsPlaying(false);
    updateMatch(match.id, {
      isRunning: false,
    });
    clearInterval(timer.current);
  };

  useEffect(() => {
    if (match.isRunning) {
      setIsPlaying(true);
      timer.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000); // Increment every second
    } else {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = undefined;
      }
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = undefined;
      }
    };
  }, [match.isRunning]);
  useEffect(() => {
    if (match.duration !== duration) {
      updateMatch(match.id, { duration });
    }
  }, [match.duration, match.isRunning, duration, updateMatch, match.id]);
  return (
    <div className="relative bg-gradient-to-r p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 transition-all duration-200 shadow-sm hover:shadow-md from-blue-50 to-indigo-50  ring-2 ring-blue-200">
      <div className="flex justify-between items-start gap-2 flex-col sm:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {team1Players.map((p) => (
                <Badge
                  key={p.id}
                  className={cn("px-2 py-1 rounded-sm", {
                    "bg-amber-400 text-black": isTeam1Winner,
                  })}
                >
                  {p.name}
                </Badge>
              ))}
            </div>
            <Swords size={16} />
            <div className="flex gap-1">
              {team2Players.map((p) => (
                <Badge
                  key={p.id}
                  className={cn("p-1 rounded-sm", {
                    "bg-amber-400 text-black": isTeam2Winner,
                  })}
                >
                  {p.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="flex items-center gap-1">
              <b>Số cầu: </b> {match.shuttlecockUsed}
            </p>
            <p className="flex items-center gap-1">
              <b>Thời gian:</b>
              {`${secondsToMinutes(duration).toString().padStart(2, "0")}:${(
                duration % SIXTY_SECONDS
              )
                .toString()
                .padStart(2, "0")}`}{" "}
              phút
            </p>
            <p>
              <b>Độ cầu: </b> {match.betShuttlecockUsed ? "Có" : "Không"}
            </p>
            <p>
              <b>Tiền sân: </b> {match.applyStageFee ? "Có" : "Không"}
            </p>
          </div>
        </div>

        {/* Timer Controls and Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Timer Controls */}
          <div className="flex items-center gap-1">
            {isPlaying ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 hover:bg-red-50"
                onClick={stopMatch}
              >
                Dừng
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 hover:bg-green-50"
                onClick={startMatch}
              >
                Bắt đầu
              </Button>
            )}
          </div>

          {/* Edit Button */}
          {!isPlaying && (
            <MatchForm key={JSON.stringify(match)} defaultValues={match} />
          )}

          {/* Delete Button */}
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 rounded-lg p-1.5 sm:p-2"
            onClick={() => {
              removeMatch(match.id);
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
