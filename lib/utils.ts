import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ThemeConfig } from "@/types/database";

// ---------------------------------------------------------------------------
// cn — Tailwind class merging utility
// ---------------------------------------------------------------------------

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-pink-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// formatPrice — localised Brazilian Real formatting
// ---------------------------------------------------------------------------

/**
 * Formats a numeric price to Brazilian Real (BRL) currency string.
 * Returns null if price is null (product has no displayed price).
 *
 * Usage:
 *   formatPrice(29.90) // → "R$ 29,90"
 *   formatPrice(null)  // → null
 */
export function formatPrice(price: number | null): string | null {
  if (price === null) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

// ---------------------------------------------------------------------------
// buildCssVariables — converts ThemeConfig into CSS custom properties
// ---------------------------------------------------------------------------

/**
 * Converts a ThemeConfig object into a React CSSProperties object
 * containing CSS custom properties. Applied to a wrapper <div> so all
 * child components can consume the theme via `var(--theme-*)`.
 *
 * Usage (Totem page):
 *   const cssVars = buildCssVariables(menu.theme_config)
 *   <div style={cssVars}>...</div>
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

// ---------------------------------------------------------------------------
// buildBackgroundStyle — converts ThemeBackground into inline style
// ---------------------------------------------------------------------------

/**
 * Returns an inline background style object from the theme background config.
 * Handles gradient, solid colour, and image backgrounds.
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

// ---------------------------------------------------------------------------
// generateAnchorId — derives a URL-safe anchor ID from a section title
// ---------------------------------------------------------------------------

/**
 * Converts a section title into a URL-safe anchor ID.
 *
 * Usage:
 *   generateAnchorId("ESTAÇÃO GIN") // → "estacao-gin"
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

// ---------------------------------------------------------------------------
// generateSlug — derives a unique URL slug from an establishment name
// ---------------------------------------------------------------------------

/**
 * Converts an establishment name into a URL-safe slug.
 *
 * Usage:
 *   generateSlug("Inova Drinks Bar") // → "inova-drinks-bar"
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

// ---------------------------------------------------------------------------
// truncate — truncates a string to a max length with ellipsis
// ---------------------------------------------------------------------------

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
