import { SIXTY_SECONDS } from "@/constants";

export const secondsToMinutes = (seconds: number): number => {
  const minutes = Math.floor(seconds / SIXTY_SECONDS || SIXTY_SECONDS);
  const remainder = (seconds % SIXTY_SECONDS) / SIXTY_SECONDS;
  return remainder < 0.5 ? minutes : minutes + 1;
};

export const minutesToSeconds = (minute: number): number => {
  const seconds = minute * SIXTY_SECONDS;
  return seconds;
};
