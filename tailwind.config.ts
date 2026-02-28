import type { Config } from "tailwindcss";

/**
 * Tailwind CSS configuration for the Inova Menu project.
 * Defines design tokens, custom utility classes, and theme extensions
 * that drive both the administration dashboard and the totem interface.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /**
       * Brand colors mirroring the design system.
       * These serve as defaults; totem pages override these via theme_config.
       */
      colors: {
        brand: {
          primary: "#FF69B4",
          secondary: "#FFB6C1",
          light: "#FFF0F5",
          dark: "#FF1493",
          purple: "#3D003D",
        },
      },
      /**
       * Typography tokens, including dynamic CSS variables for totem customization.
       */
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        'totem-base': ['var(--theme-font-size-base, 1.1rem)', { lineHeight: '1.6' }],
        'totem-section': ['var(--theme-font-size-section-title, 2.5rem)', { lineHeight: '1.2' }],
        'totem-product': ['var(--theme-font-size-product-title, 1.4rem)', { lineHeight: '1.3' }],
      },
      /**
       * Layout and spacing tokens with dynamic theme overrides.
       */
      spacing: {
        'totem-gap': 'var(--theme-grid-gap, 2rem)',
        'totem-padding': 'var(--theme-container-padding, 1rem)',
      },
      /**
       * Font families including the project-wide Poppins and dynamic menu font.
       */
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        menu: ["var(--theme-font-family)", "Poppins", "sans-serif"],
      },
      /**
       * Custom background gradients based on brand colors.
       */
      backgroundImage: {
        "brand-gradient-1": "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
        "brand-gradient-2": "linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)",
        "brand-body": "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
      },
      /**
       * Shadow tokens for cards and interactive elements.
       */
      boxShadow: {
        brand: "0 10px 30px rgba(255, 105, 180, 0.3)",
        "brand-hover": "0 15px 40px rgba(255, 105, 180, 0.4)",
        "card-soft": "0 8px 30px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 20px 40px rgba(255, 105, 180, 0.12)",
      },
      /**
       * Border radius tokens for different UI contexts.
       */
      borderRadius: {
        card: "20px",
        pill: "50px",
        section: "25px",
        'admin-xl': "16px",
      },
      /**
       * Custom animation sequences for visual feedback.
       */
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "slide-in-up": "slideInUp 0.5s ease forwards",
        "pulse-soft": "pulseSoft 2s infinite",
      },
      /**
       * Keyframe definitions for the custom animations.
       */
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
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        }
      },
      /**
       * Totem-specific viewport screen size.
       */
      screens: {
        totem: "1080px",
      },
    },
  },
  plugins: [],
};

export default config;
