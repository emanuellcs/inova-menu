"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useEditorStore } from "@/store/editorStore";
import {
  saveMenu,
  publishMenu,
  reorderSections,
  reorderItems,
} from "@/lib/actions";
import type { Menu } from "@/types/database";
import { cn } from "@/lib/utils";

interface EditorTopbarProps {
  menu: Menu;
}

export function EditorTopbar({ menu }: EditorTopbarProps) {
  const router = useRouter();
  const {
    isDirty,
    isSaving,
    isPublishing,
    sections,
    setIsSaving,
    setIsPublishing,
    markClean,
  } = useEditorStore();

  const themeConfig = useEditorStore((s) => s.menu?.theme_config);
  const menuName = useEditorStore((s) => s.menu?.name);

  async function handleSave() {
    if (!isDirty) return;
    setIsSaving(true);

    try {
      // 1. Save menu metadata + theme_config
      const { error: menuError } = await saveMenu(menu.id, {
        name: menuName ?? menu.name,
        theme_config: themeConfig as any,
      });
      if (menuError) throw new Error(menuError);

      // 2. Persist section display_order
      const sectionUpdates = sections.map((s, i) => ({
        id: s.id,
        display_order: i,
      }));
      if (sectionUpdates.length > 0) {
        const { error: secError } = await reorderSections(sectionUpdates);
        if (secError) throw new Error(secError);
      }

      // 3. Persist item display_order within each section
      for (const section of sections) {
        const itemUpdates = section.items.map((item, i) => ({
          id: item.id,
          display_order: i,
        }));
        if (itemUpdates.length > 0) {
          const { error: itemError } = await reorderItems(itemUpdates);
          if (itemError) throw new Error(itemError);
        }
      }

      markClean();
      toast.success("Cardápio salvo com sucesso!");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    setIsPublishing(true);
    try {
      // Save first if dirty
      if (isDirty) await handleSave();

      const { error } = await publishMenu(menu.id);
      if (error) throw new Error(error);
      toast.success("🎉 Cardápio publicado!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao publicar.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 flex-shrink-0">
      {/* Back + title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/admin/dashboard"
          className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
          aria-label="Voltar ao painel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">
            {menuName ?? menu.name}
          </h2>
          <p className="text-xs text-gray-400">
            {isDirty ? (
              <span className="text-amber-500">● Alterações não salvas</span>
            ) : (
              <span className="text-green-500">● Salvo</span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
            isDirty && !isSaving
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          {isSaving ? "Salvando…" : "Salvar"}
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing || isSaving}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          {isPublishing ? "Publicando…" : "Publicar"}
        </button>
      </div>
    </div>
  );
}
