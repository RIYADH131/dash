"use client";
import clsx from "clsx";

interface Item<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  items: Item<T>[];
  value: T;
  onChange: (next: T) => void;
  size?: "md" | "sm";
  className?: string;
}

export default function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  size = "md",
  className,
}: Props<T>) {
  return (
    <div
      className={clsx(
        "bg-surface rounded-xl p-1 inline-flex w-full border border-white/10",
        className,
      )}
      role="tablist"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={clsx(
              "flex-1 rounded-lg font-display font-semibold uppercase tracking-wider transition-all duration-200 active:scale-[0.97]",
              size === "md" && "py-2.5 text-xs",
              size === "sm" && "py-1.5 text-[11px]",
              active
                ? "bg-electric text-white shadow-cta"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
