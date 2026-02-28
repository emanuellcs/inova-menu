import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ThemeConfig } from "@/types/database";

/**
 * Utility for merging Tailwind CSS class names.
 * Combines clsx for conditional classes and tailwind-merge for intelligent conflict resolution.
 * @param inputs Array of class values to merge.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric price into a Brazilian Real (BRL) currency string.
 * @param price The numeric price to format, or null.
 * @returns A formatted currency string (e.g., "R$ 29,90") or null if the input is null.
 */
export function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

/**
 * Converts a theme configuration into a set of CSS custom properties (variables).
 * These variables are used by components to apply dynamic styling based on the user's theme.
 * @param theme The full theme configuration object.
 * @returns A React CSSProperties object containing the mapped CSS variables.
 */
export function buildCssVariables(theme: ThemeConfig): React.CSSProperties {
  return {
    "--theme-color-primary": theme.colors.primary,
    "--theme-color-secondary": theme.colors.secondary,
    "--theme-color-background": theme.colors.background,
    "--theme-color-text": theme.colors.text,
    "--theme-color-accent": theme.colors.accent,
    "--theme-color-card-border": theme.colors.cardBorder,
    "--theme-color-card-bg": theme.colors.cardBackground,
    "--theme-font-family": theme.typography.fontFamily,
    "--theme-font-size-base": theme.typography.baseFontSize,
    "--theme-font-size-section-title": theme.typography.sectionTitleSize,
    "--theme-font-size-product-title": theme.typography.productTitleSize,
    "--theme-card-border-radius": theme.productCard.borderRadius,
    "--theme-grid-min-col": theme.layout.gridMinColumnWidth,
    "--theme-grid-gap": theme.layout.gridGap,
    "--theme-max-width": theme.layout.maxWidth,
    "--theme-container-padding": theme.layout.containerPadding,
  } as React.CSSProperties;
}

/**
 * Generates an inline background style based on the theme background configuration.
 * Supports solid colors, linear gradients, and background images.
 * @param bg The theme's background configuration.
 * @returns A React CSSProperties object for the background style.
 */
export function buildBackgroundStyle(
  bg: ThemeConfig["background"],
): React.CSSProperties {
  switch (bg.type) {
    case "gradient":
      return {
        background: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientStart} 0%, ${bg.gradientEnd} 100%)`,
      };
    case "image":
      return {
        backgroundImage: `url(${bg.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    case "solid":
      return { backgroundColor: bg.gradientStart };
    default:
      return {};
  }
}

/**
 * Converts a plain text title into a URL-safe anchor ID.
 * Normalizes characters by removing diacritics and replacing spaces with hyphens.
 * @param title The source string to convert.
 * @returns A URL-safe, lowercase anchor ID.
 */
export function generateAnchorId(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Converts a string (typically an establishment name) into a unique URL slug.
 * Ensures the result is lowercase, URL-safe, and contains only single hyphens.
 * @param name The source name to slugify.
 * @returns A URL-safe slug.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Truncates a string to a specified maximum length, adding an ellipsis if necessary.
 * @param str The string to truncate.
 * @param maxLength The maximum allowed length.
 * @returns The truncated string with an ellipsis, or the original string if within the limit.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
