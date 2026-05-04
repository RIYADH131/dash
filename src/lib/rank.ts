import type {
  ExerciseId,
  RankResult,
  RunDistance,
  Stroke,
  SwimDistance,
  Tier,
} from "./types";
import { TIER_THRESHOLDS, TIERS, nextTier, tierFromScore } from "./tiers";

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
/* Exercise rank — single-lift, max weight × max reps                         */
/* -------------------------------------------------------------------------- */

/**
 * Strength standards expressed as estimated 1RM ÷ bodyweight.
 * Sourced from widely cited intermediate→world-class powerlifting tables
 * (e.g. strengthlevel.com, ExRx). One row per supported lift, one column
 * per tier. Used to map a single-exercise PR into the DASH 7-tier system.
 */
export const EXERCISE_STANDARDS: Record<ExerciseId, Record<Tier, number>> = {
  bench: {
    Bronze: 0.5,
    Silver: 0.75,
    Gold: 1.0,
    Platinum: 1.25,
    Diamond: 1.5,
    Titan: 1.75,
    Champion: 2.1,
  },
  squat: {
    Bronze: 0.75,
    Silver: 1.0,
    Gold: 1.5,
    Platinum: 1.85,
    Diamond: 2.15,
    Titan: 2.5,
    Champion: 2.85,
  },
  deadlift: {
    Bronze: 1.0,
    Silver: 1.4,
    Gold: 1.85,
    Platinum: 2.2,
    Diamond: 2.55,
    Titan: 2.85,
    Champion: 3.2,
  },
  ohp: {
    Bronze: 0.35,
    Silver: 0.55,
    Gold: 0.75,
    Platinum: 0.95,
    Diamond: 1.15,
    Titan: 1.35,
    Champion: 1.55,
  },
  row: {
    Bronze: 0.5,
    Silver: 0.75,
    Gold: 1.0,
    Platinum: 1.2,
    Diamond: 1.4,
    Titan: 1.6,
    Champion: 1.85,
  },
  front_squat: {
    Bronze: 0.6,
    Silver: 0.85,
    Gold: 1.2,
    Platinum: 1.5,
    Diamond: 1.75,
    Titan: 2.05,
    Champion: 2.35,
  },
  rdl: {
    Bronze: 0.75,
    Silver: 1.1,
    Gold: 1.5,
    Platinum: 1.85,
    Diamond: 2.15,
    Titan: 2.45,
    Champion: 2.75,
  },
  weighted_pullup: {
    // ratio of (added load) / bodyweight at 1 rep
    Bronze: 0,
    Silver: 0.1,
    Gold: 0.25,
    Platinum: 0.45,
    Diamond: 0.65,
    Titan: 0.85,
    Champion: 1.05,
  },
};

export const EXERCISE_LABEL: Record<ExerciseId, string> = {
  bench: "Bench Press",
  squat: "Back Squat",
  deadlift: "Deadlift",
  ohp: "Overhead Press",
  row: "Barbell Row",
  front_squat: "Front Squat",
  rdl: "Romanian Deadlift",
  weighted_pullup: "Weighted Pull-up",
};

/** Epley estimated 1RM: 1RM = w × (1 + reps/30). Reps clamped to [1, 12]. */
export function estimateOneRepMax(weightKg: number, reps: number): number {
  const r = Math.max(1, Math.min(12, reps));
  if (r === 1) return weightKg;
  return weightKg * (1 + r / 30);
}

/**
 * Rank a single-exercise effort using estimated 1RM relative to bodyweight,
 * mapped against per-lift strength standards.
 */
export function exerciseScore(opts: {
  exercise: ExerciseId;
  weightKg: number;
  reps: number;
  bodyweightKg: number;
}): RankResult & { oneRepMax: number; ratio: number } {
  const oneRm = estimateOneRepMax(opts.weightKg, opts.reps);
  const bw = Math.max(opts.bodyweightKg, 40);
  const ratio = oneRm / bw;
  const standards = EXERCISE_STANDARDS[opts.exercise];

  // map ratio to a 0..1000 score by interpolating between tier thresholds
  let score: number;
  if (ratio <= standards.Bronze) {
    // sub-Bronze: scale 0..200 by how close to Bronze
    score = Math.max(0, (ratio / Math.max(standards.Bronze, 0.01)) * TIER_THRESHOLDS.Silver);
  } else if (ratio >= standards.Champion) {
    score = 1000;
  } else {
    // find bracket
    let lower: Tier = "Bronze";
    let upper: Tier = "Champion";
    for (let i = 0; i < TIERS.length - 1; i++) {
      const a = TIERS[i];
      const b = TIERS[i + 1];
      if (ratio >= standards[a] && ratio < standards[b]) {
        lower = a;
        upper = b;
        break;
      }
    }
    const span = standards[upper] - standards[lower];
    const frac = span > 0 ? (ratio - standards[lower]) / span : 0;
    const lo = TIER_THRESHOLDS[lower];
    const hi =
      upper === "Champion" ? 1000 : TIER_THRESHOLDS[upper];
    score = lo + (hi - lo) * frac;
  }
  score = Math.max(0, Math.min(1000, score));

  const result = packResult(score, (tier) => {
    const next = nextTier(tier);
    if (!next) return null;
    const targetRatio = standards[next];
    const targetOneRm = targetRatio * bw;
    // back-solve weight needed at the user's rep count to hit that 1RM
    const r = Math.max(1, Math.min(12, opts.reps));
    const targetWeight =
      r === 1 ? targetOneRm : targetOneRm / (1 + r / 30);
    const delta = Math.max(2.5, Math.round((targetWeight - opts.weightKg) / 2.5) * 2.5);
    return `+${delta} kg @ ${r} reps to reach ${next}`;
  });

  return { ...result, oneRepMax: oneRm, ratio };
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
