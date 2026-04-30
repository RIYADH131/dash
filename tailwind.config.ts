import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DASH design tokens
        navy: {
          DEFAULT: "#001226",
          950: "#001226",
          900: "#002A54",
        },
        surface: "#002A54",
        electric: {
          DEFAULT: "#007BFF",
          50: "#E6F2FF",
          500: "#007BFF",
        },
        teal: {
          accent: "#2DD4BF",
        },
        amber: {
          accent: "#F59E0B",
        },
        ink: {
          DEFAULT: "#E1E3E4",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        display: ["var(--font-lexend)", "Lexend", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      fontSize: {
        // exact tokens from spec
        "display-xl": [
          "48px",
          { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "1.2", fontWeight: "700" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "label-sm": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "0.1em",
            fontWeight: "500",
          },
        ],
      },
      boxShadow: {
        cta: "0 4px 15px rgba(0,122,255,0.4)",
        topbar: "0 4px 20px rgba(0,0,0,0.4)",
        bottomnav: "0 -10px 30px rgba(0,0,0,0.5)",
        card: "0 25px 50px -12px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        "bubble-bot": "20px 20px 20px 4px",
        "bubble-user": "20px 20px 4px 20px",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "digit-flip": {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 250ms ease-out both",
        "fade-up": "fade-up 300ms ease-out both",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "digit-flip": "digit-flip 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
