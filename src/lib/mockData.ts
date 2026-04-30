import type { Activity, LeaderboardEntry, Sport } from "./types";

export const MOCK_USER = {
  name: "Riyadh Al-Khalil",
  username: "@riyadh78912",
  avatar: "RK",
  primarySport: "bodybuilding" as Sport,
  rankScore: 712, // Diamond
  bodybuildingTier: "Diamond" as const,
  swimmingTier: "Gold" as const,
  runningTier: "Silver" as const,
  bests: {
    bodybuildingTotalKg: 510,
    swim100mFreestyle: "01:02.34",
    run5km: "21:14",
  },
  todayCalories: 2340,
  todayCalorieTarget: 2800,
  proteinG: 188,
  proteinGTarget: 210,
  workoutsThisWeek: 5,
  streakDays: 14,
};

const SAMPLES: Record<Sport, Omit<LeaderboardEntry, "id" | "rank">[]> = {
  bodybuilding: [
    { name: "Marcus Vance", username: "@iron_vance", sport: "bodybuilding", tier: "Champion", value: "245 KG bench", verified: true, avatar: "MV" },
    { name: "Diego Ortiz", username: "@d_ortiz", sport: "bodybuilding", tier: "Titan", value: "232 KG bench", verified: true, avatar: "DO" },
    { name: "Yuki Tanaka", username: "@yuki_t", sport: "bodybuilding", tier: "Titan", value: "228 KG bench", verified: true, avatar: "YT" },
    { name: "Anna Kovacs", username: "@anna_k", sport: "bodybuilding", tier: "Diamond", value: "215 KG bench", verified: true, avatar: "AK" },
    { name: "Sam Patel", username: "@sam.p", sport: "bodybuilding", tier: "Diamond", value: "210 KG bench", verified: false, avatar: "SP" },
    { name: "Riyadh Al-Khalil", username: "@riyadh78912", sport: "bodybuilding", tier: "Diamond", value: "205 KG bench", verified: true, avatar: "RK" },
    { name: "Chen Wei", username: "@chen.w", sport: "bodybuilding", tier: "Platinum", value: "192 KG bench", verified: true, avatar: "CW" },
    { name: "Sara Lopez", username: "@s.lopez", sport: "bodybuilding", tier: "Platinum", value: "188 KG bench", verified: false, avatar: "SL" },
    { name: "Jonas Berg", username: "@jonasb", sport: "bodybuilding", tier: "Platinum", value: "185 KG bench", verified: true, avatar: "JB" },
  ],
  swimming: [
    { name: "Lia Moreau", username: "@lia_swims", sport: "swimming", tier: "Champion", value: "00:24.71", verified: true, avatar: "LM" },
    { name: "Ravi Shah", username: "@ravi_s", sport: "swimming", tier: "Titan", value: "00:25.18", verified: true, avatar: "RS" },
    { name: "Nora Lindqvist", username: "@nora_l", sport: "swimming", tier: "Titan", value: "00:25.42", verified: true, avatar: "NL" },
    { name: "Tom Becker", username: "@t_becker", sport: "swimming", tier: "Diamond", value: "00:26.01", verified: true, avatar: "TB" },
    { name: "Aisha Rahman", username: "@aisha", sport: "swimming", tier: "Diamond", value: "00:26.34", verified: false, avatar: "AR" },
    { name: "Felix Roy", username: "@felix.r", sport: "swimming", tier: "Platinum", value: "00:27.10", verified: true, avatar: "FR" },
  ],
  running: [
    { name: "Kemi Adeyemi", username: "@kemi_runs", sport: "running", tier: "Champion", value: "13:48", verified: true, avatar: "KA" },
    { name: "Hassan Yusuf", username: "@h_yusuf", sport: "running", tier: "Titan", value: "14:12", verified: true, avatar: "HY" },
    { name: "Lena Hoff", username: "@lena.h", sport: "running", tier: "Titan", value: "14:33", verified: true, avatar: "LH" },
    { name: "Mateo Ricci", username: "@mateo_r", sport: "running", tier: "Diamond", value: "15:01", verified: false, avatar: "MR" },
    { name: "Priya Iyer", username: "@priya_i", sport: "running", tier: "Diamond", value: "15:24", verified: true, avatar: "PI" },
    { name: "Otis Bell", username: "@otis_b", sport: "running", tier: "Platinum", value: "16:02", verified: true, avatar: "OB" },
  ],
};

