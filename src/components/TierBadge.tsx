import clsx from "clsx";
import type { Tier } from "@/lib/types";
import { TIER_CLASS } from "@/lib/tiers";

interface Props {
  tier: Tier;
  className?: string;
  size?: "sm" | "md";
}

export default function TierBadge({ tier, className, size = "sm" }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-black uppercase tracking-widest border border-white/5",
        TIER_CLASS[tier],
        size === "sm" && "text-[10px] px-2.5 py-1",
        size === "md" && "text-xs px-3 py-1.5",
        className,
      )}
    >
      {tier}
    </span>
  );
}
