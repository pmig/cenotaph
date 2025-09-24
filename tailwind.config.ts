import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#00b5eb",
          secondary: "#e03466"
        },
        surface: "#edf4f5"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(to bottom, #edf4f5, #f7fbfc)",
        "brand-card": "linear-gradient(135deg, #00b5eb, #e03466)"
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05)"
      }
    }
  },
  plugins: [typography()]
};

export default config;
