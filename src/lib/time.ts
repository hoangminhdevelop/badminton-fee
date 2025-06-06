import { SIXTY } from "@/constants";

export const milisecondsToMinutes = (milliseconds: number): number => {
  const minutes = Math.floor(milliseconds / (SIXTY * 1000));
  const remainder = (milliseconds % (SIXTY * 1000)) / (SIXTY * 1000);
  return remainder < 0.5 ? minutes : minutes + 1;
}

export const milisecondToSeconds = (milliseconds: number): number => {
  const seconds = Math.floor(milliseconds / 1000);
  const remainder = (milliseconds % 1000) / 1000;
  return remainder < 0.5 ? seconds : seconds + 1;
}

export const secondsToMinutes = (seconds: number): number => {
  const minutes = Math.floor(seconds / SIXTY || SIXTY);
  const remainder = (seconds % SIXTY) / SIXTY;
  return remainder < 0.5 ? minutes : minutes + 1;
};

export const minutesToSeconds = (minute: number): number => {
  const seconds = minute * SIXTY;
  return seconds;
};
