"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import type { MenuWithSections, ThemeConfig, SectionWithItems } from "@/types/database";
import { EditorTopbar } from "./EditorTopbar";
import { SectionsPanel } from "./SectionsPanel";
import { ThemePanel } from "./ThemePanel";
import { ItemEditPanel } from "./ItemEditPanel";
import { SectionEditPanel } from "./SectionEditPanel";
import { TotemShell } from "@/components/totem/TotemShell";
import { TotemHeader } from "@/components/totem/TotemHeader";
import { TotemNavBar } from "@/components/totem/TotemNavBar";
import { TotemSection } from "@/components/totem/TotemSection";
import { TotemFooter } from "@/components/totem/TotemFooter";
import { cn } from "@/lib/utils";
import { 
  LayoutList, 
  Palette, 
  Settings, 
  X, 
} from "lucide-react";

interface MenuEditorProps {
  /** The initial menu data fetched from the server. */
  initialMenu: MenuWithSections;
}

/**
 * Component that renders a real-time visual preview of the totem interface.
 * Mimics a mobile device screen to show how the current theme and content will appear.
 */
function RealTimePreview({ theme, sections }: { theme: ThemeConfig; sections: SectionWithItems[] }) {
  const visibleSections = sections.filter(s => s.is_visible);
  
  return (
    <div className="w-full max-w-[450px] aspect-[9/16] bg-white shadow-2xl rounded-[32px] overflow-hidden border-[8px] border-gray-800 relative group animate-fade-in-up">
      <div className="absolute inset-0 overflow-y-auto totem-scrollbar bg-white">
        <TotemShell theme={theme}>
          <div className="bg-dot-pattern" aria-hidden="true" />
          <TotemHeader theme={theme} />
          {theme.navigation.showNavBar && visibleSections.length > 0 && (
            <TotemNavBar sections={visibleSections} theme={theme} />
          )}
          <main
            className="relative z-10 mx-auto px-4 pb-16"
            style={{
              maxWidth: theme.layout.maxWidth,
              padding: `0 ${theme.layout.containerPadding} 4rem`,
            }}
          >
            {visibleSections.map((section, index) => (
              <TotemSection
                key={section.id}
                section={section}
                theme={theme}
                animationDelay={index * 0.1}
              />
            ))}
          </main>
          <TotemFooter theme={theme} />
        </TotemShell>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
        <p className="text-white text-[10px] font-bold uppercase tracking-widest">Pré-visualização em tempo real</p>
      </div>
    </div>
  );
}

/**
 * The main menu editor component.
 * Provides a split-view interface with configuration panels on the sides and a live preview in the center.
 * Handles both desktop and mobile layouts for administrative editing.
 */
export function MenuEditor({ initialMenu }: MenuEditorProps) {
  const {
    loadMenu,
    activePanel,
    setActivePanel,
    selectedSectionId,
    selectedItemId,
    setSelectedSection,
    setSelectedItem,
    menu,
    sections,
  } = useEditorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadMenu(initialMenu);
  }, [initialMenu.id, loadMenu]);

  if (!menu) return null;

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

  const isEditing = !!(selectedSection || selectedItem);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8 overflow-hidden bg-gray-50 relative animate-in fade-in duration-500">
      
      <EditorTopbar menu={menu} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Navigation and Theme controls for desktop */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 bg-white border-r border-gray-100 flex-col overflow-hidden">
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {(["sections", "theme"] as const).map((panel) => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={cn(
                  "flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  activePanel === panel
                    ? "text-[#FF1493] border-b-2 border-[#FF1493] bg-pink-50/30"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                {panel === "sections" ? "Conteúdo" : "Estilo"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {activePanel === "sections" && <SectionsPanel menuId={menu.id} />}
            {activePanel === "theme" && <ThemePanel />}
          </div>
        </aside>

        {/* Center: Interactive Live Preview */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-gray-50/50">
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 lg:p-12">
             <RealTimePreview theme={menu.theme_config} sections={sections} />
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="lg:hidden flex items-center justify-around p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-20 flex-shrink-0">
             <button 
               onClick={() => {
                 setActivePanel("sections");
                 setMobileMenuOpen(true);
               }}
               className="flex flex-col items-center justify-center gap-1 text-gray-400 w-full hover:text-[#FF1493] transition-colors"
             >
               <LayoutList className="w-5 h-5" aria-hidden="true" />
               <span className="text-[10px] font-bold uppercase tracking-tight">Conteúdo</span>
             </button>
             
             <button 
               onClick={() => {
                 setActivePanel("theme");
                 setMobileMenuOpen(true);
               }}
               className="flex flex-col items-center justify-center gap-1 text-gray-400 w-full hover:text-[#FF1493] transition-colors"
             >
               <Palette className="w-5 h-5" aria-hidden="true" />
               <span className="text-[10px] font-bold uppercase tracking-tight">Estilo</span>
             </button>

             <div className="w-px h-6 bg-gray-100 flex-shrink-0" />

             <button 
               onClick={() => setMobileMenuOpen(true)}
               className={cn(
                 "flex flex-col items-center justify-center gap-1 w-full transition-colors",
                 isEditing ? "text-[#FF1493]" : "text-gray-400 hover:text-gray-600"
               )}
             >
               <Settings className="w-5 h-5" aria-hidden="true" />
               <span className="text-[10px] font-bold uppercase tracking-tight">Ajustes</span>
             </button>
          </div>
        </main>

        {/* Right Panel: Contextual editing based on selected section or item */}
        <aside className={cn(
          "hidden lg:flex w-80 flex-shrink-0 bg-white border-l border-gray-100 flex-col overflow-hidden transition-all duration-300",
          !isEditing && "w-0 opacity-0 border-l-0"
        )}>
            <div className="flex-1 overflow-y-auto">
              {selectedItem && selectedItemSectionId ? (
                <ItemEditPanel
                  item={selectedItem}
                  sectionId={selectedItemSectionId}
                />
              ) : selectedSection ? (
                <SectionEditPanel section={selectedSection} />
              ) : null}
            </div>
        </aside>
      </div>

      {/* Mobile Drawer: Contextual and sidebar editing for smaller screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-slide-in-up">
           <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                {isEditing ? (selectedItem ? "Editar Item" : "Editar Seção") : (activePanel === "sections" ? "Conteúdo" : "Estilo")}
              </h2>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSelectedSection(null);
                  setSelectedItem(null);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
           </header>
           
           <div className="flex-1 overflow-hidden flex flex-col">
              {isEditing ? (
                <div className="flex-1 overflow-y-auto">
                  {selectedItem && selectedItemSectionId ? (
                    <ItemEditPanel item={selectedItem} sectionId={selectedItemSectionId} />
                  ) : selectedSection ? (
                    <SectionEditPanel section={selectedSection} />
                  ) : null}
                </div>
              ) : (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {activePanel === "sections" ? <SectionsPanel menuId={menu.id} /> : <ThemePanel />}
                </div>
              )}
           </div>
           
           {isEditing && (
             <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
                <button 
                  onClick={() => {
                    setSelectedSection(null);
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Concluir
                </button>
             </div>
           )}
        </div>
      )}

      <style>{`
        @keyframes slide-in-up {
          from { transform: translateY(100%) }
          to { transform: translateY(0) }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
