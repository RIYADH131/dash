"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import RankRing from "@/components/RankRing";
import SegmentedControl from "@/components/SegmentedControl";
import {
  EXERCISE_LABEL,
  bodybuildingScore,
  exerciseScore,
  runningScore,
  swimmingScore,
  timeToSeconds,
} from "@/lib/rank";
import {
  TIERS,
  TIER_THRESHOLDS,
  nextTier,
} from "@/lib/tiers";
import TierEmblem from "@/components/TierEmblem";
import type {
  ExerciseId,
  RankResult,
  RunDistance,
  Stroke,
  SwimDistance,
} from "@/lib/types";
import clsx from "clsx";

type Mode = "bodybuilding" | "swimming" | "running" | "exercise";

export default function CalculatorPage() {
  const [mode, setMode] = useState<Mode>("bodybuilding");
  const [result, setResult] = useState<RankResult | null>(null);
  const [oneRm, setOneRm] = useState<number | null>(null);

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

  // exercise (single-lift max weight × max reps)
  const [exId, setExId] = useState<ExerciseId>("bench");
  const [exWeight, setExWeight] = useState<string>("");
  const [exReps, setExReps] = useState<string>("");
  const [exBw, setExBw] = useState<string>("");

  function calculate() {
    setOneRm(null);
    if (mode === "bodybuilding") {
      const r = bodybuildingScore({
        benchKg: Number(bench) || 0,
        squatKg: Number(squat) || 0,
        deadliftKg: Number(dl) || 0,
        bodyweightKg: Number(bw) || 80,
        bodyFatPct: bf ? Number(bf) : undefined,
      });
      setResult(r);
    } else if (mode === "swimming") {
      const total = timeToSeconds(Number(swimMin) || 0, Number(swimSec) || 0);
      if (total <= 0) return;
      setResult(swimmingScore({ stroke, distanceM: swimDist, totalSeconds: total }));
    } else if (mode === "running") {
      const total = timeToSeconds(Number(runMin) || 0, Number(runSec) || 0);
      if (total <= 0) return;
      setResult(runningScore({ distanceKm: runDist, totalSeconds: total }));
    } else {
      const w = Number(exWeight) || 0;
      const r = Number(exReps) || 0;
      const bwn = Number(exBw) || 0;
      if (w <= 0 || r <= 0 || bwn <= 0) return;
      const out = exerciseScore({
        exercise: exId,
        weightKg: w,
        reps: r,
        bodyweightKg: bwn,
      });
      setResult(out);
      setOneRm(out.oneRepMax);
    }
  }

  return (
    <div className="flex flex-col gap-5 pt-5 pb-12">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-headline-lg text-ink">
          Rank Calculator
        </h1>
        <p className="text-ink-muted text-sm">
          Wilks for strength · FINA for swim · Riegel for run · 1RM standards
          for single-lift.
        </p>
      </header>

      <SegmentedControl<Mode>
        items={[
          { value: "bodybuilding", label: "Strength" },
          { value: "swimming", label: "Swim" },
          { value: "running", label: "Run" },
          { value: "exercise", label: "Exercise" },
        ]}
        value={mode}
        size="sm"
        onChange={(v) => {
          setMode(v);
          setResult(null);
          setOneRm(null);
        }}
      />

      {mode === "bodybuilding" && (
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

      {mode === "swimming" && (
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

      {mode === "running" && (
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

      {mode === "exercise" && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-widest text-ink-muted font-medium mb-2">
              Exercise
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
              {(
                Object.keys(EXERCISE_LABEL) as ExerciseId[]
              ).map((id) => {
                const active = id === exId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExId(id)}
                    className={clsx(
                      "px-4 py-2 rounded-full border whitespace-nowrap font-display font-semibold uppercase tracking-widest text-[11px] transition-all duration-200 active:scale-[0.97]",
                      active
                        ? "bg-electric/15 border-electric text-electric"
                        : "bg-surface border-white/10 text-ink-muted",
                    )}
                  >
                    {EXERCISE_LABEL[id]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Max Weight"
              inputMode="decimal"
              value={exWeight}
              onChange={(e) => setExWeight(e.target.value)}
              fontVariant="mono"
              placeholder="0"
              trailing="kg"
            />
            <InputField
              label="Max Reps"
              inputMode="numeric"
              value={exReps}
              onChange={(e) => setExReps(e.target.value)}
              fontVariant="mono"
              placeholder="0"
            />
          </div>
          <InputField
            label="Bodyweight"
            inputMode="decimal"
            value={exBw}
            onChange={(e) => setExBw(e.target.value)}
            fontVariant="mono"
            placeholder="0"
            trailing="kg"
          />
          <p className="text-[11px] text-ink-muted leading-snug">
            Estimated 1RM via Epley (weight × (1 + reps/30)), then mapped to
            tier using bodyweight-relative strength standards. Accurate up to
            ~12 reps.
          </p>
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

          {oneRm != null && (
            <div className="w-full grid grid-cols-2 gap-3 mt-1">
              <div className="bg-navy rounded-xl border border-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
                  Est. 1RM
                </p>
                <p className="font-mono text-lg text-ink mt-1">
                  {oneRm.toFixed(1)} kg
                </p>
              </div>
              <div className="bg-navy rounded-xl border border-white/5 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
                  Score
                </p>
                <p className="font-mono text-lg text-ink mt-1">
                  {result.score} / 1000
                </p>
              </div>
            </div>
          )}

          {/* TIER RAIL */}
          <div className="w-full flex items-center justify-between mt-2">
            {TIERS.map((t) => {
              const active = t === result.tier;
              return (
                <div
                  key={t}
                  className={clsx(
                    "flex flex-col items-center gap-1.5 transition-all duration-200",
                    active ? "scale-110" : "opacity-40",
                  )}
                >
                  <TierEmblem tier={t} size={active ? 36 : 28} />
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
