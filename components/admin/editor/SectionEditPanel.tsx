"use client";

import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useEditorStore } from "@/store/editorStore";
import { updateSection } from "@/lib/actions";
import type { Section } from "@/types/database";

interface SectionEditPanelProps {
  section: Section;
}

export function SectionEditPanel({ section }: SectionEditPanelProps) {
  const { updateSection: storeUpdate, setSelectedSection } = useEditorStore();
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  function handleChange<K extends keyof Section>(key: K, value: Section[K]) {
    storeUpdate(section.id, { [key]: value } as Partial<Section>);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await updateSection(section.id, {
        [key]: value,
      } as Partial<Section>);
      if (error) toast.error("Erro ao salvar seção.");
    }, 600);
  }

  const inputCls =
    "w-full px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-900 " +
    "focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/15 " +
    "transition-all duration-200 bg-white";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm">Editar seção</h3>
        <button
          onClick={() => setSelectedSection(null)}
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
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Título
          </label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={inputCls}
            placeholder="Nome da seção"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Ícone (Font Awesome)
          </label>
          <input
            type="text"
            value={section.icon_class ?? ""}
            onChange={(e) => handleChange("icon_class", e.target.value || null)}
            className={inputCls}
            placeholder="fas fa-wine-glass"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Descrição
          </label>
          <textarea
            value={section.description ?? ""}
            onChange={(e) =>
              handleChange("description", e.target.value || null)
            }
            className={`${inputCls} resize-none`}
            rows={2}
            placeholder="Subtítulo opcional exibido abaixo do título"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-700">Visível no cardápio</span>
          <button
            role="switch"
            aria-checked={section.is_visible}
            onClick={() => handleChange("is_visible", !section.is_visible)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
              section.is_visible ? "bg-[#FF69B4]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
                section.is_visible ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
