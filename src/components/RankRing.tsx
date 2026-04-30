import clsx from "clsx";
import type { Tier } from "@/lib/types";
import Icon from "./Icon";
import { TIER_ICON } from "@/lib/tiers";

interface Props {
  tier: Tier;
  /** progress around the circle 0..1 */
  progress: number;
  size?: number;
  className?: string;
}

const TIER_STROKE: Record<Tier, string> = {
  Bronze: "#fb923c",
  Silver: "#cbd5e1",
  Gold: "#facc15",
  Platinum: "#5eead4",
  Diamond: "#c084fc",
  Titan: "#60a5fa",
  Champion: "#f87171",
};

export default function RankRing({
  tier,
  progress,
  size = 80,
  className,
}: Props) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, progress));
  const color = TIER_STROKE[tier];
  return (
    <div
      className={clsx("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
      aria-label={`${tier} rank, ${Math.round(progress * 100)}% to next tier`}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 600ms ease-out" }}
        />
      </svg>
      <div
        className="rounded-full bg-navy border border-white/10 grid place-items-center"
        style={{
          width: size - stroke * 3,
          height: size - stroke * 3,
          color,
        }}
      >
        <Icon name={TIER_ICON[tier]} filled size={Math.round(size * 0.42)} />
      </div>
    </div>
  );
}
