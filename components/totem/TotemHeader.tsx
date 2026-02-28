import Image from "next/image";
import type { ThemeConfig } from "@/types/database";
import { Martini } from "lucide-react";

interface TotemHeaderProps {
  theme: ThemeConfig;
}

/**
 * TotemHeader renders the top gradient banner from the reference index.html.
 *
 * Features driven by theme_config.header:
 * - showLogo: toggles the circular logo image
 * - logoUrl: the CDN URL for the logo (falls back to Lucide icon placeholder)
 * - title / subtitle: text rendered inside the banner
 * - backgroundType / backgroundValue: gradient, image, or solid colour
 * - showAnimatedBackground: the floating radial gradient animation
 */
export function TotemHeader({ theme }: TotemHeaderProps) {
  const { header, colors } = theme;

  // Build the header background style
  const headerBackground = (() => {
    if (header.backgroundType === "gradient") {
      return (
        header.backgroundValue ??
        `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`
      );
    }
    if (header.backgroundType === "image" && header.backgroundValue) {
      return `url(${header.backgroundValue}) center/cover no-repeat`;
    }
    return header.backgroundValue ?? colors.primary;
  })();

  return (
    <header
      className="relative overflow-hidden py-8 px-4 text-center"
      style={{
        background: headerBackground,
        boxShadow: `0 10px 30px ${colors.primary}4D`, // 30% opacity
      }}
    >
      {/* Animated radial gradient overlay (matches index.html header::before) */}
      {header.showAnimatedBackground && (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo */}
        {header.showLogo && (
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 flex items-center justify-center text-5xl"
            style={{
              borderColor: "rgba(255,255,255,0.8)",
              boxShadow: `0 10px 30px ${colors.primary}4D`,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            {header.logoUrl ? (
              <Image
                src={header.logoUrl}
                alt={`Logo ${header.title}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            ) : (
              <Martini className="w-12 h-12 text-white/90" aria-hidden="true" />
            )}
          </div>
        )}

        {/* Title */}
        <div className="text-white">
          <h1
            className="font-bold tracking-wide leading-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
          >
            {header.title}
          </h1>

          {header.subtitle && (
            <p
              className="mt-1 opacity-90"
              style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}
            >
              {header.subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
