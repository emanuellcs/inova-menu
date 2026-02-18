"use client";

import type { Section, ThemeConfig } from "@/types/database";
import { cn } from "@/lib/utils";

interface TotemNavBarProps {
  sections: Section[];
  theme: ThemeConfig;
}

/**
 * TotemNavBar renders the horizontal navigation bar from the reference HTML.
 *
 * Each button scrolls smoothly to the corresponding section anchor.
 * The buttonStyle from theme.navigation drives the visual variant:
 *   - "pill"     → rounded-full (matches index.html .nav-btn)
 *   - "square"   → rounded-xl
 *   - "outlined" → transparent background with coloured border
 */
export function TotemNavBar({ sections, theme }: TotemNavBarProps) {
  const { navigation, colors } = theme;

  function scrollToSection(anchorId: string) {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const isPill = navigation.buttonStyle === "pill";
  const isSquare = navigation.buttonStyle === "square";
  const isOutlined = navigation.buttonStyle === "outlined";

  return (
    <nav
      className="relative z-10 w-full py-5 px-4"
      aria-label="Navegação do cardápio"
    >
      <div className="flex flex-wrap justify-center gap-3 max-w-7xl mx-auto">
        {sections.map((section) => {
          const anchorId = section.anchor_id ?? section.id;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(anchorId)}
              aria-label={`Ir para ${section.title}`}
              className={cn(
                "relative overflow-hidden font-semibold transition-all duration-300",
                "px-6 py-3 text-base",
                isPill && "rounded-full",
                isSquare && "rounded-xl",
                isOutlined && "rounded-full bg-transparent border-2",
              )}
              style={
                isOutlined
                  ? {
                      borderColor: colors.primary,
                      color: colors.primary,
                    }
                  : {
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                      color: "white",
                      boxShadow: `0 10px 30px ${colors.primary}4D`,
                    }
              }
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.transform = "translateY(-3px)";
                btn.style.boxShadow = `0 15px 40px ${colors.primary}66`;
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.transform = "";
                btn.style.boxShadow = isOutlined
                  ? ""
                  : `0 10px 30px ${colors.primary}4D`;
              }}
            >
              {/* Shimmer sweep on hover (matches index.html .nav-btn::before) */}
              <span
                className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.5s ease, opacity 0.3s ease",
                }}
              />

              {section.icon_class && (
                <i
                  className={`${section.icon_class} mr-2`}
                  aria-hidden="true"
                />
              )}
              {section.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
