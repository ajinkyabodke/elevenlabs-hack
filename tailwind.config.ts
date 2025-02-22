import { type Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sage: {
          50: "#f8faf8",
          100: "#eef2ef",
          200: "#d5e0d7",
          300: "#b3c7b7",
          400: "#8aa790",
          500: "#6b8971",
          600: "#526b57",
          700: "#425446",
          800: "#374439",
          900: "#2f3a31",
        },
        sand: {
          50: "#fdfcfa",
          100: "#f9f6f1",
          200: "#f1e9dd",
          300: "#e4d4bf",
          400: "#d2b694",
          500: "#c19b73",
          600: "#a47b54",
          700: "#856344",
          800: "#6d5139",
          900: "#5c4531",
        },
        ocean: {
          50: "#f5f9fa",
          100: "#e7f1f4",
          200: "#c6dfe6",
          300: "#9cc5d1",
          400: "#68a3b5",
          500: "#458599",
          600: "#366a7b",
          700: "#2c5563",
          800: "#254651",
          900: "#203b44",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
          "21%": { transform: "scale(1.2)", opacity: "1" },
          "58%": { transform: "scale(1.2)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--pulse-color)" },
          "50%": { boxShadow: "0 0 0 8px var(--pulse-color)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        breathe: "breathe 19s infinite ease-in-out",
        pulse: "pulse var(--duration) ease-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
