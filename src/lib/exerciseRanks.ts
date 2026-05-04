"use client";
import { useCallback, useEffect, useState } from "react";
import type { ExerciseId, Tier } from "./types";
import { TIERS } from "./tiers";

export type SavedExerciseRank = {
  exercise: ExerciseId;
  weightKg: number;
  reps: number;
  bodyweightKg: number;
  oneRepMax: number;
  score: number;
  tier: Tier;
  savedAt: number;
};

const STORAGE_KEY = "dash:exerciseRanks:v1";

function read(): SavedExerciseRank[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is SavedExerciseRank =>
        r &&
        typeof r.exercise === "string" &&
        typeof r.score === "number" &&
        typeof r.tier === "string",
    );
  } catch {
    return [];
  }
}

function write(ranks: SavedExerciseRank[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ranks));
  } catch {
    /* quota / unavailable — ignore */
  }
}

/** Sort by tier (Champion first) then by score desc. */
function sortRanks(ranks: SavedExerciseRank[]): SavedExerciseRank[] {
  return [...ranks].sort((a, b) => {
    const ta = TIERS.indexOf(a.tier);
    const tb = TIERS.indexOf(b.tier);
    if (ta !== tb) return tb - ta;
    return b.score - a.score;
  });
}

export function useExerciseRanks() {
  const [ranks, setRanks] = useState<SavedExerciseRank[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRanks(sortRanks(read()));
    setHydrated(true);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setRanks(sortRanks(read()));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((entry: Omit<SavedExerciseRank, "savedAt">) => {
    setRanks((prev) => {
      const next = sortRanks([
        ...prev.filter((r) => r.exercise !== entry.exercise),
        { ...entry, savedAt: Date.now() },
      ]);
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((exercise: ExerciseId) => {
    setRanks((prev) => {
      const next = prev.filter((r) => r.exercise !== exercise);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRanks([]);
    write([]);
  }, []);

  return { ranks, save, remove, clear, hydrated };
}
