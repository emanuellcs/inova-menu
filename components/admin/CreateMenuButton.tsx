"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createMenu } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface CreateMenuButtonProps {
  establishmentId: string;
  variant?: "default" | "prominent";
}

export function CreateMenuButton({
  establishmentId,
  variant = "default",
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
          "flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95",
          variant === "prominent"
            ? "px-6 py-3 text-base text-white"
            : "px-4 py-2.5 text-sm text-white",
        )}
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Novo cardápio
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-in-up">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Novo cardápio
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Dê um nome para identificar este cardápio no painel.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cardápio Principal, Happy Hour…"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900
                           focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                           transition-all duration-200 text-sm"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setName("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
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
