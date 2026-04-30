export type Sport = "bodybuilding" | "swimming" | "running";

export type Tier =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Titan"
  | "Champion";

export type Stroke = "freestyle" | "backstroke" | "breaststroke" | "butterfly";

export type SwimDistance = 50 | 100 | 200 | 400;
export type RunDistance = 1 | 5 | 10 | 21 | 42;

export interface RankResult {
  tier: Tier;
  score: number; // 0..1000 normalized
  /** copy explaining where the user sits */
  context: string;
  /** how much improvement is needed for the next tier (string for the UI) */
  toNext: string | null;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  username: string;
  sport: Sport;
  tier: Tier;
  /** display value (e.g. "215 KG", "00:28.45", "21:14") */
  value: string;
  verified: boolean;
  avatar: string; // emoji or url
}

export interface Activity {
  id: string;
  sport: Sport;
  title: string;
  value: string;
  ago: string;
}
