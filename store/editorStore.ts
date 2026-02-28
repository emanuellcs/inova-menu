import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  Menu,
  Section,
  Item,
  SectionWithItems,
  MenuWithSections,
  ThemeConfig,
} from "@/types/database";

/**
 * Available panels in the menu editor.
 */
export type EditorPanel = "sections" | "theme" | "settings";

/**
 * State and actions for the menu editor.
 * Managed via Zustand with Immer middleware for immutable updates.
 */
interface EditorState {
  /** The menu entity currently being edited */
  menu: Menu | null;
  /** List of sections and their nested items for the current menu */
  sections: SectionWithItems[];

  /** The currently active panel in the editor sidebar */
  activePanel: EditorPanel;
  /** ID of the section currently selected for editing */
  selectedSectionId: string | null;
  /** ID of the item currently selected for editing */
  selectedItemId: string | null;
  /** Whether there are unsaved changes in the editor */
  isDirty: boolean;
  /** Whether a save operation is currently in progress */
  isSaving: boolean;
  /** Whether a publish operation is currently in progress */
  isPublishing: boolean;
  /** Whether the editor is in preview mode (showing the totem UI) */
  previewMode: boolean;

  /**
   * Loads a complete menu structure into the store.
   * @param menu The menu with all its sections and items.
   */
  loadMenu: (menu: MenuWithSections) => void;
  /**
   * Updates a top-level field of the menu.
   * @param key The field name to update.
   * @param value The new value for the field.
   */
  setMenuField: <K extends keyof Menu>(key: K, value: Menu[K]) => void;
  /**
   * Replaces the entire theme configuration.
   * @param config The new theme configuration object.
   */
  setThemeConfig: (config: ThemeConfig) => void;
  /**
   * Updates a specific category within the theme configuration.
   * @param key The theme category key (e.g., 'colors', 'typography').
   * @param value The new configuration for that category.
   */
  setThemeField: <K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
  ) => void;

  /**
   * Adds a new section to the menu.
   * @param section The section object to add.
   */
  addSection: (section: SectionWithItems) => void;
  /**
   * Updates fields of an existing section.
   * @param sectionId The ID of the section to update.
   * @param updates Partial section object containing fields to update.
   */
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  /**
   * Deletes a section from the menu.
   * @param sectionId The ID of the section to remove.
   */
  deleteSection: (sectionId: string) => void;
  /**
   * Updates the display order of sections based on an ordered list of IDs.
   * @param orderedIds Array of section IDs in the desired order.
   */
  reorderSections: (orderedIds: string[]) => void;

  /**
   * Adds a new item to a specific section.
   * @param sectionId The ID of the parent section.
   * @param item The item object to add.
   */
  addItem: (sectionId: string, item: Item) => void;
  /**
   * Updates fields of an existing item.
   * @param sectionId The ID of the parent section.
   * @param itemId The ID of the item to update.
   * @param updates Partial item object containing fields to update.
   */
  updateItem: (
    sectionId: string,
    itemId: string,
    updates: Partial<Item>,
  ) => void;
  /**
   * Deletes an item from a section.
   * @param sectionId The ID of the parent section.
   * @param itemId The ID of the item to remove.
   */
  deleteItem: (sectionId: string, itemId: string) => void;
  /**
   * Updates the display order of items within a section.
   * @param sectionId The ID of the section.
   * @param orderedIds Array of item IDs in the desired order.
   */
  reorderItems: (sectionId: string, orderedIds: string[]) => void;
  /**
   * Moves an item from one section to another, optionally at a specific index.
   * @param itemId The ID of the item to move.
   * @param fromSectionId The ID of the current parent section.
   * @param toSectionId The ID of the target parent section.
   * @param index Optional target index within the new section.
   */
  moveItem: (
    itemId: string,
    fromSectionId: string,
    toSectionId: string,
    index?: number,
  ) => void;

  /**
   * Switches the active editor panel.
   * @param panel The panel to activate.
   */
  setActivePanel: (panel: EditorPanel) => void;
  /**
   * Selects a section for editing.
   * @param id The ID of the section, or null to deselect.
   */
  setSelectedSection: (id: string | null) => void;
  /**
   * Selects an item for editing.
   * @param id The ID of the item, or null to deselect.
   */
  setSelectedItem: (id: string | null) => void;
  /**
   * Sets the saving state of the editor.
   * @param v Whether the editor is currently saving.
   */
  setIsSaving: (v: boolean) => void;
  /**
   * Sets the publishing state of the editor.
   * @param v Whether the editor is currently publishing.
   */
  setIsPublishing: (v: boolean) => void;
  /**
   * Toggles the totem preview mode.
   * @param v Whether to show the preview.
   */
  setPreviewMode: (v: boolean) => void;
  /**
   * Clears the dirty flag, typically after a successful save.
   */
  markClean: () => void;
}

/**
 * Zustand store for managing the menu editor state.
 */
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

    moveItem: (itemId, fromSectionId, toSectionId, index) =>
      set((state) => {
        const from = state.sections.find((s) => s.id === fromSectionId);
        const to = state.sections.find((s) => s.id === toSectionId);
        if (!from || !to) return;

        const itemIdx = from.items.findIndex((i) => i.id === itemId);
        if (itemIdx === -1) return;

        const [item] = from.items.splice(itemIdx, 1);
        const updatedItem = { ...item, section_id: toSectionId };

        if (typeof index === "number") {
          to.items.splice(index, 0, updatedItem);
        } else {
          to.items.push(updatedItem);
        }

        // Update display_order for all items in affected sections
        from.items.forEach((it, i) => {
          it.display_order = i;
        });
        to.items.forEach((it, i) => {
          it.display_order = i;
        });

        state.isDirty = true;
      }),

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
