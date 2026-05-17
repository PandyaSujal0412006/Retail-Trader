import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          bg: "#0B1120",
          card: "#0F1729",
          border: "#1e2d4a",
          "border-light": "#243552",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(30,45,74,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,74,0.4) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(30,45,74,0.6), 0 4px 24px rgba(0,0,0,0.4)",
        "card-hover":
          "0 0 0 1px rgba(30,45,74,0.9), 0 8px 32px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(16,185,129,0.15)",
        "glow-rose": "0 0 20px rgba(244,63,94,0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
