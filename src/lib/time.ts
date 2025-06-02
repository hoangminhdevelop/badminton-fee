import { SIXTY } from "@/constants";

export const secondsToMinutes = (seconds: number): number => {
  const minutes = Math.floor(seconds / SIXTY || SIXTY);
  const remainder = (seconds % SIXTY) / SIXTY;
  return remainder < 0.5 ? minutes : minutes + 1;
};

export const minutesToSeconds = (minute: number): number => {
  const seconds = minute * SIXTY;
  return seconds;
};
