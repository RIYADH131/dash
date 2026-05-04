import Link from "next/link";
import LiveMacroTiles from "@/components/LiveMacroTiles";
import LiveYesterdayFuel from "@/components/LiveYesterdayFuel";
import MetricCard from "@/components/MetricCard";
import RankRing from "@/components/RankRing";
import SectionTitle from "@/components/SectionTitle";
import SportBadge from "@/components/SportBadge";
import Icon from "@/components/Icon";
import {
  FUEL_PERFORMANCE,
  MOCK_USER,
  RECENT_ACTIVITIES,
} from "@/lib/mockData";
import { SPORT_ACCENT, SPORT_ICON, TIER_THRESHOLDS, nextTier } from "@/lib/tiers";

export default function HomePage() {
  const tier = MOCK_USER.bodybuildingTier;
  const next = nextTier(tier);
  const ringProgress = next
    ? (MOCK_USER.rankScore - TIER_THRESHOLDS[tier]) /
      (TIER_THRESHOLDS[next] - TIER_THRESHOLDS[tier])
    : 1;

  const sportPills: { sport: keyof typeof SPORT_ACCENT; value: string }[] = [
    { sport: "bodybuilding", value: `${MOCK_USER.bests.bodybuildingTotalKg} kg total` },
    { sport: "swimming", value: MOCK_USER.bests.swim100mFreestyle },
    { sport: "running", value: MOCK_USER.bests.run5km },
  ];

  return (
    <div className="flex flex-col gap-6 pt-6">
      {/* HERO — primary sport rank */}
      <section className="flex flex-col items-center gap-4 animate-fade-up">
        <RankRing tier={tier} progress={ringProgress} size={120} />
        <div className="text-center">
          <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium">
            Bodybuilding Rank
          </p>
          <h1 className="font-display font-extrabold text-display-xl text-ink leading-none mt-1 tracking-tight">
            {tier}
          </h1>
          <p className="text-ink-muted text-sm mt-2">
            Score {MOCK_USER.rankScore}
            {next && ` · ${Math.round(ringProgress * 100)}% to ${next}`}
          </p>
        </div>

        <div className="flex w-full gap-2">
          {sportPills.map((pill) => {
            const accent = SPORT_ACCENT[pill.sport];
            return (
              <div
                key={pill.sport}
                className={`flex-1 bg-surface border border-white/10 rounded-xl px-3 py-2.5 flex flex-col items-center gap-0.5`}
              >
                <Icon
                  name={SPORT_ICON[pill.sport]}
                  className={accent.text}
                  size={18}
                />
                <span className="font-mono text-[13px] font-semibold text-ink whitespace-nowrap">
                  {pill.value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENTO METRICS */}
      <section className="grid grid-cols-2 gap-3">
        <LiveMacroTiles
          fallbackCal={MOCK_USER.todayCalories}
          fallbackCalTarget={MOCK_USER.todayCalorieTarget}
          fallbackProtein={MOCK_USER.proteinG}
          fallbackProteinTarget={MOCK_USER.proteinGTarget}
        />
        <MetricCard
          label="Weekly Workouts"
          value={MOCK_USER.workoutsThisWeek}
          progress={MOCK_USER.workoutsThisWeek / 6}
          hint="of 6 sessions"
        />
        <MetricCard
          label="Active Streak"
          value={`${MOCK_USER.streakDays}d`}
          progress={Math.min(MOCK_USER.streakDays / 30, 1)}
          hint="last 30 days"
        />
      </section>

      {/* FUEL → PERFORMANCE — unique signature card */}
      <section>
        <SectionTitle
          action={
            <Link
              href="/coach.html"
              className="text-electric text-xs font-display font-semibold uppercase tracking-widest"
            >
              Ask Coach
            </Link>
          }
        >
          Fuel → Performance
        </SectionTitle>
        <div className="mt-3 bg-surface rounded-2xl border border-white/10 shadow-2xl border-l-4 border-l-electric overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center p-5 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium">
                Yesterday — Fuel
              </p>
              <LiveYesterdayFuel
                fallbackProtein={FUEL_PERFORMANCE.yesterday.proteinG}
                fallbackCalories={FUEL_PERFORMANCE.yesterday.calories}
                fallbackCarbs={FUEL_PERFORMANCE.yesterday.carbsG}
              />
            </div>
            <div className="text-electric grid place-items-center">
              <Icon name="trending_flat" size={28} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium">
                Today — Performance
              </p>
              <ul className="mt-2 space-y-1 font-mono text-sm">
                <li className="text-electric font-semibold">{FUEL_PERFORMANCE.today.pr}</li>
                <li>Volume +{FUEL_PERFORMANCE.today.volumeChangePct}%</li>
                <li>
                  {FUEL_PERFORMANCE.today.timeDeltaSec < 0 ? "−" : "+"}
                  {Math.abs(FUEL_PERFORMANCE.today.timeDeltaSec).toFixed(1)}s avg
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-navy/60 border-t border-white/5 px-5 py-3">
            <p className="text-xs text-ink-muted">
              <span className="text-electric font-semibold">Insight ·</span>{" "}
              {FUEL_PERFORMANCE.insight}
            </p>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section>
        <SectionTitle>Recent Activity</SectionTitle>
        <ul className="mt-3 flex flex-col gap-2">
          {RECENT_ACTIVITIES.map((a) => {
            const accent = SPORT_ACCENT[a.sport];
            return (
              <li
                key={a.id}
                className={`bg-surface rounded-2xl border border-white/10 shadow-2xl p-4 flex items-center gap-3 border-l-4`}
                style={{ borderLeftColor: accent.hex }}
              >
                <div
                  className={`w-10 h-10 rounded-full grid place-items-center ${accent.bg} ${accent.text}`}
                >
                  <Icon name={SPORT_ICON[a.sport]} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-ink truncate">
                    {a.title}
                  </p>
                  <p className="font-mono text-xs text-ink-muted">{a.value}</p>
                </div>
                <SportBadge sport={a.sport} showLabel={false} className="!px-2" />
                <span className="text-[10px] uppercase tracking-widest text-ink-muted font-medium whitespace-nowrap">
                  {a.ago}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
