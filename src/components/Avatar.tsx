import clsx from "clsx";

interface Props {
  initials: string;
  size?: number;
  className?: string;
  /** optional sport accent ring */
  ringClass?: string;
}

export default function Avatar({
  initials,
  size = 40,
  className,
  ringClass,
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-full bg-electric/15 grid place-items-center font-display font-extrabold text-electric uppercase tracking-tight",
        ringClass && `ring-2 ${ringClass}`,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials.slice(0, 2)}
    </div>
  );
}
