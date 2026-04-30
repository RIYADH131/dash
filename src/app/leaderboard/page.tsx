"use client";
import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import SegmentedControl from "@/components/SegmentedControl";
import TierBadge from "@/components/TierBadge";
import { leaderboardFor } from "@/lib/mockData";
import type { Sport } from "@/lib/types";
import { SPORT_ACCENT } from "@/lib/tiers";
import clsx from "clsx";

type League = "casual" | "pro";

export default function LeaderboardPage() {
  const [sport, setSport] = useState<Sport>("bodybuilding");
  const [league, setLeague] = useState<League>("pro");

  const entries = useMemo(() => leaderboardFor(sport), [sport]);
  const [first, second, third, ...rest] = entries;

  return (
    <div className="flex flex-col gap-5 pt-5 pb-12">
      <header className="space-y-2">
        <h1 className="font-display font-bold text-headline-lg text-ink">
          Leaderboard
        </h1>
        <p className="text-ink-muted text-sm">
          Verified performance only. Video proof required for top 50.
        </p>
      </header>

      <SegmentedControl<Sport>
        items={[
          { value: "bodybuilding", label: "Strength" },
          { value: "swimming", label: "Swim" },
          { value: "running", label: "Run" },
        ]}
        value={sport}
        onChange={setSport}
      />

      <div className="flex gap-2">
        {(["casual", "pro"] as const).map((v) => {
          const active = league === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setLeague(v)}
              className={clsx(
                "flex-1 py-2 rounded-full font-display font-semibold uppercase tracking-widest text-[11px] transition-all duration-200 active:scale-[0.97] border",
                active
                  ? "bg-electric/10 text-electric border-electric/30"
                  : "bg-surface text-ink-muted border-white/10",
              )}
            >
              {v}
            </button>
          );
        })}
      </div>

      {/* PODIUM */}
      <div className="flex flex-col gap-3">
        {first && <PodiumRow entry={first} accentBorder={6} highlight />}
        {second && <PodiumRow entry={second} accentBorder={4} />}
        {third && <PodiumRow entry={third} accentBorder={4} />}
      </div>

      {/* REST OF LEADERBOARD */}
      {rest.length > 0 && (
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl divide-y divide-white/5 overflow-hidden">
          {rest.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center gap-3 px-4 py-3 animate-slide-in-right"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="w-7 text-ink-muted font-mono text-sm text-right">
                {e.rank}
              </span>
              <Avatar initials={e.avatar} size={36} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-ink truncate">
                  {e.name}
                </p>
                <p className="text-xs text-ink-muted truncate">{e.username}</p>
              </div>
              <span className="font-mono text-sm text-ink whitespace-nowrap">
                {e.value}
              </span>
              <TierBadge tier={e.tier} />
              <Icon
                name="play_circle"
                filled={e.verified}
                className={clsx(
                  e.verified ? "text-electric" : "text-ink-muted/60",
                )}
                size={22}
              />
            </div>
          ))}
        </div>
      )}

      {/* FLOATING FILTER */}
      <button
        type="button"
        className="fixed bottom-24 right-5 z-40 bg-surface border border-white/10 rounded-full px-4 py-2.5 flex items-center gap-2 shadow-2xl active:scale-[0.97] transition-all duration-200"
      >
        <Icon name="tune" size={18} className="text-electric" />
        <span className="font-display font-semibold uppercase tracking-widest text-[11px]">
          Filter
        </span>
      </button>
    </div>
  );
}

function PodiumRow({
  entry,
  accentBorder,
  highlight,
}: {
  entry: ReturnType<typeof leaderboardFor>[number];
  accentBorder: number;
  highlight?: boolean;
}) {
  const accent = SPORT_ACCENT[entry.sport];
  return (
    <div
      className={clsx(
        "bg-surface rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 p-4",
        highlight && "ring-1 ring-electric/30",
      )}
      style={{
        borderLeftWidth: accentBorder,
        borderLeftColor: highlight ? "#007BFF" : accent.hex,
      }}
    >
      <span
        className={clsx(
          "w-9 h-9 rounded-full grid place-items-center font-display font-extrabold",
          highlight
            ? "bg-electric text-white text-sm"
            : "bg-white/10 text-ink text-sm",
        )}
      >
        {entry.rank}
      </span>
      <Avatar initials={entry.avatar} size={44} />
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm text-ink truncate">
          {entry.name}
        </p>
        <p className="font-mono text-xs text-ink-muted truncate">
          {entry.value}
        </p>
      </div>
      <TierBadge tier={entry.tier} size="md" />
    </div>
  );
}
