import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
        },
        accent: {
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
        },
        ink: {
          400: "var(--ink-400)",
          500: "var(--ink-500)",
          600: "var(--ink-600)",
          700: "var(--ink-700)",
          900: "var(--ink-900)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          subtle: "var(--surface-subtle)",
          blue: "var(--surface-blue)",
        },
        semantic: {
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
        },
      },
      fontFamily: {
        heading: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
