"use client";

import { useState } from "react";
import Image from "next/image";
import type { Item, ThemeConfig } from "@/types/database";
import { formatPrice } from "@/lib/utils";
import { ProductModal } from "@/components/totem/ProductModal";

interface ProductCardProps {
  item: Item;
  theme: ThemeConfig;
  index: number;
}

/**
 * ProductCard — renders a single product in the totem menu grid.
 *
 * Maps directly to the .product-card elements in the reference index.html.
 *
 * Features driven by theme_config.productCard:
 * - showIcon      — Font Awesome icon above the title
 * - showBadge     — Category badge pill
 * - showDescription — Ingredients/description line
 * - showPrice     — Formatted BRL price
 * - showImage     — Product image (when available)
 * - hoverEffect   — "lift" | "glow" | "none"
 * - borderRadius  — Card corner radius
 *
 * Per-item style_overrides from item.style_overrides apply on top.
 * Clicking the card opens ProductModal with the full item detail.
 */
export function ProductCard({ item, theme, index }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const { productCard, colors } = theme;
  const overrides = item.style_overrides ?? {};

  const formattedPrice = formatPrice(item.price);

  const cardBackground =
    overrides.cardBackground ?? `var(--theme-color-card-bg)`;
  const badgeBackground =
    overrides.badgeBackground ??
    `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`;
  const badgeColor = overrides.badgeColor ?? "white";
  const titleColor = overrides.titleColor ?? `var(--theme-color-text)`;

  return (
    <>
      <article
        className="product-card animate-fade-in-up"
        style={{
          background: cardBackground,
          borderColor: `var(--theme-color-card-border)`,
          borderRadius: productCard.borderRadius,
          animationDelay: `${index * 0.08}s`,
          animationFillMode: "both",
          opacity: 0,
          transform: isPressed ? "scale(0.98)" : undefined,
          cursor: "pointer",
        }}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setIsModalOpen(true)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPressed(false), 150);
        }}
        tabIndex={0}
        role="button"
        aria-label={`Ver detalhes de ${item.name}`}
      >
        {/* Featured badge */}
        {item.is_featured && (
          <div
            className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
            }}
          >
            ⭐ Destaque
          </div>
        )}

        {/* Product image */}
        {productCard.showImage && item.image_url && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}

        {/* Icon */}
        {productCard.showIcon && item.icon_class && (
          <i
            className={`${item.icon_class} text-5xl mb-4 block`}
            aria-hidden="true"
            style={{ color: colors.primary }}
          />
        )}

        {/* Category badge */}
        {productCard.showBadge && item.category_badge && (
          <div
            className="category-badge"
            style={{ background: badgeBackground, color: badgeColor }}
          >
            {item.category_badge}
          </div>
        )}

        {/* Product name */}
        <h3
          className="font-bold leading-tight mb-2"
          style={{
            fontSize: `var(--theme-font-size-product-title)`,
            color: titleColor,
          }}
        >
          {item.name}
        </h3>

        {/* Ingredients / description */}
        {productCard.showDescription &&
          (item.ingredients || item.description) && (
            <p
              className="text-sm opacity-70 leading-relaxed mt-1"
              style={{ color: `var(--theme-color-text)` }}
            >
              {item.ingredients ?? item.description}
            </p>
          )}

        {/* Price */}
        {productCard.showPrice && formattedPrice && (
          <div
            className="mt-4 inline-block font-bold text-xl px-4 py-1 rounded-full"
            style={{
              background: `${colors.primary}15`,
              color: colors.primary,
              border: `1.5px solid ${colors.primary}40`,
            }}
          >
            {formattedPrice}
          </div>
        )}
      </article>

      {/* Product detail modal */}
      <ProductModal
        item={item}
        theme={theme}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
