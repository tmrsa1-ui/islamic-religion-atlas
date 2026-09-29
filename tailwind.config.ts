import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  theme: { extend: { colors: {
    void: "#07090C", night: "#0E1518", limestone: "#E7E2D8", brass: "#8A6520",
    sea: "#1A2332", verdigris: "#2E7A63", paper: "#F6F3EC", ink: "#1C1915", clay: "#A9917A"
  }, fontFamily: { ar: ["var(--font-ar)", "serif"], latin: ["var(--font-latin)", "Georgia", "serif"] } } },
  plugins: [],
} satisfies Config;
