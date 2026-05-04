"use client";
import MetricCard from "./MetricCard";
import { sumLog, readLog, todayIso } from "@/lib/macros";
import { useEffect, useState } from "react";

type GoalsLite = { cal: number; protein: number };

function readGoalsLite(): GoalsLite {
  if (typeof window === "undefined") return { cal: 2400, protein: 180 };
  try {
    const raw = window.localStorage.getItem("dash:macroGoals:v1");
    if (!raw) return { cal: 2400, protein: 180 };
    const parsed = JSON.parse(raw);
    return {
      cal: Number(parsed?.cal) || 2400,
      protein: Number(parsed?.protein) || 180,
    };
  } catch {
    return { cal: 2400, protein: 180 };
  }
}

export default function LiveMacroTiles({
  fallbackCal,
  fallbackCalTarget,
  fallbackProtein,
  fallbackProteinTarget,
}: {
  fallbackCal: number;
  fallbackCalTarget: number;
  fallbackProtein: number;
  fallbackProteinTarget: number;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState({ cal: 0, protein: 0 });
  const [goals, setGoals] = useState<GoalsLite>({
    cal: fallbackCalTarget,
    protein: fallbackProteinTarget,
  });

  useEffect(() => {
    function refresh() {
      setGoals(readGoalsLite());
      const log = readLog(todayIso());
      const totals = sumLog(log);
      setToday({ cal: totals.cal, protein: totals.protein });
    }
    refresh();
    setHydrated(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  // Until hydrated, render the SSR fallback to avoid hydration warnings.
  const cal = hydrated ? Math.round(today.cal) : fallbackCal;
  const calTarget = hydrated ? goals.cal : fallbackCalTarget;
  const protein = hydrated ? Math.round(today.protein) : fallbackProtein;
  const proteinTarget = hydrated ? goals.protein : fallbackProteinTarget;

  return (
    <>
      <MetricCard
        label="Calories Today"
        value={cal.toLocaleString()}
        progress={calTarget === 0 ? 0 : cal / calTarget}
        hint={`of ${calTarget.toLocaleString()} kcal`}
      />
      <MetricCard
        label="Protein"
        value={`${protein} g`}
        progress={proteinTarget === 0 ? 0 : protein / proteinTarget}
        hint={`of ${proteinTarget} g`}
      />
    </>
  );
}
