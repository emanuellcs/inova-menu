"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error("Erro ao atualizar senha. Tente novamente.");
    } else {
      toast.success("Senha atualizada com sucesso!");
      router.push("/admin/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Redefinir Senha</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crie uma nova senha para sua conta
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nova Senha
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/10 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          {loading ? "Atualizando..." : "Atualizar Senha"}
        </button>
      </form>
    </div>
  );
}
