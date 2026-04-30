import clsx from "clsx";

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}

export default function Icon({ name, filled, className, size }: IconProps) {
  return (
    <span
      aria-hidden
      className={clsx("material-symbols-outlined", filled && "filled", className)}
      style={size ? { fontSize: `${size}px` } : undefined}
    >
      {name}
    </span>
  );
}
