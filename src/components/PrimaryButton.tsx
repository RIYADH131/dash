import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
}

export default function PrimaryButton({
  children,
  className,
  variant = "primary",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "w-full py-4 rounded-xl font-display font-extrabold uppercase tracking-widest text-white text-sm active:scale-[0.98] transition-all duration-200",
        variant === "primary" && "bg-electric shadow-cta",
        variant === "ghost" && "bg-surface border border-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
