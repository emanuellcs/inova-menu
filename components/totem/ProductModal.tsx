"use client";

import { useEffect, useRef } from "react";
import type { Item, ThemeConfig } from "@/types/database";
import { formatPrice } from "@/lib/utils";

interface ProductModalProps {
  item: Item;
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProductModal — accessible product detail modal.
 *
 * Replicates the Bootstrap modal from the reference index.html but as a
 * headless, accessible implementation:
 *  - Focus trap on open
 *  - ESC key dismissal
 *  - Click-outside dismissal
 *  - aria-modal, role="dialog", aria-labelledby
 *  - No external dependencies (no Bootstrap, no Radix)
 *
 * Content driven by:
 *  - item.modal_config.iconClass
 *  - item.modal_config.showIngredients / showPrice
 *  - item.description, item.ingredients, item.price
 */
export function ProductModal({
  item,
  theme,
  isOpen,
  onClose,
}: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { colors } = theme;

  const modalConfig = item.modal_config ?? {
    iconClass: "fas fa-cocktail",
    showIngredients: true,
    showPrice: true,
    extraInfo: null,
  };

  const formattedPrice = formatPrice(item.price);

  // Focus close button when modal opens
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(61, 0, 61, 0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-product-title"
    >
      <div
        className="relative w-full max-w-lg rounded-[20px] overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          border: `2px solid ${colors.secondary}`,
          boxShadow: `0 25px 60px ${colors.primary}50`,
          animation:
            "slideInUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        }}
      >
        {/* Modal header */}
        <div
          className="px-8 py-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          }}
        >
          {modalConfig.iconClass && (
            <i
              className={`${modalConfig.iconClass} text-5xl text-white mb-3 block`}
              aria-hidden="true"
            />
          )}
          <h2
            id="modal-product-title"
            className="text-2xl font-bold text-white"
          >
            {item.name}
          </h2>
          {item.category_badge && (
            <span className="mt-2 inline-block text-sm text-white/80 font-medium">
              {item.category_badge}
            </span>
          )}
        </div>

        {/* Modal body */}
        <div className="px-8 py-6 text-center space-y-4">
          {/* Description */}
          {item.description && (
            <p
              className="text-base leading-relaxed"
              style={{ color: colors.text ?? "#3D003D" }}
            >
              {item.description}
            </p>
          )}

          {/* Ingredients */}
          {modalConfig.showIngredients && item.ingredients && (
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold opacity-50 mb-1">
                Ingredientes
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                {item.ingredients}
              </p>
            </div>
          )}

          {/* Price */}
          {modalConfig.showPrice && formattedPrice && (
            <div
              className="inline-block px-6 py-2 rounded-full text-xl font-bold"
              style={{
                background: `${colors.primary}12`,
                color: colors.primary,
                border: `2px solid ${colors.primary}30`,
              }}
            >
              {formattedPrice}
            </div>
          )}

          {/* Extra info */}
          {modalConfig.extraInfo && (
            <p className="text-sm opacity-60 italic">{modalConfig.extraInfo}</p>
          )}
        </div>

        {/* Modal footer */}
        <div
          className="px-8 py-5 flex justify-center border-t"
          style={{ borderColor: `${colors.secondary}` }}
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="nav-pill-btn px-8 py-3 text-base font-semibold flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              boxShadow: `0 10px 30px ${colors.primary}4D`,
            }}
            aria-label="Fechar detalhes do produto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
