import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ganti nilai di globals.css sesuai warna khas sekolah (logo/seragam)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        // Warna "rangka" panel admin (sidebar + topbar) — ikut berganti sesuai tema akun
        chrome: {
          bg: "hsl(var(--chrome-bg))",
          strong: "hsl(var(--chrome-strong))",
          fg: "hsl(var(--chrome-fg))",
          muted: "hsl(var(--chrome-muted))",
          border: "hsl(var(--chrome-border))",
          hover: "hsl(var(--chrome-hover))",
          "active-bg": "hsl(var(--chrome-active-bg))",
          "active-fg": "hsl(var(--chrome-active-fg))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
