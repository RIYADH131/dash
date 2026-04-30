import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** padding preset — `content` = p-6, `list` = p-4 */
  padding?: "content" | "list" | "none";
  className?: string;
}

export default function Card({
  children,
  padding = "content",
  className,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={clsx(
        "bg-surface rounded-2xl border border-white/10 shadow-2xl",
        padding === "content" && "p-6",
        padding === "list" && "p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
