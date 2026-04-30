import Card from "./Card";
import ProgressBar from "./ProgressBar";

interface Props {
  label: string;
  value: string | number;
  /** 0..1 — drives the progress bar at the bottom */
  progress?: number;
  /** small subline below the metric, e.g. "of 2 800 kcal" */
  hint?: string;
  /** optional overall card accent color — defaults to electric */
  fillClassName?: string;
}

export default function MetricCard({
  label,
  value,
  progress,
  hint,
  fillClassName,
}: Props) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="font-body text-[12px] uppercase font-medium tracking-widest text-ink-muted">
        {label}
      </p>
      <p className="font-display text-electric text-3xl font-extrabold tracking-tight leading-none">
        {value}
      </p>
      {hint && (
        <p className="font-body text-xs text-ink-muted -mt-1">{hint}</p>
      )}
      {progress != null && (
        <ProgressBar value={progress} fillClassName={fillClassName} />
      )}
    </Card>
  );
}
