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
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { useEditorStore } from "@/store/editorStore";
import { createSection } from "@/lib/actions";
import { SortableSectionItem } from "./SortableSectionItem";


interface SectionsPanelProps {
  menuId: string;
}

/**
 * SectionsPanel — List of sections with drag-and-drop.
 *
 * This version is vertically responsive:
 * - The list is scrollable in the middle.
 * - The "Nova seção" button is fixed at the bottom.
 */
export function SectionsPanel({ menuId }: { menuId: string }) {
  const sections = useEditorStore((s) => s.sections);
  const addSection = useEditorStore((s) => s.addSection);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const reorderItems = useEditorStore((s) => s.reorderItems);
  const [isAdding, setIsAdding] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleAddSection() {
    setIsAdding(true);
    const { data, error } = await createSection(
      menuId,
      "Nova Seção",
      sections.length,
    );


    if (error) {
      toast.error("Erro ao criar seção.");
    } else if (data) {
      addSection(data as any);
      toast.success("Seção criada!");
    }
    setIsAdding(false);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1. Check if we're dragging a Section
    const isActiveSection = sections.some(s => s.id === activeId);
    const isOverSection = sections.some(s => s.id === overId);

    if (isActiveSection && isOverSection) {
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);

      const newOrderedIds = arrayMove(sections, oldIndex, newIndex).map(
        (s) => s.id
      );
      reorderSections(newOrderedIds);
      return;
    }

    // 2. Check if we're dragging an Item (Product)
    // Find the section containing the active item
    const activeSection = sections.find(s => s.items.some(i => i.id === activeId));
    const overSection = sections.find(s => s.items.some(i => i.id === overId));

    if (activeSection && overSection && activeSection.id === overSection.id) {
      const items = activeSection.items;
      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);

      const newOrderedIds = arrayMove(items, oldIndex, newIndex).map(
        (i) => i.id
      );
      reorderItems(activeSection.id, newOrderedIds);
    }
  }


  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="divide-y divide-gray-100">
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isActive={activeId === section.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {sections.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400">Nenhuma seção criada.</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-gray-50/50">
        <button
          onClick={handleAddSection}
          disabled={isAdding}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:border-[#FF69B4] hover:text-[#FF69B4] hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Plus className={isAdding ? "animate-spin w-4 h-4" : "w-4 h-4"} />
          {isAdding ? "Criando..." : "Nova seção"}
        </button>
      </div>
    </div>
  );
}
