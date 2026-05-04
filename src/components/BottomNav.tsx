"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Icon from "./Icon";

const TABS: {
  href: string;
  icon: string;
  label: string;
}[] = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { href: "/challenge", icon: "bolt", label: "Drops" },
  { href: "/calculator", icon: "calculate", label: "Rank" },
  { href: "/coach", icon: "psychology", label: "Coach" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-surface border-t border-white/5 rounded-t-2xl shadow-bottomnav"
      aria-label="Primary"
    >
      <ul className="max-w-md mx-auto h-full flex items-stretch justify-around px-2 pt-2 pb-3">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "h-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95",
                  active
                    ? "text-electric"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                <span
                  className={clsx(
                    "px-3 py-1.5 rounded-xl flex items-center justify-center transition-colors duration-200",
                    active && "bg-electric/10",
                  )}
                >
                  <Icon name={tab.icon} filled={active} size={24} />
                </span>
                <span className="font-display text-[10px] uppercase font-semibold tracking-wider">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
