"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import RankRing from "@/components/RankRing";
import SegmentedControl from "@/components/SegmentedControl";
import {
  bodybuildingScore,
  runningScore,
  swimmingScore,
  timeToSeconds,
} from "@/lib/rank";
import {
  TIERS,
  TIER_ICON,
  TIER_THRESHOLDS,
  nextTier,
} from "@/lib/tiers";
import type {
  RankResult,
  RunDistance,
  Sport,
  Stroke,
  SwimDistance,
} from "@/lib/types";
import clsx from "clsx";

export default function CalculatorPage() {
  const [sport, setSport] = useState<Sport>("bodybuilding");
  const [result, setResult] = useState<RankResult | null>(null);

  // bodybuilding
  const [bench, setBench] = useState<string>("");
  const [squat, setSquat] = useState<string>("");
  const [dl, setDl] = useState<string>("");
  const [bw, setBw] = useState<string>("");
  const [bf, setBf] = useState<string>("");

  // swimming
  const [stroke, setStroke] = useState<Stroke>("freestyle");
  const [swimDist, setSwimDist] = useState<SwimDistance>(100);
  const [swimMin, setSwimMin] = useState<string>("");
  const [swimSec, setSwimSec] = useState<string>("");

  // running
  const [runDist, setRunDist] = useState<RunDistance>(5);
  const [runMin, setRunMin] = useState<string>("");
  const [runSec, setRunSec] = useState<string>("");

  function calculate() {
    if (sport === "bodybuilding") {
      const r = bodybuildingScore({
        benchKg: Number(bench) || 0,
        squatKg: Number(squat) || 0,
        deadliftKg: Number(dl) || 0,
        bodyweightKg: Number(bw) || 80,
        bodyFatPct: bf ? Number(bf) : undefined,
      });
      setResult(r);
    } else if (sport === "swimming") {
      const total = timeToSeconds(Number(swimMin) || 0, Number(swimSec) || 0);
      if (total <= 0) return;
      setResult(swimmingScore({ stroke, distanceM: swimDist, totalSeconds: total }));
    } else {
      const total = timeToSeconds(Number(runMin) || 0, Number(runSec) || 0);
      if (total <= 0) return;
      setResult(runningScore({ distanceKm: runDist, totalSeconds: total }));
    }
  }

  return (
    <div className="flex flex-col gap-5 pt-5 pb-12">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-headline-lg text-ink">
          Rank Calculator
        </h1>
        <p className="text-ink-muted text-sm">
          Bodyweight-adjusted Wilks for strength · FINA-style for swim · Riegel
          for run.
        </p>
      </header>

      <SegmentedControl<Sport>
        items={[
          { value: "bodybuilding", label: "Strength" },
          { value: "swimming", label: "Swim" },
          { value: "running", label: "Run" },
        ]}
        value={sport}
        onChange={(v) => {
          setSport(v);
          setResult(null);
        }}
      />

      {sport === "bodybuilding" && (
        <div className="flex flex-col gap-4">
          <InputField
            label="Bench Press"
            inputMode="decimal"
            value={bench}
            onChange={(e) => setBench(e.target.value)}
            fontVariant="mono"
            placeholder="0"
            trailing="kg"
          />
          <InputField
            label="Back Squat"
            inputMode="decimal"
            value={squat}
            onChange={(e) => setSquat(e.target.value)}
            fontVariant="mono"
            placeholder="0"
            trailing="kg"
          />
          <InputField
            label="Deadlift"
            inputMode="decimal"
            value={dl}
            onChange={(e) => setDl(e.target.value)}
            fontVariant="mono"
            placeholder="0"
            trailing="kg"
          />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Bodyweight"
              inputMode="decimal"
              value={bw}
              onChange={(e) => setBw(e.target.value)}
              fontVariant="mono"
              placeholder="0"
              trailing="kg"
            />
            <InputField
              label="Body Fat (opt.)"
              inputMode="decimal"
              value={bf}
              onChange={(e) => setBf(e.target.value)}
              fontVariant="mono"
              placeholder="—"
              trailing="%"
            />
          </div>
          <p className="text-[11px] text-ink-muted leading-snug">
            Rank is bodyweight-adjusted using a Wilks-style coefficient. Body
            fat applies a small ±5% modifier.
          </p>
        </div>
      )}

      {sport === "swimming" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium mb-2">
              Stroke
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { v: "freestyle", label: "Freestyle", icon: "pool" },
                  { v: "backstroke", label: "Backstroke", icon: "rowing" },
                  { v: "breaststroke", label: "Breast", icon: "waves" },
                  { v: "butterfly", label: "Butterfly", icon: "air" },
                ] as const
              ).map((s) => {
                const active = s.v === stroke;
                return (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => setStroke(s.v)}
                    className={clsx(
                      "flex items-center justify-center gap-2 rounded-xl border py-3 transition-all duration-200 active:scale-[0.97]",
                      active
                        ? "bg-teal-accent/15 border-teal-accent text-teal-accent"
                        : "bg-surface border-white/10 text-ink-muted",
                    )}
                  >
                    <Icon name={s.icon} size={18} />
                    <span className="font-display font-semibold uppercase tracking-widest text-[11px]">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium mb-2">
              Distance
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {([50, 100, 200, 400] as SwimDistance[]).map((d) => {
                const active = d === swimDist;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSwimDist(d)}
                    className={clsx(
                      "px-4 py-2 rounded-full border whitespace-nowrap font-display font-semibold uppercase tracking-widest text-[11px] transition-all duration-200 active:scale-[0.97]",
                      active
                        ? "bg-teal-accent/15 border-teal-accent text-teal-accent"
                        : "bg-surface border-white/10 text-ink-muted",
                    )}
                  >
                    {d}m
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Minutes"
              inputMode="numeric"
              value={swimMin}
              onChange={(e) => setSwimMin(e.target.value)}
              fontVariant="mono"
              placeholder="00"
            />
            <InputField
              label="Seconds"
              inputMode="decimal"
              value={swimSec}
              onChange={(e) => setSwimSec(e.target.value)}
              fontVariant="mono"
              placeholder="00.00"
            />
          </div>
        </div>
      )}

      {sport === "running" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium mb-2">
              Distance
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {([1, 5, 10, 21, 42] as RunDistance[]).map((d) => {
                const active = d === runDist;
                const labelMap: Record<RunDistance, string> = {
                  1: "1km",
                  5: "5km",
                  10: "10km",
                  21: "Half",
                  42: "Full",
                };
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setRunDist(d)}
                    className={clsx(
                      "px-4 py-2 rounded-full border whitespace-nowrap font-display font-semibold uppercase tracking-widest text-[11px] transition-all duration-200 active:scale-[0.97]",
                      active
                        ? "bg-amber-accent/15 border-amber-accent text-amber-accent"
                        : "bg-surface border-white/10 text-ink-muted",
                    )}
                  >
                    {labelMap[d]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Minutes"
              inputMode="numeric"
              value={runMin}
              onChange={(e) => setRunMin(e.target.value)}
              fontVariant="mono"
              placeholder="00"
            />
            <InputField
              label="Seconds"
              inputMode="numeric"
              value={runSec}
              onChange={(e) => setRunSec(e.target.value)}
              fontVariant="mono"
              placeholder="00"
            />
          </div>
        </div>
      )}

      <PrimaryButton onClick={calculate}>Calculate Rank</PrimaryButton>

      {/* RESULT */}
      {result && (
        <section
          key={`${result.tier}-${result.score}`}
          className="bg-surface rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col items-center gap-4 animate-fade-up"
        >
          <RankRing tier={result.tier} progress={result.score / 1000} size={140} />
          <div className="text-center">
            <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium">
              Your Rank
            </p>
            <h2
              className={clsx(
                "font-display font-extrabold text-display-xl mt-1 leading-none tracking-tight",
                `tier-${result.tier.toLowerCase()}`,
              )}
              style={{ background: "transparent" }}
            >
              {result.tier}
            </h2>
            <p className="text-ink-muted text-sm mt-3 leading-relaxed max-w-xs">
              {result.context}
            </p>
          </div>

          {/* TIER RAIL */}
          <div className="w-full flex items-center justify-between mt-2">
            {TIERS.map((t) => {
              const active = t === result.tier;
              return (
                <div
                  key={t}
                  className={clsx(
                    "flex flex-col items-center gap-1 transition-all duration-200",
                    active ? "scale-110" : "opacity-40",
                  )}
                >
                  <span
                    className={clsx(
                      "w-8 h-8 rounded-full grid place-items-center text-[10px] font-display font-extrabold uppercase border border-white/10",
                      `tier-${t.toLowerCase()}`,
                      active && "ring-2 ring-electric/50",
                    )}
                  >
                    <Icon name={TIER_ICON[t]} size={14} />
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-ink-muted font-semibold">
                    {t.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>

          {result.toNext && (
            <div className="w-full">
              <ProgressBar
                value={
                  (result.score - TIER_THRESHOLDS[result.tier]) /
                  ((nextTier(result.tier)
                    ? TIER_THRESHOLDS[nextTier(result.tier)!]
                    : 1000) -
                    TIER_THRESHOLDS[result.tier])
                }
                size="md"
              />
              <p className="text-xs text-ink-muted mt-2 text-center">
                <span className="text-electric font-semibold">{result.toNext}</span>
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
