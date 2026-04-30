import type { Tier, Sport } from "./types";

export const TIERS: Tier[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Titan",
  "Champion",
];

/** 0..1000 score → tier thresholds. */
export const TIER_THRESHOLDS: Record<Tier, number> = {
  Bronze: 0,
  Silver: 200,
  Gold: 380,
  Platinum: 540,
  Diamond: 680,
  Titan: 820,
  Champion: 940,
};

export function tierFromScore(score: number): Tier {
  let current: Tier = "Bronze";
  for (const t of TIERS) {
    if (score >= TIER_THRESHOLDS[t]) current = t;
  }
  return current;
}

export function nextTier(tier: Tier): Tier | null {
  const i = TIERS.indexOf(tier);
  return i >= 0 && i < TIERS.length - 1 ? TIERS[i + 1] : null;
}

export const TIER_CLASS: Record<Tier, string> = {
  Bronze: "tier-bronze",
  Silver: "tier-silver",
  Gold: "tier-gold",
  Platinum: "tier-platinum",
  Diamond: "tier-diamond",
  Titan: "tier-titan",
  Champion: "tier-champion",
};

export const TIER_ICON: Record<Tier, string> = {
  Bronze: "shield",
  Silver: "shield",
  Gold: "military_tech",
  Platinum: "workspace_premium",
  Diamond: "diamond",
  Titan: "bolt",
  Champion: "emoji_events",
};

export const SPORT_LABEL: Record<Sport, string> = {
  bodybuilding: "Bodybuilding",
  swimming: "Swimming",
  running: "Running",
};

export const SPORT_ICON: Record<Sport, string> = {
  bodybuilding: "fitness_center",
  swimming: "pool",
  running: "directions_run",
};

/** Tailwind-compatible classes per sport (used on accent borders, icons). */
export const SPORT_ACCENT: Record<
  Sport,
  { text: string; bg: string; border: string; hex: string }
> = {
  bodybuilding: {
    text: "text-white",
    bg: "bg-white/10",
    border: "border-white/30",
    hex: "#FFFFFF",
  },
  swimming: {
    text: "text-teal-accent",
    bg: "bg-teal-accent/20",
    border: "border-teal-accent/30",
    hex: "#2DD4BF",
  },
  running: {
    text: "text-amber-accent",
    bg: "bg-amber-accent/10",
    border: "border-amber-accent/30",
    hex: "#F59E0B",
  },
};
