import clsx from "clsx";
import type { Tier } from "@/lib/types";

interface Props {
  tier: Tier;
  size?: number;
  className?: string;
}

/**
 * Bespoke rank emblems — each tier gets a distinct hex-shield silhouette
 * with tier-specific iconography and a metallic gradient finish. No glows
 * (keeps the "no shadow on bars" / flat surface design language).
 */
export default function TierEmblem({ tier, size = 56, className }: Props) {
  const id = `tier-${tier.toLowerCase()}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={clsx("shrink-0", className)}
      role="img"
      aria-label={`${tier} rank emblem`}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          {GRADIENTS[tier].map((stop, i) => (
            <stop key={i} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* hex shield silhouette (shared across all tiers for visual consistency) */}
      <path
        d="M32 3 L57 16.5 L57 47.5 L32 61 L7 47.5 L7 16.5 Z"
        fill={`url(#${id}-fill)`}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      {/* top highlight */}
      <path
        d="M32 3 L57 16.5 L57 28 L32 14 L7 28 L7 16.5 Z"
        fill={`url(#${id}-shine)`}
      />
      {/* tier-specific glyph */}
      <g
        fill="none"
        stroke={GLYPH_COLOR[tier]}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[tier]}
      </g>
    </svg>
  );
}

const GLYPH_COLOR: Record<Tier, string> = {
  Bronze: "#fef3c7",
  Silver: "#f1f5f9",
  Gold: "#fef3c7",
  Platinum: "#ecfeff",
  Diamond: "#f5d0fe",
  Titan: "#dbeafe",
  Champion: "#fee2e2",
};

const GRADIENTS: Record<Tier, { offset: string; color: string }[]> = {
  Bronze: [
    { offset: "0%", color: "#d97706" },
    { offset: "55%", color: "#b45309" },
    { offset: "100%", color: "#7c2d12" },
  ],
  Silver: [
    { offset: "0%", color: "#cbd5e1" },
    { offset: "55%", color: "#94a3b8" },
    { offset: "100%", color: "#475569" },
  ],
  Gold: [
    { offset: "0%", color: "#fde047" },
    { offset: "55%", color: "#eab308" },
    { offset: "100%", color: "#854d0e" },
  ],
  Platinum: [
    { offset: "0%", color: "#a7f3d0" },
    { offset: "55%", color: "#2dd4bf" },
    { offset: "100%", color: "#115e59" },
  ],
  Diamond: [
    { offset: "0%", color: "#e9d5ff" },
    { offset: "55%", color: "#c084fc" },
    { offset: "100%", color: "#6b21a8" },
  ],
  Titan: [
    { offset: "0%", color: "#bfdbfe" },
    { offset: "55%", color: "#3b82f6" },
    { offset: "100%", color: "#1e3a8a" },
  ],
  Champion: [
    { offset: "0%", color: "#fecaca" },
    { offset: "55%", color: "#ef4444" },
    { offset: "100%", color: "#7f1d1d" },
  ],
};

/** Per-tier glyph drawn inside the shield. Coordinates assume 64x64 viewBox. */
const GLYPHS: Record<Tier, JSX.Element> = {
  // Bronze: single upward chevron
  Bronze: (
    <>
      <path d="M22 38 L32 28 L42 38" />
      <path d="M22 46 L32 36 L42 46" strokeOpacity="0.45" />
    </>
  ),
  // Silver: double chevron
  Silver: (
    <>
      <path d="M22 32 L32 22 L42 32" />
      <path d="M22 42 L32 32 L42 42" />
    </>
  ),
  // Gold: 5-point star
  Gold: (
    <path
      fill={GLYPH_COLOR.Gold}
      stroke="none"
      d="M32 18 L35.4 27.5 L45.5 27.8 L37.4 33.8 L40.4 43.5 L32 37.8 L23.6 43.5 L26.6 33.8 L18.5 27.8 L28.6 27.5 Z"
    />
  ),
  // Platinum: crown silhouette with 3 peaks
  Platinum: (
    <>
      <path d="M18 42 L22 26 L28 36 L32 22 L36 36 L42 26 L46 42 Z" fill={GLYPH_COLOR.Platinum} stroke="none" />
      <path d="M18 46 L46 46" stroke={GLYPH_COLOR.Platinum} strokeWidth="2.5" />
    </>
  ),
  // Diamond: faceted gem
  Diamond: (
    <>
      <path
        d="M32 18 L46 30 L32 46 L18 30 Z"
        fill={GLYPH_COLOR.Diamond}
        fillOpacity="0.95"
        stroke="none"
      />
      <path d="M18 30 L46 30" stroke="#a855f7" strokeWidth="1.5" />
      <path d="M32 18 L32 46" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.55" />
      <path d="M25 24 L39 24" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.55" />
    </>
  ),
  // Titan: lightning bolt
  Titan: (
    <path
      d="M34 18 L22 36 L31 36 L28 46 L42 28 L33 28 Z"
      fill={GLYPH_COLOR.Titan}
      stroke="none"
    />
  ),
  // Champion: laurel-wrapped trophy cup
  Champion: (
    <>
      {/* cup */}
      <path
        d="M24 22 L40 22 L38 36 Q32 42 26 36 Z"
        fill={GLYPH_COLOR.Champion}
        stroke="none"
      />
      {/* handles */}
      <path d="M24 24 Q19 26 21 32 Q24 34 26 32" />
      <path d="M40 24 Q45 26 43 32 Q40 34 38 32" />
      {/* base */}
      <path d="M28 42 L36 42" strokeWidth="3" />
      <path d="M26 46 L38 46" strokeWidth="3" />
    </>
  ),
};
