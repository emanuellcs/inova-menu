import type { ThemeConfig } from "@/types/database";
import { buildCssVariables, buildBackgroundStyle } from "@/lib/utils";

interface TotemShellProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

/**
 * TotemShell wraps the entire public menu page.
 *
 * Responsibilities:
 * - Injects all theme CSS custom properties via inline style (--theme-*)
 * - Applies the correct background (gradient / image / solid)
 * - Injects the Google Font link for the active theme's typography
 * - Provides the base layout container
 *
 * All child components consume theme values via CSS variables or props,
 * ensuring a single source of truth: the theme_config JSON from Supabase.
 */
export function TotemShell({ theme, children }: TotemShellProps) {
  const cssVars = buildCssVariables(theme);
  const backgroundStyle = buildBackgroundStyle(theme.background);

  return (
    <>
      {/* Dynamic Google Font injection based on theme typography config */}
      {theme.typography.fontUrl && (
        // eslint-disable-next-line @next/next/no-head-element
        <link
          rel="stylesheet"
          href={theme.typography.fontUrl}
          precedence="default"
        />
      )}

      <div
        className="relative min-h-screen overflow-x-hidden totem-scrollbar"
        style={{
          ...cssVars,
          ...backgroundStyle,
          fontFamily: "var(--theme-font-family)",
          fontSize: "var(--theme-font-size-base)",
          color: "var(--theme-color-text)",
        }}
      >
        {children}
      </div>
    </>
  );
}