export function leaderboardFor(sport: Sport): LeaderboardEntry[] {
  return SAMPLES[sport].map((e, i) => ({
    ...e,
    id: `${sport}-${i}`,
    rank: i + 1,
  }));
}

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    sport: "bodybuilding",
    title: "Bench Press PR",
    value: "205 kg × 1",
    ago: "2h ago",
  },
  {
    id: "a2",
    sport: "swimming",
    title: "100m Freestyle",
    value: "01:02.34",
    ago: "Yesterday",
  },
  {
    id: "a3",
    sport: "running",
    title: "5km Tempo Run",
    value: "21:14 — 4:14/km",
    ago: "2 days ago",
  },
  {
    id: "a4",
    sport: "bodybuilding",
    title: "Squat Heavy Triple",
    value: "180 kg × 3",
    ago: "3 days ago",
  },
];

export const FUEL_PERFORMANCE = {
  yesterday: {
    proteinG: 212,
    calories: 2950,
    carbsG: 340,
  },
  today: {
    pr: "Bench +5 kg",
    volumeChangePct: 8,
    timeDeltaSec: -2.1, // negative = faster
  },
  insight: "High protein yesterday → PR on bench today.",
};

/* Active live challenge — countdown driven */
export const LIVE_CHALLENGE = {
  title: "100kg Bench × Max Reps",
  startedAtIso: new Date().toISOString(),
  /** ends in N hours from page load — used by the countdown */
  endsAtOffsetMs: 1000 * 60 * 60 * 36 + 1000 * 60 * 17, // 36h 17m
  spotsClaimed: 147,
  spotsTotal: 200,
  rules: [
    "Pause-and-go reps only (no bouncing).",
    "Single continuous unedited video clip.",
    "Bar must lock out fully on every rep.",
  ],
  exercise: "Flat Barbell Bench Press",
  target: "100 kg @ Max Reps",
  recentEntries: [
    { id: "ce1", rank: 1, name: "Marcus Vance", username: "@iron_vance", sport: "bodybuilding" as const, tier: "Champion" as const, value: "32 reps", verified: true, avatar: "MV" },
    { id: "ce2", rank: 2, name: "Diego Ortiz", username: "@d_ortiz", sport: "bodybuilding" as const, tier: "Titan" as const, value: "28 reps", verified: true, avatar: "DO" },
    { id: "ce3", rank: 3, name: "Anna Kovacs", username: "@anna_k", sport: "bodybuilding" as const, tier: "Diamond" as const, value: "26 reps", verified: false, avatar: "AK" },
    { id: "ce4", rank: 4, name: "Sam Patel", username: "@sam.p", sport: "bodybuilding" as const, tier: "Diamond" as const, value: "24 reps", verified: false, avatar: "SP" },
  ],
};

export const PROGRAMS = [
  {
    id: "p1",
    name: "12-Week Bench Block",
    sport: "bodybuilding" as Sport,
    duration: "12 wk",
    result: "+18 kg bench avg",
  },
  {
    id: "p2",
    name: "Sub-21 5k Builder",
    sport: "running" as Sport,
    duration: "8 wk",
    result: "−1:42 5k avg",
  },
];

export const COACH_PROMPTS = [
  "Why didn't I PR today?",
  "Plan tomorrow's session",
  "What should I eat for recovery?",
  "How am I trending vs last month?",
  "Build me a deload week",
];
