"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Menu } from "@/types/database";
import { archiveMenu, setDefaultMenu } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Edit3, ExternalLink, Trash2, Check } from "lucide-react";

interface MenuCardProps {
  menu: Menu;
  establishmentId: string;
  establishmentSlug: string;
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  draft: {
    label: "Rascunho",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  published: {
    label: "Publicado",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  archived: {
    label: "Arquivado",
    classes: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

export function MenuCard({
  menu,
  establishmentId,
  establishmentSlug,
}: MenuCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const status = STATUS_LABELS[menu.status] ?? STATUS_LABELS.draft;
  const updatedAt = new Date(menu.updated_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  async function handleSetDefault() {
    setLoading(true);
    const { error } = await setDefaultMenu(menu.id, establishmentId);
    if (error) {
      toast.error("Erro ao definir cardápio padrão.");
    } else {
      toast.success("Cardápio padrão atualizado!");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleArchive() {
    if (
      !confirm(
        `Arquivar o cardápio "${menu.name}"? Esta ação pode ser desfeita.`,
      )
    )
      return;
    setLoading(true);
    const { error } = await archiveMenu(menu.id);
    if (error) {
      toast.error("Erro ao arquivar cardápio.");
    } else {
      toast.success("Cardápio arquivado.");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all duration-300",
        "hover:shadow-md group animate-in fade-in zoom-in-95 duration-500",
        menu.is_default ? "border-[#FF69B4]" : "border-gray-100 hover:border-pink-100",
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-[#FF1493] transition-colors">{menu.name}</h3>
            {menu.is_default && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white flex-shrink-0 flex items-center gap-1 shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                }}
              >
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                Padrão
              </span>
            )}
          </div>
          {menu.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {menu.description}
            </p>
          )}
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0",
            status.classes,
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Meta */}
      <p className="text-xs text-gray-400">Atualizado em {updatedAt}</p>

      {/* Preview of primary colour */}
      <div
        className="h-1.5 rounded-full w-full opacity-40 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${menu.theme_config?.colors?.primary ?? "#FF69B4"} 0%, ${menu.theme_config?.colors?.accent ?? "#FF1493"} 100%)`,
        }}
      />

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <Link
          href={`/admin/editor/${menu.id}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-sm shadow-pink-100"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <Edit3 className="w-4 h-4" />
          Editar cardápio
        </Link>

        <div className="flex gap-2">
          {menu.status === "published" && (
            <a
              href={`/cardapio/${establishmentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-500 bg-gray-50 hover:bg-pink-50 hover:text-[#FF1493] transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ao vivo
            </a>
          )}

          {!menu.is_default && menu.status === "published" && (
            <button
              onClick={handleSetDefault}
              disabled={loading}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-[#FF69B4] bg-pink-50 hover:bg-pink-100 transition-colors disabled:opacity-50"
            >
              Padrão
            </button>
          )}

          <button
            onClick={handleArchive}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Arquivar
          </button>
        </div>
      </div>
    </div>
  );
}
