import { SIXTY_SECONDS } from "@/constants";

export const secondsToMinutes = (seconds: number): number => {
  const minutes = Math.floor(seconds / SIXTY_SECONDS);
  return minutes;
};

export const minutesToSeconds = (minute: number): number => {
  const seconds = minute * SIXTY_SECONDS;
  return seconds;
};
