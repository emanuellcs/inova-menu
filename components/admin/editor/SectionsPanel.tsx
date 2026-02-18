"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/store/editorStore";
import {
  createSection,
  deleteSection,
  createItem,
  deleteItem,
} from "@/lib/actions";
import type { SectionWithItems, Item } from "@/types/database";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Sortable Section Row
// ---------------------------------------------------------------------------

function SortableSectionRow({
  section,
  isSelected,
}: {
  section: SectionWithItems;
  isSelected: boolean;
}) {
  const {
    setSelectedSection,
    setSelectedItem,
    selectedItemId,
    deleteSection: storeDeleteSection,
    addItem: storeAddItem,
    deleteItem: storeDeleteItem,
  } = useEditorStore();
  const [expanded, setExpanded] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setLoading(true);
    const { data, error } = await createItem(
      section.id,
      newItemName.trim(),
      section.items.length,
    );
    if (error || !data) {
      toast.error("Erro ao criar item.");
    } else {
      storeAddItem(section.id, data);
      setNewItemName("");
      setAddingItem(false);
    }
    setLoading(false);
  }

  async function handleDeleteSection() {
    if (!confirm(`Deletar a seção "${section.title}" e todos os seus itens?`))
      return;
    const { error } = await deleteSection(section.id);
    if (error) {
      toast.error("Erro ao deletar seção.");
      return;
    }
    storeDeleteSection(section.id);
  }

  async function handleDeleteItem(itemId: string, itemName: string) {
    if (!confirm(`Deletar o item "${itemName}"?`)) return;
    const { error } = await deleteItem(itemId);
    if (error) {
      toast.error("Erro ao deletar item.");
      return;
    }
    storeDeleteItem(section.id, itemId);
  }

  return (
    <div ref={setNodeRef} style={style} className="select-none">
      {/* Section header row */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors",
          isSelected ? "bg-pink-50" : "hover:bg-gray-50",
        )}
        onClick={() => setSelectedSection(isSelected ? null : section.id)}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          aria-label="Reordenar seção"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>

        {/* Expand toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-gray-400 flex-shrink-0"
          aria-label={expanded ? "Recolher seção" : "Expandir seção"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: expanded ? "rotate(90deg)" : undefined,
              transition: "transform 0.2s",
            }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Section title */}
        <span
          className={cn(
            "flex-1 text-sm font-semibold truncate",
            isSelected ? "text-[#FF1493]" : "text-gray-800",
          )}
        >
          {section.title}
        </span>

        <span className="text-xs text-gray-400 flex-shrink-0">
          {section.items.length}
        </span>

        {/* Delete section */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSection();
          }}
          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
          aria-label="Deletar seção"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Items list */}
      {expanded && (
        <div className="ml-8 border-l border-gray-100">
          {section.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm",
                selectedItemId === item.id
                  ? "bg-pink-50 text-[#FF1493]"
                  : "text-gray-600 hover:bg-gray-50",
              )}
              onClick={() => {
                setSelectedSection(section.id);
                setSelectedItem(item.id);
              }}
            >
              <span
                className={cn(
                  "flex-1 truncate",
                  !item.is_available && "line-through opacity-50",
                )}
              >
                {item.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id, item.name);
                }}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label="Deletar item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
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
          ))}

          {/* Add item inline */}
          {addingItem ? (
            <form
              onSubmit={handleAddItem}
              className="flex items-center gap-1 px-3 py-1.5"
            >
              <input
                autoFocus
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nome do item…"
                className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF69B4] min-w-0"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[#FF69B4] hover:text-[#FF1493] text-xs font-semibold"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setAddingItem(false)}
                className="text-gray-400 text-xs"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingItem(true)}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-[#FF69B4] transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar item
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionsPanel
// ---------------------------------------------------------------------------

export function SectionsPanel({ menuId }: { menuId: string }) {
  const {
    sections,
    reorderSections: storeReorder,
    addSection,
    selectedSectionId,
  } = useEditorStore();
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = [...sections.map((s) => s.id)];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id as string);
    storeReorder(newOrder);
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setLoading(true);
    const { data, error } = await createSection(
      menuId,
      newSectionTitle.trim(),
      sections.length,
    );
    if (error || !data) {
      toast.error("Erro ao criar seção.");
    } else {
      addSection(data);
      setNewSectionTitle("");
      setAddingSection(false);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sections list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {sections.map((section) => (
              <SortableSectionRow
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add section */}
      <div className="border-t border-gray-100 p-3">
        {addingSection ? (
          <form onSubmit={handleAddSection} className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Nome da seção…"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] min-w-0"
            />
            <button
              type="submit"
              disabled={loading || !newSectionTitle.trim()}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
              }}
            >
              {loading ? "…" : "OK"}
            </button>
            <button
              type="button"
              onClick={() => setAddingSection(false)}
              className="px-2 text-gray-400"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddingSection(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-[#FF69B4] hover:text-[#FF69B4] transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova seção
          </button>
        )}
      </div>
    </div>
  );
}
