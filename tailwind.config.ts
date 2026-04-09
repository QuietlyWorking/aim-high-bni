import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{astro,tsx,ts}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "ah-red": "#c41230",
        "ah-red-dark": "#a00f28",
        "ah-dark": "#1a1a1a",
        "ah-gray": "#f5f5f5",
        "ah-gray-text": "#666666",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
