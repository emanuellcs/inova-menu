import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_THEME_CONFIG } from "@/types/database";
import type {
  Menu,
  Section,
  Item,
  SectionWithItems,
  MenuWithSections,
  ThemeConfig,
} from "@/types/database";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EditorPanel = "sections" | "theme" | "settings";

interface EditorState {
  // The menu being edited
  menu: Menu | null;
  sections: SectionWithItems[];

  // UI state
  activePanel: EditorPanel;
  selectedSectionId: string | null;
  selectedItemId: string | null;
  isDirty: boolean; // Unsaved changes exist
  isSaving: boolean;
  isPublishing: boolean;
  previewMode: boolean; // Toggled to see the totem preview inline

  // Actions — menu-level
  loadMenu: (menu: MenuWithSections) => void;
  setMenuField: <K extends keyof Menu>(key: K, value: Menu[K]) => void;
  setThemeConfig: (config: ThemeConfig) => void;
  setThemeField: <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
  ) => void;

  // Actions — section-level
  addSection: (section: SectionWithItems) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (orderedIds: string[]) => void;

  // Actions — item-level
  addItem: (sectionId: string, item: Item) => void;
  updateItem: (
    sectionId: string,
    itemId: string,
    updates: Partial<Item>,
  ) => void;
  deleteItem: (sectionId: string, itemId: string) => void;
  reorderItems: (sectionId: string, orderedIds: string[]) => void;
  moveItem: (
    itemId: string,
    fromSectionId: string,
    toSectionId: string,
  ) => void;

  // Actions — UI
  setActivePanel: (panel: EditorPanel) => void;
  setSelectedSection: (id: string | null) => void;
  setSelectedItem: (id: string | null) => void;
  setIsSaving: (v: boolean) => void;
  setIsPublishing: (v: boolean) => void;
  setPreviewMode: (v: boolean) => void;
  markClean: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    menu: null,
    sections: [],
    activePanel: "sections",
    selectedSectionId: null,
    selectedItemId: null,
    isDirty: false,
    isSaving: false,
    isPublishing: false,
    previewMode: false,

    // -------------------------------------------------------------------------
    // Menu actions
    // -------------------------------------------------------------------------

    loadMenu: (menu) =>
      set((state) => {
        state.menu = { ...menu, sections: undefined } as any;
        state.sections = menu.sections;
        state.isDirty = false;
        state.selectedSectionId = null;
        state.selectedItemId = null;
      }),

    setMenuField: (key, value) =>
      set((state) => {
        if (!state.menu) return;
        (state.menu as any)[key] = value;
        state.isDirty = true;
      }),

    setThemeConfig: (config) =>
      set((state) => {
        if (!state.menu) return;
        state.menu.theme_config = config;
        state.isDirty = true;
      }),

    setThemeField: (key, value) =>
      set((state) => {
        if (!state.menu) return;
        (state.menu.theme_config as any)[key] = value;
        state.isDirty = true;
      }),

    // -------------------------------------------------------------------------
    // Section actions
    // -------------------------------------------------------------------------

    addSection: (section) =>
      set((state) => {
        state.sections.push(section);
        state.selectedSectionId = section.id;
        state.isDirty = true;
      }),

    updateSection: (sectionId, updates) =>
      set((state) => {
        const idx = state.sections.findIndex((s) => s.id === sectionId);
        if (idx === -1) return;
        Object.assign(state.sections[idx], updates);
        state.isDirty = true;
      }),

    deleteSection: (sectionId) =>
      set((state) => {
        state.sections = state.sections.filter((s) => s.id !== sectionId);
        if (state.selectedSectionId === sectionId) {
          state.selectedSectionId = null;
        }
        state.isDirty = true;
      }),

    reorderSections: (orderedIds) =>
      set((state) => {
        const map = new Map(state.sections.map((s) => [s.id, s]));
        state.sections = orderedIds.map((id, index) => ({
          ...map.get(id)!,
          display_order: index,
        }));
        state.isDirty = true;
      }),

    // -------------------------------------------------------------------------
    // Item actions
    // -------------------------------------------------------------------------

    addItem: (sectionId, item) =>
      set((state) => {
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return;
        section.items.push(item);
        state.selectedItemId = item.id;
        state.isDirty = true;
      }),

    updateItem: (sectionId, itemId, updates) =>
      set((state) => {
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const itemIdx = section.items.findIndex((i) => i.id === itemId);
        if (itemIdx === -1) return;
        Object.assign(section.items[itemIdx], updates);
        state.isDirty = true;
      }),

    deleteItem: (sectionId, itemId) =>
      set((state) => {
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return;
        section.items = section.items.filter((i) => i.id !== itemId);
        if (state.selectedItemId === itemId) state.selectedItemId = null;
        state.isDirty = true;
      }),

    reorderItems: (sectionId, orderedIds) =>
      set((state) => {
        const section = state.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const map = new Map(section.items.map((i) => [i.id, i]));
        section.items = orderedIds.map((id, index) => ({
          ...map.get(id)!,
          display_order: index,
        }));
        state.isDirty = true;
      }),

    moveItem: (itemId, fromSectionId, toSectionId) =>
      set((state) => {
        const from = state.sections.find((s) => s.id === fromSectionId);
        const to = state.sections.find((s) => s.id === toSectionId);
        if (!from || !to) return;
        const item = from.items.find((i) => i.id === itemId);
        if (!item) return;
        from.items = from.items.filter((i) => i.id !== itemId);
        to.items.push({ ...item, section_id: toSectionId });
        state.isDirty = true;
      }),

    // -------------------------------------------------------------------------
    // UI actions
    // -------------------------------------------------------------------------

    setActivePanel: (panel) =>
      set((state) => {
        state.activePanel = panel;
      }),

    setSelectedSection: (id) =>
      set((state) => {
        state.selectedSectionId = id;
        state.selectedItemId = null;
      }),

    setSelectedItem: (id) =>
      set((state) => {
        state.selectedItemId = id;
      }),

    setIsSaving: (v) =>
      set((state) => {
        state.isSaving = v;
      }),

    setIsPublishing: (v) =>
      set((state) => {
        state.isPublishing = v;
      }),

    setPreviewMode: (v) =>
      set((state) => {
        state.previewMode = v;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),
  })),
);
