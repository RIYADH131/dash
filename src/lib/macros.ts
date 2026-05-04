"use client";
import { useCallback, useEffect, useState } from "react";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export const MEAL_SLOTS: MealSlot[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];
export const MEAL_LABEL: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export type MacroGoals = {
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
};

/**
 * One row in a meal slot. `foodId` is the library id (or null for custom);
 * macros are stored at log time so library edits never retroactively change
 * past entries.
 */
export type LoggedFood = {
  id: string; // unique entry id
  foodId: string | null;
  name: string;
  grams: number;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: number;
};

export type DailyLog = {
  date: string; // ISO yyyy-mm-dd
  breakfast: LoggedFood[];
  lunch: LoggedFood[];
  dinner: LoggedFood[];
  snack: LoggedFood[];
};

const GOALS_KEY = "dash:macroGoals:v1";
const LOG_KEY_PREFIX = "dash:macroLog:v1:"; // + ISO date

const DEFAULT_GOALS: MacroGoals = {
  cal: 2400,
  protein: 180,
  carbs: 280,
  fat: 70,
};

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readGoals(): MacroGoals {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  try {
    const raw = window.localStorage.getItem(GOALS_KEY);
    if (!raw) return DEFAULT_GOALS;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.cal === "number" &&
      typeof parsed.protein === "number" &&
      typeof parsed.carbs === "number" &&
      typeof parsed.fat === "number"
    ) {
      return parsed;
    }
    return DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}

function writeGoals(g: MacroGoals) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(g));
  } catch {
    /* ignore */
  }
}

function emptyLog(date: string): DailyLog {
  return { date, breakfast: [], lunch: [], dinner: [], snack: [] };
}

export function readLog(date: string): DailyLog {
  if (typeof window === "undefined") return emptyLog(date);
  try {
    const raw = window.localStorage.getItem(LOG_KEY_PREFIX + date);
    if (!raw) return emptyLog(date);
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.date !== date) return emptyLog(date);
    return {
      date,
      breakfast: Array.isArray(parsed.breakfast) ? parsed.breakfast : [],
      lunch: Array.isArray(parsed.lunch) ? parsed.lunch : [],
      dinner: Array.isArray(parsed.dinner) ? parsed.dinner : [],
      snack: Array.isArray(parsed.snack) ? parsed.snack : [],
    };
  } catch {
    return emptyLog(date);
  }
}

function writeLog(log: DailyLog) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOG_KEY_PREFIX + log.date, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

export function sumLog(log: DailyLog): MacroGoals {
  const all = [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snack];
  return all.reduce(
    (acc, f) => ({
      cal: acc.cal + f.cal,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/**
 * Mifflin–St Jeor TDEE → split:
 *  - protein 2 g/kg
 *  - fat 0.9 g/kg
 *  - carbs fill the remainder
 */
export function suggestGoals(input: {
  bodyweightKg: number;
  heightCm: number;
  ageYears: number;
  sex: "male" | "female";
  activity: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
}): MacroGoals {
  const { bodyweightKg, heightCm, ageYears, sex, activity } = input;
  const bmr =
    10 * bodyweightKg +
    6.25 * heightCm -
    5 * ageYears +
    (sex === "male" ? 5 : -161);
  const tdee = Math.round(bmr * activity);
  const protein = Math.round(bodyweightKg * 2);
  const fat = Math.round(bodyweightKg * 0.9);
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const carbsCal = Math.max(0, tdee - proteinCal - fatCal);
  const carbs = Math.round(carbsCal / 4);
  return { cal: tdee, protein, carbs, fat };
}

export function useMacros(date: string = todayIso()) {
  const [goals, setGoalsState] = useState<MacroGoals>(DEFAULT_GOALS);
  const [log, setLog] = useState<DailyLog>(emptyLog(date));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setGoalsState(readGoals());
    setLog(readLog(date));
    setHydrated(true);

    function onStorage(e: StorageEvent) {
      if (e.key === GOALS_KEY) setGoalsState(readGoals());
      if (e.key === LOG_KEY_PREFIX + date) setLog(readLog(date));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [date]);

  const setGoals = useCallback((g: MacroGoals) => {
    setGoalsState(g);
    writeGoals(g);
  }, []);

  const addFood = useCallback(
    (slot: MealSlot, entry: Omit<LoggedFood, "id" | "loggedAt">) => {
      setLog((prev) => {
        const next: DailyLog = {
          ...prev,
          [slot]: [
            ...prev[slot],
            {
              ...entry,
              id: `f${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
              loggedAt: Date.now(),
            },
          ],
        };
        writeLog(next);
        return next;
      });
    },
    [],
  );

  const removeFood = useCallback((slot: MealSlot, entryId: string) => {
    setLog((prev) => {
      const next: DailyLog = {
        ...prev,
        [slot]: prev[slot].filter((f) => f.id !== entryId),
      };
      writeLog(next);
      return next;
    });
  }, []);

  const clearDay = useCallback(() => {
    setLog((prev) => {
      const next = emptyLog(prev.date);
      writeLog(next);
      return next;
    });
  }, []);

  return {
    hydrated,
    goals,
    setGoals,
    log,
    totals: sumLog(log),
    addFood,
    removeFood,
    clearDay,
  };
}
