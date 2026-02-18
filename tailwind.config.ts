import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Design tokens mirroring the CSS variables in the reference index.html.
      // These are the DEFAULT values. The theme_config JSONB from Supabase
      // will override these at runtime via inline styles / CSS variables.
      // -----------------------------------------------------------------------
      colors: {
        brand: {
          primary: "#FF69B4",
          secondary: "#FFB6C1",
          light: "#FFF0F5",
          dark: "#FF1493",
          purple: "#3D003D",
        },
      },
      fontFamily: {
        // Default font. The active menu's theme_config.typography.fontFamily
        // is injected as a CSS variable and applied via the 'font-menu' utility.
        sans: ["Poppins", "sans-serif"],
        menu: ["var(--font-menu)", "Poppins", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient-1": "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
        "brand-gradient-2": "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
        "brand-body": "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
      },
      boxShadow: {
        brand: "0 10px 30px rgba(255, 105, 180, 0.3)",
        "brand-hover": "0 15px 40px rgba(255, 105, 180, 0.4)",
      },
      borderRadius: {
        card: "20px",
        pill: "50px",
        section: "25px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "slide-in-up": "slideInUp 0.5s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        shimmer: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Totem-optimised screen size
      screens: {
        totem: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
