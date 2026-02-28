"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MousePointer2, EyeOff, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useEditorStore } from "@/store/editorStore";
import type { Item } from "@/types/database";

interface SortableProductItemProps {
  item: Item;
  sectionId: string;
}

export function SortableProductItem({ item, sectionId }: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const setSelectedItem = useEditorStore((s) => s.setSelectedItem);
  const selectedItemId = useEditorStore((s) => s.selectedItemId);
  const isSelected = selectedItemId === item.id;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 px-4 py-2 bg-white/50 transition-all border-t border-gray-50 first:border-t-0",
        isDragging && "z-50 opacity-50 shadow-md",
        isSelected ? "bg-white shadow-sm ring-1 ring-pink-100" : "hover:bg-white"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing"
        aria-label="Reordenar produto"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setSelectedItem(item.id)}
        className="flex-1 flex items-center justify-between text-left min-w-0"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative">
            <span className={cn(
              "text-xs font-medium truncate block transition-colors",
              isSelected ? "text-[#FF1493] font-bold" : "text-gray-600"
            )}>
              {item.name}
            </span>
            {item.is_featured && (
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 absolute -top-1 -right-3" />
            )}
          </div>
          {!item.is_available && (
            <EyeOff className="w-3 h-3 text-gray-300" />
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {item.price !== null && item.price > 0 && (
            <span className="text-[10px] font-mono text-gray-400">
              {formatPrice(item.price)}
            </span>
          )}

          <MousePointer2 className={cn(
            "w-3 h-3 transition-opacity",
            isSelected ? "text-[#FF1493] opacity-100" : "text-gray-300 opacity-0 group-hover:opacity-100"
          )} />
        </div>
      </button>
    </div>
  );
}
