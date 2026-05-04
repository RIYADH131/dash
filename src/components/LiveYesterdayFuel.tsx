"use client";
import { useEffect, useState } from "react";
import { readLog, sumLog, yesterdayIso } from "@/lib/macros";

export default function LiveYesterdayFuel({
  fallbackProtein,
  fallbackCalories,
  fallbackCarbs,
}: {
  fallbackProtein: number;
  fallbackCalories: number;
  fallbackCarbs: number;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [v, setV] = useState({
    protein: fallbackProtein,
    cal: fallbackCalories,
    carbs: fallbackCarbs,
    fromLog: false,
  });

  useEffect(() => {
    function refresh() {
      const log = readLog(yesterdayIso());
      const total =
        log.breakfast.length +
        log.lunch.length +
        log.dinner.length +
        log.snack.length;
      if (total === 0) {
        setV({
          protein: fallbackProtein,
          cal: fallbackCalories,
          carbs: fallbackCarbs,
          fromLog: false,
        });
        return;
      }
      const t = sumLog(log);
      setV({
        protein: Math.round(t.protein),
        cal: Math.round(t.cal),
        carbs: Math.round(t.carbs),
        fromLog: true,
      });
    }
    refresh();
    setHydrated(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [fallbackProtein, fallbackCalories, fallbackCarbs]);

  return (
    <ul className="mt-2 space-y-1 font-mono text-sm">
      <li>{v.protein} g protein</li>
      <li>{v.cal} kcal</li>
      <li>{v.carbs} g carbs</li>
      {hydrated && v.fromLog && (
        <li className="text-[10px] uppercase tracking-widest text-electric font-display font-semibold">
          From your log
        </li>
      )}
    </ul>
  );
}
