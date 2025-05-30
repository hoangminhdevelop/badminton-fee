import { SIXTY_SECONDS } from "@/constants";
import type { CostSettings, FeeResult, Match, Player } from "./types";
import { secondsToMinutes } from "./time";

export function calculateFees(
  matches: Match[],
  players: Player[],
  costs: CostSettings
): FeeResult[] {
  const playerMap = new Map(
    players.map((p) => [p.id, { ...p, matches: 0, wins: 0, total: 0 }])
  );
  if (!costs) return [];

  for (const match of matches) {
    const allPlayers = [...match.team1, ...match.team2];
    const matchFee = Math.ceil(
      (costs.stage * (secondsToMinutes(match.duration) / SIXTY_SECONDS)) /
        allPlayers.length
    );

    // Track wins for winning team
    const winningTeam = match.winner === "team1" ? match.team1 : match.team2;

    for (const pid of allPlayers) {
      const p = playerMap.get(pid);
      if (p) {
        p.matches += 1;
        p.total += matchFee;

        // Add win if player is on winning team
        if (winningTeam.includes(pid)) {
          p.wins += 1;
        }
      }
    }

    const isShare = match.isShareShuttlecockUsed;
    const loser = match.winner === "team1" ? match.team2 : match.team1;
    const allPlayersInMatch = [...match.team1, ...match.team2];

    if (match.shuttlecockUsed > 0) {
      const shareGroup = isShare ? allPlayersInMatch : loser;
      if (shareGroup.length > 0) {
        const shuttleFee = Math.ceil(
          (costs.shuttlecock * match.shuttlecockUsed) / shareGroup.length
        );
        for (const pid of shareGroup) {
          const player = playerMap.get(pid);
          if (player) player.total += shuttleFee;
        }
      }
    }
  }
  return Array.from(playerMap.values()).map((p) => ({
    playerId: p.id,
    name: p.name,
    matches: p.matches,
    wins: p.wins,
    total: Math.ceil(p.total / 1000) * 1000, // round up to nearest 1,000 VND
  }));
}
