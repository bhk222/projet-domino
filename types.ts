
export interface Team {
  id: string;
  name: string; // e.g., "Player A & Player B"
  players: [string, string];
}

// Represents scores for one round, mapping team ID to their score for that round.
export interface RoundScores {
  [teamId: string]: number;
}

export type WinType = 'standard' | 'total_abyad' | 'penalty_106';

export interface GameRecord {
  id: string; // timestamp or uuid
  winner: Team;
  loser: Team;
  winnerScore: number;
  loserScore: number;
  winType: WinType;
  date: string; // ISO string
  rounds: RoundScores[];
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  abyadLosses: number;
}