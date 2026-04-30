import Link from "next/link";
import Icon from "./Icon";

export default function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 px-5 bg-navy border-b border-white/10 shadow-topbar"
      style={{ backgroundColor: "#001226" }}
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <Link
          href="/"
          aria-label="DASH home"
          className="font-display font-black italic text-2xl text-electric tracking-tight"
        >
          DASH
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 grid place-items-center rounded-xl text-ink-muted hover:text-ink active:scale-95 transition-all duration-200"
          >
            <Icon name="notifications" />
          </button>
          <Link
            href="/profile"
            aria-label="Profile"
            className="w-10 h-10 grid place-items-center rounded-xl bg-surface text-ink active:scale-95 transition-all duration-200 font-display font-bold text-sm"
          >
            RK
          </Link>
        </div>
      </div>
    </header>
  );
}
