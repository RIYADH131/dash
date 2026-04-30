"use client";
import { useMemo } from "react";
import Avatar from "@/components/Avatar";
import Countdown from "@/components/Countdown";
import Icon from "@/components/Icon";
import PrimaryButton from "@/components/PrimaryButton";
import ProgressBar from "@/components/ProgressBar";
import SectionTitle from "@/components/SectionTitle";
import TierBadge from "@/components/TierBadge";
import { LIVE_CHALLENGE } from "@/lib/mockData";
import clsx from "clsx";

export default function ChallengePage() {
  // Computed once on first render so countdown counts down to a stable target.
  const target = useMemo(
    () => Date.now() + LIVE_CHALLENGE.endsAtOffsetMs,
    [],
  );
  const claimedPct =
    LIVE_CHALLENGE.spotsClaimed / LIVE_CHALLENGE.spotsTotal;

  return (
    <div className="flex flex-col gap-5 pt-5 pb-12">
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% 0%, rgba(0,122,255,0.35) 0%, rgba(0,18,38,0.95) 60%, #001226 100%)",
        }}
      >
        <div className="relative p-6 pt-7 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-electric animate-pulse-dot shadow-cta" />
            <span className="font-display font-extrabold uppercase tracking-widest text-[11px] text-electric">
              Live Challenge
            </span>
          </div>
          <h1 className="font-display font-bold text-headline-lg text-ink leading-tight">
            {LIVE_CHALLENGE.title}
          </h1>
          <Countdown target={target} />
          <div className="bg-navy/80 border border-white/10 rounded-full p-1 pl-4 pr-1 flex items-center gap-3">
            <span className="font-mono text-xs text-ink whitespace-nowrap">
              {LIVE_CHALLENGE.spotsClaimed} / {LIVE_CHALLENGE.spotsTotal} spots
              claimed
            </span>
            <div className="flex-1">
              <ProgressBar value={claimedPct} />
            </div>
            <span className="bg-electric/20 text-electric text-[10px] font-display font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              {Math.round(claimedPct * 100)}%
            </span>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="bg-surface rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium">
              Exercise
            </p>
            <p className="font-display font-bold text-lg text-ink mt-1">
              {LIVE_CHALLENGE.exercise}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium">
              Target
            </p>
            <p className="font-mono text-lg text-electric font-semibold mt-1">
              {LIVE_CHALLENGE.target}
            </p>
          </div>
        </header>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-ink-muted font-medium mb-2">
            Submission Rules
          </p>
          <ul className="space-y-2">
            {LIVE_CHALLENGE.rules.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 text-sm text-ink leading-snug"
              >
                <Icon
                  name="check_circle"
                  filled
                  size={18}
                  className="text-electric mt-0.5"
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <PrimaryButton>
          <span className="inline-flex items-center justify-center gap-2">
            <Icon name="videocam" size={18} className="text-white" />
            Submit Video Proof
          </span>
        </PrimaryButton>
      </section>

      {/* MINI LEADERBOARD */}
      <section className="flex flex-col gap-3">
        <SectionTitle>Live Standings</SectionTitle>
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl divide-y divide-white/5 overflow-hidden">
          {LIVE_CHALLENGE.recentEntries.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center gap-3 px-4 py-3 animate-slide-in-right"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="w-6 text-ink-muted font-mono text-sm text-right">
                {e.rank}
              </span>
              <Avatar initials={e.avatar} size={36} />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm text-ink truncate">
                  {e.name}
                </p>
                <p className="text-xs text-ink-muted truncate">
                  {e.username}
                </p>
              </div>
              <span className="font-mono text-sm text-ink whitespace-nowrap">
                {e.value}
              </span>
              <TierBadge tier={e.tier} />
              <span
                className={clsx(
                  "text-[10px] font-display font-extrabold uppercase tracking-widest px-2 py-1 rounded-full",
                  e.verified
                    ? "bg-electric/10 text-electric border border-electric/30"
                    : "bg-white/5 text-ink-muted border border-white/10",
                )}
              >
                {e.verified ? "Verified" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
