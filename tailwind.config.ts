import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        anshuman: {
          DEFAULT: "#0ea5e9",
          dark: "#0369a1",
        },
        abhimanyu: {
          DEFAULT: "#a855f7",
          dark: "#7e22ce",
        },
        kshitij: {
          DEFAULT: "#f59e0b",
          dark: "#b45309",
        },
      },
      keyframes: {
        bounce1: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "dot-1": "bounce1 1.2s infinite ease-in-out 0s",
        "dot-2": "bounce1 1.2s infinite ease-in-out 0.15s",
        "dot-3": "bounce1 1.2s infinite ease-in-out 0.3s",
      },
    },
  },
  plugins: [],
};
export default config;
