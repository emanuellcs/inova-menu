"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { MenuWithSections } from "@/types/database";
import { EditorTopbar } from "./EditorTopbar";
import { SectionsPanel } from "./SectionsPanel";
import { ThemePanel } from "./ThemePanel";
import { ItemEditPanel } from "./ItemEditPanel";
import { SectionEditPanel } from "./SectionEditPanel";

interface MenuEditorProps {
  initialMenu: MenuWithSections;
}

/**
 * MenuEditor is the root Client Component for the editor.
 *
 * On mount it hydrates the Zustand store with the server-fetched menu.
 * It renders a 3-column layout:
 *   LEFT   — the panel tabs (Sections / Theme / Settings)
 *   CENTER — live scrollable preview of the totem
 *   RIGHT  — contextual form for the selected section or item
 */
export function MenuEditor({ initialMenu }: MenuEditorProps) {
  const {
    loadMenu,
    activePanel,
    selectedSectionId,
    selectedItemId,
    menu,
    sections,
    previewMode,
  } = useEditorStore();

  // Hydrate store from server data on first render
  useEffect(() => {
    loadMenu(initialMenu);
  }, [initialMenu.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!menu) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-[#FF69B4] border-t-transparent" />
      </div>
    );
  }

  // Resolve the selected item across all sections
  const selectedSection = selectedSectionId
    ? (sections.find((s) => s.id === selectedSectionId) ?? null)
    : null;

  const selectedItem = selectedItemId
    ? (sections.flatMap((s) => s.items).find((i) => i.id === selectedItemId) ??
      null)
    : null;

  const selectedItemSectionId = selectedItem
    ? (sections.find((s) => s.items.some((i) => i.id === selectedItem.id))
        ?.id ?? null)
    : null;

  return (
    <div className="flex h-full -m-6 lg:-m-8 overflow-hidden">
      {/* ================================================================
          LEFT PANEL — sections list and theme controls
          ================================================================ */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
        {/* Panel tabs */}
        <div className="flex border-b border-gray-100">
          {(["sections", "theme"] as const).map((panel) => (
            <button
              key={panel}
              onClick={() => useEditorStore.getState().setActivePanel(panel)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                activePanel === panel
                  ? "text-[#FF1493] border-b-2 border-[#FF1493] -mb-px"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {panel === "sections" ? "Seções & Itens" : "Aparência"}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === "sections" && <SectionsPanel menuId={menu.id} />}
          {activePanel === "theme" && <ThemePanel />}
        </div>
      </div>

      {/* ================================================================
          CENTER — Totem preview (scrollable)
          ================================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        <EditorTopbar menu={menu} />

        <div className="flex-1 overflow-y-auto flex items-start justify-center p-6">
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{ minHeight: "600px" }}
          >
            <iframe
              src={`/cardapio/preview/${menu.id}`}
              title="Pré-visualização do cardápio"
              className="w-full border-0"
              style={{ height: "800px" }}
            />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-3">
          💡 Salve as alterações para atualizar a pré-visualização
        </p>
      </div>

      {/* ================================================================
          RIGHT PANEL — contextual edit form
          ================================================================ */}
      {(selectedSection || selectedItem) && (
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col overflow-hidden">
          {selectedItem && selectedItemSectionId ? (
            <ItemEditPanel
              item={selectedItem}
              sectionId={selectedItemSectionId}
            />
          ) : selectedSection ? (
            <SectionEditPanel section={selectedSection} />
          ) : null}
        </div>
      )}
    </div>
  );
}
