import type { SectionWithItems, ThemeConfig } from "@/types/database";
import { ProductCard } from "@/components/totem/ProductCard";

interface TotemSectionProps {
  section: SectionWithItems;
  theme: ThemeConfig;
  animationDelay?: number;
}

/**
 * TotemSection renders a single menu section.
 *
 * Maps directly to the <section> elements in the reference index.html.
 * Each section has:
 *  - A gradient title banner with shimmer animation (section-title-banner)
 *  - A CSS grid of ProductCards
 *
 * Section-level style overrides from section.style_overrides take
 * precedence over the global theme_config values.
 */
export function TotemSection({
  section,
  theme,
  animationDelay = 0,
}: TotemSectionProps) {
  const { colors } = theme;
  const overrides = section.style_overrides ?? {};
  const anchorId = section.anchor_id ?? section.id;

  const availableItems = section.items.filter((item) => item.is_available);

  if (availableItems.length === 0) return null;

  return (
    <section
      id={anchorId}
      className="animate-fade-in-up"
      style={{
        marginTop: theme.layout.sectionSpacing,
        animationDelay: `${animationDelay}s`,
        animationFillMode: "both",
        opacity: 0, // will be filled by animation
      }}
      aria-labelledby={`section-title-${section.id}`}
    >
      {/* Section title banner */}
      <div
        id={`section-title-${section.id}`}
        className="section-title-banner mb-10 py-7 px-6"
        style={{
          background:
            overrides.titleBackground ??
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          boxShadow: `0 10px 30px ${colors.primary}4D`,
        }}
      >
        <h2
          className="font-bold text-white tracking-wide flex items-center justify-center gap-3 flex-wrap"
          style={{
            fontSize:
              overrides.titleFontSize ?? theme.typography.sectionTitleSize,
            color: overrides.titleColor ?? "white",
          }}
        >
          {section.icon_class && (
            <i className={section.icon_class} aria-hidden="true" />
          )}
          {section.title}
        </h2>

        {section.description && (
          <p className="mt-2 text-white/80 text-base font-normal text-center">
            {section.description}
          </p>
        )}
      </div>

      {/* Product grid */}
      <div
        className="product-grid"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${theme.layout.gridMinColumnWidth}, 1fr))`,
          gap: theme.layout.gridGap,
        }}
      >
        {availableItems.map((item, index) => (
          <ProductCard key={item.id} item={item} theme={theme} index={index} />
        ))}
      </div>
    </section>
  );
}
