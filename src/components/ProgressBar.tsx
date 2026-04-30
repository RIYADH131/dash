import clsx from "clsx";

interface Props {
  /** 0..1 */
  value: number;
  size?: "sm" | "md";
  className?: string;
  /** override fill color (defaults to electric blue) */
  fillClassName?: string;
}

export default function ProgressBar({
  value,
  size = "sm",
  className,
  fillClassName = "bg-electric",
}: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={clsx(
        "w-full bg-white/10 rounded-full overflow-hidden",
        size === "sm" && "h-2",
        size === "md" && "h-3",
        className,
      )}
    >
      <div
        className={clsx("h-full rounded-full transition-all duration-500 ease-out", fillClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
