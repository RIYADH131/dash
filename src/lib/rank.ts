import type {
  RankResult,
  RunDistance,
  Stroke,
  SwimDistance,
  Tier,
} from "./types";
import { TIER_THRESHOLDS, nextTier, tierFromScore } from "./tiers";

/* -------------------------------------------------------------------------- */
/* Bodybuilding — bodyweight-adjusted total (Wilks-flavored, simplified)      */
/* -------------------------------------------------------------------------- */

/**
 * Returns a 0..1000 score given a powerlifting total and bodyweight (kg).
 * Uses a simplified Wilks-style coefficient. Bodyfat is a soft modifier (-/+ ~5%).
 */
export function bodybuildingScore(opts: {
  benchKg: number;
  squatKg: number;
  deadliftKg: number;
  bodyweightKg: number;
  bodyFatPct?: number;
}): RankResult {
  const total = opts.benchKg + opts.squatKg + opts.deadliftKg;
  const bw = Math.max(opts.bodyweightKg, 40);
  // simplified Wilks: coefficient peaks around 75-85kg, drops on extremes
  const coef =
    500 / (-216.0475 + 16.26 * bw - 0.002388 * bw ** 2 - 0.00113 * bw ** 3 + 7.01863e-6 * bw ** 4 - 1.291e-8 * bw ** 5);
  const wilks = total * Math.max(coef, 0.45);
  let score = Math.min(1000, wilks * 1.6);

  if (opts.bodyFatPct != null) {
    // lower bodyfat = small bonus, higher = small penalty
    const bf = opts.bodyFatPct;
    const mod = bf <= 12 ? 1.05 : bf >= 25 ? 0.95 : 1;
    score *= mod;
  }
  score = Math.max(0, Math.min(1000, score));
  return packResult(score, (t) => bbToNext(t, total, bw));
}

function bbToNext(tier: Tier, total: number, bw: number): string | null {
  const next = nextTier(tier);
  if (!next) return null;
  // back-solve approximate total needed for next tier
  const targetScore = TIER_THRESHOLDS[next];
  const coef =
    500 /
    (-216.0475 +
      16.26 * bw -
      0.002388 * bw ** 2 -
      0.00113 * bw ** 3 +
      7.01863e-6 * bw ** 4 -
      1.291e-8 * bw ** 5);
  const targetTotal = (targetScore / 1.6) / Math.max(coef, 0.45);
  const delta = Math.max(2.5, Math.round((targetTotal - total) / 2.5) * 2.5);
  return `+${delta} kg total to reach ${next}`;
}

/* -------------------------------------------------------------------------- */
/* Swimming — FINA-style points (simplified; uses world-class baselines)      */
/* -------------------------------------------------------------------------- */

/** Approximate world-record-class times in seconds, by stroke + distance (LCM). */
const SWIM_BASELINES: Record<Stroke, Partial<Record<SwimDistance, number>>> = {
  freestyle: { 50: 20.91, 100: 46.86, 200: 102.0, 400: 220.07 },
  backstroke: { 50: 23.55, 100: 51.6, 200: 111.92 },
  breaststroke: { 50: 25.95, 100: 56.88, 200: 125.95 },
  butterfly: { 50: 22.27, 100: 49.45, 200: 110.34 },
};

export function swimmingScore(opts: {
  stroke: Stroke;
  distanceM: SwimDistance;
  totalSeconds: number;
}): RankResult {
  const base =
    SWIM_BASELINES[opts.stroke][opts.distanceM] ??
    SWIM_BASELINES.freestyle[opts.distanceM] ??
    100;
  // FINA-style: points = 1000 * (base/time)^3 — capped
  const ratio = base / Math.max(opts.totalSeconds, 1);
  const fina = 1000 * Math.pow(ratio, 3);
  const score = Math.max(0, Math.min(1000, fina));
  return packResult(score, (tier) => {
    const next = nextTier(tier);
    if (!next) return null;
    const targetScore = TIER_THRESHOLDS[next];
    // back-solve target seconds
    const targetTime = base / Math.cbrt(targetScore / 1000);
    const delta = Math.max(0.05, opts.totalSeconds - targetTime);
    return `−${delta.toFixed(2)}s to reach ${next}`;
  });
}

/* -------------------------------------------------------------------------- */
/* Running — Riegel-normalized 5k pace, then percentile mapping               */
/* -------------------------------------------------------------------------- */

/** Approximate world-class baseline times (seconds) by distance (km). */
const RUN_BASELINES: Record<RunDistance, number> = {
  1: 130, // 2:10
  5: 755, // 12:35
  10: 1571, // 26:11
  21: 3406, // 56:46
  42: 7235, // 2:00:35
};

/**
 * Score 0..1000 — the closer to world-class baseline, the higher.
 * Falls off cubically to mirror swimming's curve.
 */
export function runningScore(opts: {
  distanceKm: RunDistance;
  totalSeconds: number;
}): RankResult {
  const base = RUN_BASELINES[opts.distanceKm];
  const ratio = base / Math.max(opts.totalSeconds, 1);
  const score = Math.max(0, Math.min(1000, 1000 * Math.pow(ratio, 2.6)));
  return packResult(score, (tier) => {
    const next = nextTier(tier);
    if (!next) return null;
    const targetScore = TIER_THRESHOLDS[next];
    const targetTime = base / Math.pow(targetScore / 1000, 1 / 2.6);
    const delta = Math.max(1, Math.round(opts.totalSeconds - targetTime));
    const m = Math.floor(delta / 60);
    const s = delta % 60;
    const fmt = m > 0 ? `${m}m ${s}s` : `${s}s`;
    return `−${fmt} to reach ${next}`;
  });
}

/* -------------------------------------------------------------------------- */

function packResult(
  score: number,
  toNextFn: (tier: Tier) => string | null,
): RankResult {
  const tier = tierFromScore(score);
  const percentile = Math.round((score / 1000) * 100);
  const context =
    tier === "Champion"
      ? `You're in the top 1% of the DASH community.`
      : `You're stronger than ~${percentile}% of athletes in your sport.`;
  return {
    tier,
    score: Math.round(score),
    context,
    toNext: toNextFn(tier),
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers for input parsing                                                  */
/* -------------------------------------------------------------------------- */

export function timeToSeconds(minutes: number, seconds: number): number {
  return Math.max(0, minutes) * 60 + Math.max(0, seconds);
}

export function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(2).padStart(5, "0")}`;
}
