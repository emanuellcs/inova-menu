"use client";

import { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  ChevronRight, 
  EyeOff, 
  ChevronDown, 
  PlusCircle, 
  Package 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { SectionWithItems } from "@/types/database";
import { createItem } from "@/lib/actions";
import toast from "react-hot-toast";
import { SortableProductItem } from "./SortableProductItem";

interface SortableSectionItemProps {
  section: SectionWithItems;
  isActive: boolean;
}

export function SortableSectionItem({ section, isActive }: SortableSectionItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const setSelectedSection = useEditorStore((s) => s.setSelectedSection);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const addItem = useEditorStore((s) => s.addItem);
  
  const isSelected = selectedSectionId === section.id;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  async function handleAddItem(e: React.MouseEvent) {
    e.stopPropagation();
    setIsAdding(true);
    const { data, error } = await createItem(
      section.id,
      "Novo Produto",
      section.items.length
    );

    if (error) {
      toast.error("Erro ao criar item.");
    } else if (data) {
      addItem(section.id, data as any);
      toast.success("Item adicionado!");
      setIsExpanded(true);
    }
    setIsAdding(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white transition-colors border-b border-gray-50 last:border-0",
        isDragging && "z-50 opacity-50 shadow-lg",
      )}
    >
      <div className={cn(
        "group flex items-center gap-2 px-4 py-3 cursor-pointer",
        isSelected ? "bg-pink-50/50" : "hover:bg-gray-50"
      )} onClick={() => setSelectedSection(section.id)}>
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
          aria-label="Reordenar seção"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "text-sm font-bold truncate",
              isSelected ? "text-[#FF1493]" : "text-gray-700"
            )}>
              {section.title}
            </span>
            {!section.is_visible && (
              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
          
          <div className="flex items-center gap-3">
             <button
               onClick={handleAddItem}
               disabled={isAdding}
               className="p-1.5 text-gray-400 hover:text-[#FF1493] hover:bg-pink-50 rounded-lg transition-all"
               title="Adicionar item"
             >
               <PlusCircle className={cn("w-4 h-4", isAdding && "animate-spin")} />
             </button>
             <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
               {section.items.length}
             </span>
          </div>
        </div>
      </div>

      {/* Items list */}
      {isExpanded && (
        <div className="bg-gray-50/30">
          <SortableContext
            items={section.items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {section.items.map((item) => (
                <SortableProductItem 
                  key={item.id} 
                  item={item} 
                  sectionId={section.id} 
                />
              ))}
              
              {section.items.length === 0 && (
                <div className="px-12 py-4 flex flex-col items-center gap-1 text-gray-400 border-t border-gray-50">
                   <Package className="w-5 h-5 opacity-20" />
                   <p className="text-[10px] uppercase font-bold tracking-widest">Vazio</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
}
