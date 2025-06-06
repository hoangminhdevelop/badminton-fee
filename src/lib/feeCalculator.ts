import { SIXTY } from "@/constants";
import type { CostSettings, FeeResult, Match, Player } from "./types";
import { milisecondsToMinutes } from "./time";
import { Decimal } from "decimal.js";
import { roundMoney } from "./currency";

export function calculateFees(
  matches: Match[],
  players: Player[],
  costs: CostSettings
): FeeResult[] {
  const playerMap = new Map(
    players.map((p) => [
      p.id,
      {
        ...p,
        matches: 0,
        wins: 0,
        stageFee: new Decimal(0),
        shuttlecockFee: new Decimal(0),
      },
    ])
  );
  if (!costs) return [];
  for (const match of matches) {
    const allPlayers = [...match.team1, ...match.team2];
    const winners = !match.winner
      ? []
      : match.winner === "team1"
      ? match.team1
      : match.team2;
    const losers = !match.winner
      ? []
      : match.winner === "team1"
      ? match.team2
      : match.team1;

    // Only calculate fees if applyStageFee is true
    const moneyForPerMinute = new Decimal(costs.stage).div(SIXTY);

    const durations =
      match.endedAt && match.startedAt
        ? new Date(match.endedAt).getTime() -
          new Date(match.startedAt).getTime()
        : 0;

    const gameFee = match.applyStageFee
      ? new Decimal(milisecondsToMinutes(durations)).mul(moneyForPerMinute)
      : new Decimal(0);

    const gameFeePerPlayer = gameFee.div(allPlayers.length);

    // Track wins for winning team

    for (const pid of allPlayers) {
      const p = playerMap.get(pid);
      if (p) {
        p.matches += 1;
        p.stageFee = p.stageFee.plus(gameFeePerPlayer);

        // Add win if player is on winning team
        if (winners.includes(pid)) {
          p.wins += 1;
        }
      }
    }

    const isBet = !!match.betShuttlecockUsed && match.shuttlecockUsed;

    // If no team won or isShare is true, share the shuttlecock cost among all players
    const payForShuttlecocks = isBet ? losers : allPlayers;

    if (payForShuttlecocks.length > 0) {
      const shuttleFee = new Decimal(costs.shuttlecock)
        .mul(match.shuttlecockUsed)
        .div(payForShuttlecocks.length);

      for (const pid of payForShuttlecocks) {
        const player = playerMap.get(pid);
        if (player) {
          player.shuttlecockFee = player.shuttlecockFee.plus(shuttleFee);
        }
      }
    }
  }
  return Array.from(playerMap.values()).map((p) => ({
    playerId: p.id,
    name: p.name,
    matches: p.matches,
    wins: p.wins,
    stateFee: roundMoney(p.stageFee.toNumber()),
    shuttlecockFee: roundMoney(p.shuttlecockFee.toNumber()),
  }));
}
