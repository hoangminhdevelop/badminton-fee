// TypeScript types for the app
export interface Player {
  id: string;
  name: string;
}

export interface CostSettings {
  stage: number; // VND
  shuttlecock: number; // VND
}

export interface Match {
  id: string;
  team1: string[]; // player ids
  team2: string[]; // player ids
  shuttlecockUsed: number;
  duration: number; // in seconds
  winner?: "team1" | "team2";
  isRunning: boolean;
  createdAt: Date; // ISO date string
  betShuttlecockUsed: boolean; // true if shuttlecock is shared
  applyStageFee: boolean; // true if stage fee is applied
}

export interface FeeResult {
  playerId: string;
  name: string;
  matches: number;
  wins: number;
  total: number;
}
