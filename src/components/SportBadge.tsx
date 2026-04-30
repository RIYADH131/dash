import clsx from "clsx";
import type { Sport } from "@/lib/types";
import { SPORT_ACCENT, SPORT_LABEL } from "@/lib/tiers";

interface Props {
  sport: Sport;
  className?: string;
  showLabel?: boolean;
}

export default function SportBadge({ sport, className, showLabel = true }: Props) {
  const accent = SPORT_ACCENT[sport];
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
        accent.bg,
        accent.text,
        sport === "bodybuilding" ? "border-white/10" : accent.border,
        className,
      )}
    >
      {showLabel ? SPORT_LABEL[sport] : ""}
    </span>
  );
}
