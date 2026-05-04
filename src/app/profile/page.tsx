"use client";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import MetricCard from "@/components/MetricCard";
import ProgressBar from "@/components/ProgressBar";
import SectionTitle from "@/components/SectionTitle";
import SportBadge from "@/components/SportBadge";
import TierBadge from "@/components/TierBadge";
import TierEmblem from "@/components/TierEmblem";
import { MOCK_USER, PROGRAMS } from "@/lib/mockData";
import {
  SPORT_ACCENT,
  SPORT_ICON,
  SPORT_LABEL,
  TIERS,
  TIER_THRESHOLDS,
  nextTier,
} from "@/lib/tiers";
import type { Sport, Tier } from "@/lib/types";
import clsx from "clsx";

const SPORT_BREAKDOWN: {
  sport: Sport;
  tier: Tier;
  score: number;
  topThree: { label: string; value: string }[];
}[] = [
  {
    sport: "bodybuilding",
    tier: MOCK_USER.bodybuildingTier,
    score: MOCK_USER.rankScore,
    topThree: [
      { label: "Bench Press", value: "205 kg × 1" },
      { label: "Back Squat", value: "240 kg × 1" },
      { label: "Deadlift", value: "260 kg × 1" },
    ],
  },
  {
    sport: "swimming",
    tier: MOCK_USER.swimmingTier,
    score: 410,
    topThree: [
      { label: "100m Free", value: "01:02.34" },
      { label: "200m Free", value: "02:14.10" },
      { label: "50m Fly", value: "00:28.45" },
    ],
  },
  {
    sport: "running",
    tier: MOCK_USER.runningTier,
    score: 240,
    topThree: [
      { label: "5km", value: "21:14" },
      { label: "10km", value: "44:52" },
      { label: "1km", value: "3:48" },
    ],
  },
];

export default function ProfilePage() {
  const [open, setOpen] = useState<Sport | null>("bodybuilding");

  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      {/* HERO */}
      <section className="flex flex-col items-center text-center gap-3 animate-fade-up">
        <Avatar initials={MOCK_USER.avatar} size={80} />
        <div>
          <h1 className="font-display font-bold text-headline-lg text-ink leading-tight">
            {MOCK_USER.name}
          </h1>
          <p className="text-ink-muted text-xs uppercase tracking-widest mt-1">
            {MOCK_USER.username}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SPORT_BREAKDOWN.map((b) => (
            <span
              key={b.sport}
              className="inline-flex items-center gap-1.5 bg-surface border border-white/10 rounded-full pl-1 pr-3 py-1"
            >
              <TierEmblem tier={b.tier} size={22} />
              <Icon
                name={SPORT_ICON[b.sport]}
                size={12}
                className={SPORT_ACCENT[b.sport].text}
              />
              <TierBadge tier={b.tier} />
            </span>
          ))}
        </div>
      </section>

      {/* STATS BENTO */}
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="Total Workouts" value={186} progress={186 / 250} hint="lifetime" />
        <MetricCard label="Total Volume" value={`${(94_320).toLocaleString()} kg`} hint="lifetime" />
        <MetricCard label="Best Swim" value="00:28.45" hint="50m butterfly" />
        <MetricCard label="Best 5k" value="21:14" hint="4:14 / km" />
      </section>

      {/* SPORT BREAKDOWN */}
      <section>
        <SectionTitle>Sport Breakdown</SectionTitle>
        <div className="mt-3 flex flex-col gap-2">
          {SPORT_BREAKDOWN.map((b) => {
            const accent = SPORT_ACCENT[b.sport];
            const next = nextTier(b.tier);
            const progress = next
              ? (b.score - TIER_THRESHOLDS[b.tier]) /
                (TIER_THRESHOLDS[next] - TIER_THRESHOLDS[b.tier])
              : 1;
            const isOpen = open === b.sport;
            return (
              <div
                key={b.sport}
                className="bg-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : b.sport)}
                  className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-all duration-200"
                  aria-expanded={isOpen}
                >
                  <div
                    className={`w-10 h-10 rounded-full grid place-items-center ${accent.bg} ${accent.text}`}
                  >
                    <Icon name={SPORT_ICON[b.sport]} size={20} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-sm text-ink">
                        {SPORT_LABEL[b.sport]}
                      </p>
                      <TierBadge tier={b.tier} />
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        value={progress}
                        fillClassName={
                          b.sport === "bodybuilding"
                            ? "bg-electric"
                            : b.sport === "swimming"
                              ? "bg-teal-accent"
                              : "bg-amber-accent"
                        }
                      />
                    </div>
                  </div>
                  <Icon
                    name={isOpen ? "expand_less" : "chevron_right"}
                    size={22}
                    className="text-ink-muted shrink-0"
                  />
                </button>
                {isOpen && (
                  <ul className="px-4 pb-4 pt-1 border-t border-white/5 divide-y divide-white/5 animate-fade-up">
                    {b.topThree.map((t, i) => (
                      <li
                        key={t.label}
                        className="flex items-center justify-between py-2.5"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-ink-muted font-mono text-xs w-4">
                            {i + 1}
                          </span>
                          <span className="text-sm text-ink">{t.label}</span>
                        </span>
                        <span className="font-mono text-sm text-electric">
                          {t.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PROGRAMS */}
      <section>
        <SectionTitle
          action={
            <button
              type="button"
              className="text-electric text-xs font-display font-semibold uppercase tracking-widest"
            >
              See All
            </button>
          }
        >
          My Programs
        </SectionTitle>
        <div className="mt-3 flex flex-col gap-2">
          {PROGRAMS.map((p) => (
            <Card
              key={p.id}
              padding="list"
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-electric/10 grid place-items-center text-electric">
                <Icon name="menu_book" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-ink truncate">
                  {p.name}
                </p>
                <p className="text-xs text-ink-muted">
                  {p.duration} · <span className="text-ink">{p.result}</span>
                </p>
              </div>
              <SportBadge sport={p.sport} showLabel={false} className="!px-2" />
            </Card>
          ))}
        </div>
      </section>

      {/* TIERS RAIL */}
      <section className="pt-2">
        <SectionTitle>Tier Progression</SectionTitle>
        <div className="mt-3 flex items-center justify-between">
          {TIERS.map((t) => {
            const active = t === MOCK_USER.bodybuildingTier;
            return (
              <div
                key={t}
                className={clsx(
                  "flex flex-col items-center gap-1 transition-all duration-200",
                  active ? "scale-110" : "opacity-50",
                )}
              >
                <span
                  className={clsx(
                    "w-7 h-7 rounded-full grid place-items-center text-[10px] font-display font-extrabold uppercase border border-white/10",
                    active && "ring-2 ring-electric/40",
                  )}
                >
                  <span className={`tier-${t.toLowerCase()} w-full h-full rounded-full grid place-items-center`}>
                    {t[0]}
                  </span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-ink-muted font-semibold">
                  {t}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAB */}
      <button
        type="button"
        aria-label="Publish a new program"
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-electric grid place-items-center shadow-cta active:scale-90 transition-all duration-200"
      >
        <Icon name="add" size={28} className="text-white" />
      </button>
    </div>
  );
}
