import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** typically `mono` for numeric fields, omit for text */
  fontVariant?: "mono" | "default";
  trailing?: ReactNode;
  className?: string;
}

export default function InputField({
  label,
  hint,
  fontVariant = "default",
  trailing,
  className,
  id,
  ...rest
}: Props) {
  const inputId = id ?? `f-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label htmlFor={inputId} className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-[12px] font-medium text-ink-muted uppercase tracking-widest">
          {label}
        </span>
      )}
      <span className="relative flex items-center">
        <input
          id={inputId}
          {...rest}
          className={clsx(
            "w-full bg-navy border-2 border-transparent focus:border-electric rounded-xl py-3 px-4 text-white outline-none transition-all duration-200",
            fontVariant === "mono" && "font-mono text-lg tracking-wide",
            "placeholder:text-ink-muted/60",
          )}
        />
        {trailing && (
          <span className="absolute right-4 text-ink-muted text-sm font-medium">
            {trailing}
          </span>
        )}
      </span>
      {hint && <span className="text-[11px] text-ink-muted">{hint}</span>}
    </label>
  );
}
