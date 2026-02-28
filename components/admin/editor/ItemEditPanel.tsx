"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useEditorStore } from "@/store/editorStore";
import { updateItem } from "@/lib/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Item } from "@/types/database";

interface ItemEditPanelProps {
  /** The item entity being edited. */
  item: Item;
  /** The ID of the section that contains this item. */
  sectionId: string;
}

/**
 * Sidebar panel for editing the details of a specific product item.
 * Implements optimistic updates in the global store and debounced persistence to the database.
 */
export function ItemEditPanel({ item, sectionId }: ItemEditPanelProps) {
  const { updateItem: storeUpdate, setSelectedItem, menu } = useEditorStore();
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  /**
   * Cleanup the debounce timer on component unmount to prevent memory leaks or delayed errors.
   */
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  /**
   * Handles changes to item fields, updating the local store immediately and debouncing the database update.
   * @param key The item property to update.
   * @param value The new value for the property.
   */
  function handleChange<K extends keyof Item>(key: K, value: Item[K]) {
    // 1. Update store immediately (optimistic)
    storeUpdate(sectionId, item.id, { [key]: value } as Partial<Item>);

    // 2. Debounce DB persist
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await updateItem(item.id, {
        [key]: value,
      } as Partial<Item>);
      if (error) toast.error("Erro ao salvar item.");
    }, 600);
  }

  /**
   * Specifically handles updates to the nested modal configuration object.
   * @param key The key within modal_config to update.
   * @param value The new value.
   */
  function handleModalConfigChange(key: string, value: any) {
    const newConfig = { ...(item.modal_config ?? {}), [key]: value };
    handleChange("modal_config", newConfig as any);
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <h3 className="font-bold text-gray-900 text-sm truncate">
          Editar item
        </h3>
        <button
          onClick={() => setSelectedItem(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar painel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <Field label="Nome">
          <input
            type="text"
            value={item.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputCls}
            placeholder="Nome do produto"
          />
        </Field>

        <Field label="Preço (R$)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={item.price ?? ""}
            onChange={(e) =>
              handleChange(
                "price",
                e.target.value ? parseFloat(e.target.value) : null,
              )
            }
            className={inputCls}
            placeholder="Ex: 29.90"
          />
        </Field>

        {menu && (
          <ImageUpload
            establishmentId={menu.establishment_id}
            value={item.image_url}
            onChange={(url) => handleChange("image_url", url || null)}
            label="Imagem do produto"
          />
        )}

        <Field label="Badge de categoria">
          <input
            type="text"
            value={item.category_badge ?? ""}
            onChange={(e) =>
              handleChange("category_badge", e.target.value || null)
            }
            className={inputCls}
            placeholder="Ex: Gins Especiais"
          />
        </Field>

        <Field label="Ícone (Font Awesome)">
          <input
            type="text"
            value={item.icon_class ?? ""}
            onChange={(e) => handleChange("icon_class", e.target.value || null)}
            className={inputCls}
            placeholder="Ex: fas fa-cocktail"
          />
        </Field>

        <Field label="Ingredientes">
          <input
            type="text"
            value={item.ingredients ?? ""}
            onChange={(e) =>
              handleChange("ingredients", e.target.value || null)
            }
            className={inputCls}
            placeholder="Ex: Gin • Citrus • Morango"
          />
        </Field>

        <Field label="Descrição">
          <textarea
            value={item.description ?? ""}
            onChange={(e) =>
              handleChange("description", e.target.value || null)
            }
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Descrição detalhada para o modal"
          />
        </Field>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <Toggle
            label="Disponível"
            checked={item.is_available}
            onChange={(v) => handleChange("is_available", v)}
          />
          <Toggle
            label="Destaque (Estrela no card)"
            checked={item.is_featured}
            onChange={(v) => handleChange("is_featured", v)}
          />
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Configuração do Modal
          </p>
          <Field label="Ícone do modal">
            <input
              type="text"
              value={item.modal_config?.iconClass ?? "fas fa-cocktail"}
              onChange={(e) =>
                handleModalConfigChange("iconClass", e.target.value)
              }
              className={inputCls}
              placeholder="fas fa-cocktail"
            />
          </Field>
          <Toggle
            label="Mostrar ingredientes"
            checked={item.modal_config?.showIngredients ?? true}
            onChange={(v) => handleModalConfigChange("showIngredients", v)}
          />
          <Toggle
            label="Mostrar preço"
            checked={item.modal_config?.showPrice ?? true}
            onChange={(v) => handleModalConfigChange("showPrice", v)}
          />
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-900 " +
  "focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/15 " +
  "transition-all duration-200 bg-white";

/**
 * Visual field wrapper with a label.
 */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Reusable toggle switch for boolean fields.
 */
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-[#FF69B4]" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
