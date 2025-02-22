import { type Config } from "tailwindcss";
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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
