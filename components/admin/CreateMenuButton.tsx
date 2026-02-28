"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createMenu } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface CreateMenuButtonProps {
  establishmentId: string;
  variant?: "default" | "prominent";
  label?: string;
}

export function CreateMenuButton({
  establishmentId,
  variant = "default",
  label = "Novo cardápio",
}: CreateMenuButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const { data, error } = await createMenu(establishmentId, name.trim());
    if (error || !data) {
      toast.error("Erro ao criar cardápio.");
      setLoading(false);
      return;
    }
    toast.success("Cardápio criado!");
    setIsOpen(false);
    setName("");
    setLoading(false);
    router.push(`/admin/editor/${data.id}`);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-sm shadow-pink-100",
          variant === "prominent"
            ? "px-6 py-3 text-base text-white hover:shadow-md"
            : "px-4 py-2.5 text-sm text-white",
        )}
        style={{
          background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
        }}
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
        {label}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Novo cardápio
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Dê um nome para identificar este cardápio no painel.
            </p>

            <form onSubmit={handleCreate} className="space-y-5">
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cardápio Principal, Happy Hour…"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 text-gray-900
                           focus:outline-none focus:border-[#FF69B4] focus:ring-4 focus:ring-[#FF69B4]/10
                           transition-all duration-200 text-sm font-medium"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setName("");
                  }}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 shadow-sm shadow-pink-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                  }}
                >
                  {loading ? "Criando…" : "Criar cardápio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
