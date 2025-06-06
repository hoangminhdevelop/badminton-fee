import { useCallback, useEffect, useState } from 'react';
import type { Match } from '@/lib/types';

interface UseRealTimeDurationOptions {
  match: Match;
  isRunning: boolean;
  updateIntervalInMilliseconds?: number;
}

export const useRealTimeDuration = ({ 
  match, 
  isRunning, 
  updateIntervalInMilliseconds = 1000 
}: UseRealTimeDurationOptions) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const calculateMatchDurationInMilliseconds = useCallback(() => {
    if (isRunning && match.startedAt) {
      return currentTime - new Date(match.startedAt).getTime();
    }

    if (match.endedAt && match.startedAt) {
      return (
        new Date(match.endedAt).getTime() - new Date(match.startedAt).getTime()
      );
    }

    return 0;
  }, [isRunning, match.startedAt, match.endedAt, currentTime]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, updateIntervalInMilliseconds);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, updateIntervalInMilliseconds]);

  return calculateMatchDurationInMilliseconds();
};