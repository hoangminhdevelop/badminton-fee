import type { Match } from "@/lib/types";
import { intervalToDuration } from "date-fns";
import { useCallback, useEffect, useState } from "react";

type MatchDurationDisplayProps = {
  match: Match;
  isRunning: boolean;
};

function MatchDurationDisplay({ match, isRunning }: MatchDurationDisplayProps) {
  const [duration, setDuration] = useState(0);

  const calculateMatchDurationInMilliseconds = useCallback(() => {
    if (isRunning && match.startedAt) {
      return new Date().getTime() - new Date(match.startedAt).getTime();
    }

    if (match.endedAt && match.startedAt) {
      return (
        new Date(match.endedAt).getTime() - new Date(match.startedAt).getTime()
      );
    }

    return 0;
  }, [isRunning, match.startedAt, match.endedAt]);

  const matchDuration = intervalToDuration({
    start: 0,
    end: duration,
  });

  const minutes = matchDuration.minutes || 0;
  const seconds = matchDuration.seconds || 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const newDuration = calculateMatchDurationInMilliseconds();
      setDuration(newDuration);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [calculateMatchDurationInMilliseconds]);

  return (
    <>
      {minutes < 10 ? `0${minutes}` : minutes} phút{" "}
      {seconds < 10 ? `0${seconds}` : seconds} giây
    </>
  );
}

export default MatchDurationDisplay;
