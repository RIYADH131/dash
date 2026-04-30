import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function SectionTitle({ children, action, className }: Props) {
  return (
    <div className={clsx("flex items-end justify-between gap-3", className)}>
      <h2 className="font-display font-bold text-xl text-ink leading-none tracking-tight">
        {children}
      </h2>
      {action}
    </div>
  );
}
