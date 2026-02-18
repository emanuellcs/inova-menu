"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { Menu } from "@/types/database";
import { archiveMenu, setDefaultMenu } from "@/lib/actions";
import { cn } from "@/lib/utils";

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
        "bg-white rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all duration-200",
        "hover:shadow-md",
        menu.is_default ? "border-[#FF69B4]" : "border-gray-100",
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 truncate">{menu.name}</h3>
            {menu.is_default && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                }}
              >
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
            "text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0",
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
        className="h-1.5 rounded-full w-full opacity-60"
        style={{
          background: `linear-gradient(90deg, ${menu.theme_config?.colors?.primary ?? "#FF69B4"} 0%, ${menu.theme_config?.colors?.accent ?? "#FF1493"} 100%)`,
        }}
      />

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <Link
          href={`/admin/editor/${menu.id}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar cardápio
        </Link>

        <div className="flex gap-2">
          {menu.status === "published" && (
            <a
              href={`/cardapio/${establishmentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
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
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Ver ao vivo
            </a>
          )}

          {!menu.is_default && menu.status === "published" && (
            <button
              onClick={handleSetDefault}
              disabled={loading}
              className="flex-1 py-2 rounded-xl text-xs font-medium text-[#FF69B4] bg-pink-50 hover:bg-pink-100 transition-colors disabled:opacity-50"
            >
              Definir padrão
            </button>
          )}

          <button
            onClick={handleArchive}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Arquivar
          </button>
        </div>
      </div>
    </div>
  );
}
