"use client";
import { useEffect, useState } from "react";

interface Props {
  /** target time in ms since epoch */
  target: number;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export default function Countdown({ target }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - (now ?? target));
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);

  const Cell = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        key={value}
        className="bg-navy rounded-lg px-3 py-2 font-mono text-2xl font-semibold text-ink min-w-[56px] text-center animate-digit-flip"
      >
        {value}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-ink-muted font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <Cell value={pad(h)} label="Hrs" />
      <span className="text-ink-muted font-mono text-2xl pb-5">:</span>
      <Cell value={pad(m)} label="Min" />
      <span className="text-ink-muted font-mono text-2xl pb-5">:</span>
      <Cell value={pad(s)} label="Sec" />
    </div>
  );
}
