"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import SectionTitle from "@/components/SectionTitle";
import {
  FOOD_CATEGORIES,
  FOOD_LIBRARY,
  type FoodCategory,
  type FoodItem,
  scaleFood,
} from "@/lib/foodLibrary";
import {
  MEAL_LABEL,
  MEAL_SLOTS,
  type MealSlot,
  suggestGoals,
  todayIso,
  useMacros,
} from "@/lib/macros";

type View =
  | { kind: "today" }
  | { kind: "edit-goals" }
  | { kind: "suggest" }
  | { kind: "picker"; slot: MealSlot }
  | { kind: "scale"; slot: MealSlot; food: FoodItem }
  | { kind: "custom"; slot: MealSlot };

export default function MacrosPage() {
  const today = todayIso();
  const { hydrated, goals, setGoals, log, totals, addFood, removeFood } =
    useMacros(today);
  const [view, setView] = useState<View>({ kind: "today" });

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-4 pt-6 pb-16">
        <Card padding="content" className="text-center text-ink-muted">
          Loading…
        </Card>
      </div>
    );
  }

  if (view.kind === "edit-goals") {
    return (
      <EditGoalsView
        initial={goals}
        onCancel={() => setView({ kind: "today" })}
        onSave={(g) => {
          setGoals(g);
          setView({ kind: "today" });
        }}
        onSuggest={() => setView({ kind: "suggest" })}
      />
    );
  }

  if (view.kind === "suggest") {
    return (
      <SuggestView
        onCancel={() => setView({ kind: "edit-goals" })}
        onApply={(g) => {
          setGoals(g);
          setView({ kind: "today" });
        }}
      />
    );
  }

  if (view.kind === "picker") {
    return (
      <PickerView
        slot={view.slot}
        onBack={() => setView({ kind: "today" })}
        onPick={(food) => setView({ kind: "scale", slot: view.slot, food })}
        onCustom={() => setView({ kind: "custom", slot: view.slot })}
      />
    );
  }

  if (view.kind === "scale") {
    return (
      <ScaleView
        slot={view.slot}
        food={view.food}
        onBack={() => setView({ kind: "picker", slot: view.slot })}
        onAdd={(grams) => {
          const m = scaleFood(view.food, grams);
          addFood(view.slot, {
            foodId: view.food.id,
            name: view.food.name,
            grams,
            cal: m.cal,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fat,
          });
          setView({ kind: "today" });
        }}
      />
    );
  }

  if (view.kind === "custom") {
    return (
      <CustomFoodView
        slot={view.slot}
        onBack={() => setView({ kind: "picker", slot: view.slot })}
        onAdd={(entry) => {
          addFood(view.slot, { ...entry, foodId: null });
          setView({ kind: "today" });
        }}
      />
    );
  }

  // Default: today view
  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      {/* Header */}
      <header className="flex items-end justify-between gap-3 animate-fade-up">
        <div>
          <p className="text-ink-muted text-[10px] uppercase tracking-widest font-semibold">
            Today · {humanDate(today)}
          </p>
          <h1 className="font-display font-bold text-headline-lg text-ink leading-tight tracking-tight mt-0.5">
            Macros
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setView({ kind: "edit-goals" })}
          className="text-electric text-xs font-display font-semibold uppercase tracking-widest active:scale-95 transition-all duration-200"
        >
          Edit goals
        </button>
      </header>

      {/* Daily progress */}
      <Card padding="content" className="flex flex-col gap-4 animate-fade-up">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
              Calories
            </p>
            <p className="font-mono text-display-xl text-electric leading-none tracking-tight mt-1">
              {Math.round(totals.cal)}
              <span className="text-ink-muted text-base font-mono ml-2">
                / {goals.cal}
              </span>
            </p>
          </div>
          <RemainingPill
            label={totals.cal > goals.cal ? "Over" : "Remaining"}
            value={`${Math.round(Math.abs(goals.cal - totals.cal))} cal`}
            over={totals.cal > goals.cal}
          />
        </div>
        <ProgressBar
          value={goals.cal === 0 ? 0 : totals.cal / goals.cal}
          size="md"
          fillClassName={
            totals.cal > goals.cal ? "bg-amber-accent" : "bg-electric"
          }
        />
        <div className="grid grid-cols-3 gap-3 pt-1">
          <MacroBar
            label="Protein"
            value={totals.protein}
            goal={goals.protein}
            unit="g"
            color="bg-electric"
          />
          <MacroBar
            label="Carbs"
            value={totals.carbs}
            goal={goals.carbs}
            unit="g"
            color="bg-teal-accent"
          />
          <MacroBar
            label="Fat"
            value={totals.fat}
            goal={goals.fat}
            unit="g"
            color="bg-amber-accent"
          />
        </div>
      </Card>

      {/* Meal slots */}
      <section className="flex flex-col gap-4">
        <SectionTitle>Meals</SectionTitle>
        <div className="flex flex-col gap-3">
          {MEAL_SLOTS.map((slot) => {
            const items = log[slot];
            const slotTotals = items.reduce(
              (a, f) => ({
                cal: a.cal + f.cal,
                protein: a.protein + f.protein,
              }),
              { cal: 0, protein: 0 },
            );
            return (
              <Card
                key={slot}
                padding="list"
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={SLOT_ICON[slot]}
                      size={20}
                      className="text-electric"
                    />
                    <h3 className="font-display font-bold text-sm text-ink">
                      {MEAL_LABEL[slot]}
                    </h3>
                    {items.length > 0 && (
                      <span className="font-mono text-[11px] text-ink-muted">
                        {Math.round(slotTotals.cal)} cal ·{" "}
                        {Math.round(slotTotals.protein)} g P
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setView({ kind: "picker", slot })}
                    aria-label={`Add food to ${MEAL_LABEL[slot]}`}
                    className="w-8 h-8 rounded-lg grid place-items-center text-electric bg-electric/10 active:scale-90 transition-all duration-200"
                  >
                    <Icon name="add" size={20} />
                  </button>
                </div>
                {items.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setView({ kind: "picker", slot })}
                    className="text-left text-xs text-ink-muted py-2 px-1 active:scale-[0.99] transition-all duration-200"
                  >
                    Tap <span className="text-electric">+</span> to add a food
                  </button>
                ) : (
                  <ul className="flex flex-col">
                    {items.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center gap-3 py-1.5 border-t border-white/5 first:border-t-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink truncate">{f.name}</p>
                          <p className="text-[11px] text-ink-muted font-mono">
                            {Math.round(f.grams)} g · {Math.round(f.cal)} cal ·{" "}
                            {Math.round(f.protein)}P /{" "}
                            {Math.round(f.carbs)}C /{" "}
                            {Math.round(f.fat)}F
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${f.name}`}
                          onClick={() => removeFood(slot, f.id)}
                          className="w-7 h-7 rounded-lg grid place-items-center text-ink-muted hover:text-ink active:scale-90 transition-all duration-200 shrink-0"
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const SLOT_ICON: Record<MealSlot, string> = {
  breakfast: "free_breakfast",
  lunch: "lunch_dining",
  dinner: "dinner_dining",
  snack: "cookie",
};

function humanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function RemainingPill({
  label,
  value,
  over,
}: {
  label: string;
  value: string;
  over: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl px-3 py-2 border text-right",
        over
          ? "bg-amber-accent/10 border-amber-accent/30"
          : "bg-navy border-white/5",
      )}
    >
      <p
        className={clsx(
          "text-[9px] uppercase tracking-widest font-semibold",
          over ? "text-amber-accent" : "text-ink-muted",
        )}
      >
        {over ? "Over" : label}
      </p>
      <p
        className={clsx(
          "font-mono text-sm mt-0.5",
          over ? "text-amber-accent" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MacroBar({
  label,
  value,
  goal,
  unit,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const over = value > goal;
  return (
    <div className="bg-navy rounded-xl border border-white/5 px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-widest text-ink-muted font-semibold">
        {label}
      </p>
      <p className="font-mono text-sm text-ink mt-0.5">
        {Math.round(value)}
        <span className="text-ink-muted">
          /{goal}
          {unit}
        </span>
      </p>
      <ProgressBar
        value={goal === 0 ? 0 : value / goal}
        size="sm"
        className="mt-2"
        fillClassName={over ? "bg-amber-accent" : color}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Edit goals
 * ────────────────────────────────────────────────────────────────────── */

function EditGoalsView({
  initial,
  onCancel,
  onSave,
  onSuggest,
}: {
  initial: { cal: number; protein: number; carbs: number; fat: number };
  onCancel: () => void;
  onSave: (g: {
    cal: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onSuggest: () => void;
}) {
  const [cal, setCal] = useState(String(initial.cal));
  const [protein, setProtein] = useState(String(initial.protein));
  const [carbs, setCarbs] = useState(String(initial.carbs));
  const [fat, setFat] = useState(String(initial.fat));

  const macroCal =
    (Number(protein) || 0) * 4 +
    (Number(carbs) || 0) * 4 +
    (Number(fat) || 0) * 9;
  const calNum = Number(cal) || 0;
  const mismatch = Math.abs(macroCal - calNum) > 50 && calNum > 0;

  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      <header className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Back"
          className="w-9 h-9 rounded-xl grid place-items-center bg-surface border border-white/10 active:scale-95 transition-all duration-200"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <h1 className="font-display font-bold text-2xl text-ink leading-none tracking-tight">
          Daily goals
        </h1>
      </header>

      <Card padding="content" className="flex flex-col gap-4">
        <InputField
          label="Calories"
          type="number"
          inputMode="numeric"
          fontVariant="mono"
          trailing="kcal"
          value={cal}
          onChange={(e) => setCal(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Protein"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="g"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <InputField
            label="Carbs"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="g"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <InputField
            label="Fat"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="g"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-muted">
            From macros:{" "}
            <span className="font-mono text-ink">
              {Math.round(macroCal)} kcal
            </span>
          </span>
          {mismatch && (
            <span className="text-amber-accent text-[11px]">
              Δ {Math.round(macroCal - calNum)} kcal
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onSuggest}
          className="text-electric text-xs font-display font-semibold uppercase tracking-widest text-left active:scale-95 transition-all duration-200"
        >
          Suggest from bodyweight →
        </button>
        <PrimaryButton
          onClick={() =>
            onSave({
              cal: Number(cal) || 0,
              protein: Number(protein) || 0,
              carbs: Number(carbs) || 0,
              fat: Number(fat) || 0,
            })
          }
        >
          Save goals
        </PrimaryButton>
      </Card>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Suggest goals (Mifflin-St Jeor)
 * ────────────────────────────────────────────────────────────────────── */

function SuggestView({
  onCancel,
  onApply,
}: {
  onCancel: () => void;
  onApply: (g: {
    cal: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}) {
  const [bw, setBw] = useState("80");
  const [height, setHeight] = useState("175");
  const [age, setAge] = useState("28");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<1.2 | 1.375 | 1.55 | 1.725 | 1.9>(
    1.55,
  );

  const bwn = Number(bw) || 0;
  const hn = Number(height) || 0;
  const an = Number(age) || 0;

  const result = useMemo(() => {
    if (bwn <= 0 || hn <= 0 || an <= 0) return null;
    return suggestGoals({
      bodyweightKg: bwn,
      heightCm: hn,
      ageYears: an,
      sex,
      activity,
    });
  }, [bwn, hn, an, sex, activity]);

  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      <header className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Back"
          className="w-9 h-9 rounded-xl grid place-items-center bg-surface border border-white/10 active:scale-95 transition-all duration-200"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <h1 className="font-display font-bold text-2xl text-ink leading-none tracking-tight">
          Suggest goals
        </h1>
      </header>

      <Card padding="content" className="flex flex-col gap-4">
        <p className="text-ink-muted text-xs leading-relaxed">
          Mifflin–St Jeor TDEE with protein at 2 g/kg, fat at 0.9 g/kg, carbs
          filling the remainder.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSex("male")}
            className={clsx(
              "rounded-xl py-3 font-display font-semibold uppercase tracking-widest text-xs active:scale-95 transition-all duration-200",
              sex === "male"
                ? "bg-electric text-white shadow-cta"
                : "bg-navy border border-white/10 text-ink-muted",
            )}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setSex("female")}
            className={clsx(
              "rounded-xl py-3 font-display font-semibold uppercase tracking-widest text-xs active:scale-95 transition-all duration-200",
              sex === "female"
                ? "bg-electric text-white shadow-cta"
                : "bg-navy border border-white/10 text-ink-muted",
            )}
          >
            Female
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Weight"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="kg"
            value={bw}
            onChange={(e) => setBw(e.target.value)}
          />
          <InputField
            label="Height"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <InputField
            label="Age"
            type="number"
            inputMode="numeric"
            fontVariant="mono"
            trailing="yr"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <p className="text-[12px] font-medium text-ink-muted uppercase tracking-widest mb-2">
            Activity
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { v: 1.2 as const, label: "Sed" },
              { v: 1.375 as const, label: "Light" },
              { v: 1.55 as const, label: "Mod" },
              { v: 1.725 as const, label: "Hard" },
              { v: 1.9 as const, label: "Pro" },
            ].map((a) => (
              <button
                key={a.v}
                type="button"
                onClick={() => setActivity(a.v)}
                className={clsx(
                  "py-2 rounded-lg text-[10px] font-display font-semibold uppercase tracking-wider active:scale-95 transition-all duration-200",
                  activity === a.v
                    ? "bg-electric text-white"
                    : "bg-navy border border-white/10 text-ink-muted",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-navy rounded-xl border border-white/5 p-4 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-ink-muted font-semibold">
              Suggested
            </p>
            <p className="font-mono text-2xl text-electric leading-none">
              {result.cal} <span className="text-base text-ink-muted">kcal</span>
            </p>
            <p className="font-mono text-xs text-ink-muted">
              {result.protein}P · {result.carbs}C · {result.fat}F
            </p>
          </div>
        )}

        <PrimaryButton
          onClick={() => result && onApply(result)}
          disabled={!result}
          className={clsx(!result && "opacity-50")}
        >
          Apply suggestion
        </PrimaryButton>
      </Card>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Food picker
 * ────────────────────────────────────────────────────────────────────── */

function PickerView({
  slot,
  onBack,
  onPick,
  onCustom,
}: {
  slot: MealSlot;
  onBack: () => void;
  onPick: (food: FoodItem) => void;
  onCustom: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<FoodCategory | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOOD_LIBRARY.filter((f) => {
      if (activeCat && f.category !== activeCat) return false;
      if (q && !f.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeCat]);

  return (
    <div className="flex flex-col gap-4 pt-6 pb-16">
      <header className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-xl grid place-items-center bg-surface border border-white/10 active:scale-95 transition-all duration-200"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <div className="flex-1">
          <p className="text-ink-muted text-[10px] uppercase tracking-widest font-semibold">
            Add to {MEAL_LABEL[slot]}
          </p>
          <h1 className="font-display font-bold text-xl text-ink leading-none tracking-tight mt-0.5">
            Food library
          </h1>
        </div>
        <button
          type="button"
          onClick={onCustom}
          className="text-electric text-xs font-display font-semibold uppercase tracking-widest active:scale-95 transition-all duration-200"
        >
          Custom
        </button>
      </header>

      <div className="relative">
        <Icon
          name="search"
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          placeholder={`Search ${FOOD_LIBRARY.length} foods…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-surface border-2 border-transparent focus:border-electric rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-all duration-200 placeholder:text-ink-muted/60"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        <button
          type="button"
          onClick={() => setActiveCat(null)}
          className={clsx(
            "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-display font-semibold uppercase tracking-widest border transition-all duration-200 active:scale-95",
            activeCat === null
              ? "bg-electric text-white border-electric"
              : "bg-surface text-ink-muted border-white/10",
          )}
        >
          All
        </button>
        {FOOD_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCat(c)}
            className={clsx(
              "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-display font-semibold uppercase tracking-widest border transition-all duration-200 active:scale-95",
              activeCat === c
                ? "bg-electric text-white border-electric"
                : "bg-surface text-ink-muted border-white/10",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <Card padding="content" className="text-center text-ink-muted text-xs">
          No matches.
        </Card>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {results.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => onPick(f)}
                className="w-full text-left bg-surface border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 active:scale-[0.99] transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm text-ink truncate">
                    {f.name}
                  </p>
                  <p className="text-[11px] text-ink-muted font-mono">
                    {Math.round(f.cal)} cal · {f.protein}P / {f.carbs}C /{" "}
                    {f.fat}F per 100 g
                  </p>
                </div>
                <Icon
                  name="chevron_right"
                  size={18}
                  className="text-ink-muted shrink-0"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Scale + add
 * ────────────────────────────────────────────────────────────────────── */

function ScaleView({
  slot,
  food,
  onBack,
  onAdd,
}: {
  slot: MealSlot;
  food: FoodItem;
  onBack: () => void;
  onAdd: (grams: number) => void;
}) {
  const [grams, setGrams] = useState(String(food.defaultGrams ?? 100));
  const g = Number(grams) || 0;
  const scaled = scaleFood(food, g);

  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      <header className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-xl grid place-items-center bg-surface border border-white/10 active:scale-95 transition-all duration-200"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-ink-muted text-[10px] uppercase tracking-widest font-semibold">
            {MEAL_LABEL[slot]}
          </p>
          <h1 className="font-display font-bold text-xl text-ink leading-tight tracking-tight mt-0.5 truncate">
            {food.name}
          </h1>
        </div>
      </header>

      <Card padding="content" className="flex flex-col gap-4">
        <InputField
          label="Portion"
          type="number"
          inputMode="decimal"
          fontVariant="mono"
          trailing="g"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {[50, 100, 150, 200, 250].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setGrams(String(preset))}
              className="bg-navy border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-display font-semibold uppercase tracking-widest text-ink-muted active:scale-95 transition-all duration-200"
            >
              {preset} g
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 pt-1">
          <ScalePill label="Cal" value={scaled.cal} unit="" />
          <ScalePill label="P" value={scaled.protein} unit="g" />
          <ScalePill label="C" value={scaled.carbs} unit="g" />
          <ScalePill label="F" value={scaled.fat} unit="g" />
        </div>
        <PrimaryButton
          onClick={() => g > 0 && onAdd(g)}
          disabled={g <= 0}
          className={clsx(g <= 0 && "opacity-50")}
        >
          Add to {MEAL_LABEL[slot]}
        </PrimaryButton>
      </Card>
    </div>
  );
}

function ScalePill({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="bg-navy rounded-xl border border-white/5 px-3 py-2.5 text-center">
      <p className="text-[9px] uppercase tracking-widest text-ink-muted font-semibold">
        {label}
      </p>
      <p className="font-mono text-base text-ink mt-0.5">
        {Math.round(value)}
        <span className="text-ink-muted text-xs">{unit}</span>
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Custom food
 * ────────────────────────────────────────────────────────────────────── */

function CustomFoodView({
  slot,
  onBack,
  onAdd,
}: {
  slot: MealSlot;
  onBack: () => void;
  onAdd: (entry: {
    name: string;
    grams: number;
    cal: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("100");
  const [cal, setCal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const valid = name.trim().length > 0 && (Number(grams) || 0) > 0;

  return (
    <div className="flex flex-col gap-6 pt-6 pb-16">
      <header className="flex items-center gap-3 animate-fade-up">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-xl grid place-items-center bg-surface border border-white/10 active:scale-95 transition-all duration-200"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <div>
          <p className="text-ink-muted text-[10px] uppercase tracking-widest font-semibold">
            {MEAL_LABEL[slot]}
          </p>
          <h1 className="font-display font-bold text-xl text-ink leading-none tracking-tight mt-0.5">
            Custom food
          </h1>
        </div>
      </header>

      <Card padding="content" className="flex flex-col gap-4">
        <InputField
          label="Name"
          type="text"
          placeholder="e.g. Mom's chicken curry"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          label="Portion"
          type="number"
          inputMode="decimal"
          fontVariant="mono"
          trailing="g"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <p className="text-[11px] text-ink-muted -mt-2">
          Macros for the whole portion (not per 100 g):
        </p>
        <InputField
          label="Calories"
          type="number"
          inputMode="numeric"
          fontVariant="mono"
          trailing="kcal"
          value={cal}
          onChange={(e) => setCal(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Protein"
            type="number"
            inputMode="decimal"
            fontVariant="mono"
            trailing="g"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <InputField
            label="Carbs"
            type="number"
            inputMode="decimal"
            fontVariant="mono"
            trailing="g"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <InputField
            label="Fat"
            type="number"
            inputMode="decimal"
            fontVariant="mono"
            trailing="g"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>
        <PrimaryButton
          onClick={() =>
            valid &&
            onAdd({
              name: name.trim(),
              grams: Number(grams) || 0,
              cal: Number(cal) || 0,
              protein: Number(protein) || 0,
              carbs: Number(carbs) || 0,
              fat: Number(fat) || 0,
            })
          }
          disabled={!valid}
          className={clsx(!valid && "opacity-50")}
        >
          Add to {MEAL_LABEL[slot]}
        </PrimaryButton>
      </Card>
    </div>
  );
}
