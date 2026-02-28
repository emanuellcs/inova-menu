"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha inválidos."
          : "Erro ao entrar. Tente novamente.",
      );
      setLoading(false);
      return;
    }

    toast.success("Bem-vindo de volta!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <>
      <h2 className="text-xl font-bold text-[#3D003D] mb-6 text-center">
        Entrar na sua conta
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#3D003D]/80 mb-1"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFB6C1] bg-white/80
                       text-[#3D003D] placeholder-[#3D003D]/40
                       focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                       transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#3D003D]/80"
            >
              Senha
            </label>
            <Link
              href="/recuperar-senha"
              className="text-xs text-[#FF69B4] hover:text-[#FF1493] transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFB6C1] bg-white/80
                       text-[#3D003D] placeholder-[#3D003D]/40
                       focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                       transition-all duration-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="nav-pill-btn w-full py-3 text-base font-semibold
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3D003D]/60">
        Não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="text-[#FF69B4] font-semibold hover:text-[#FF1493] transition-colors"
        >
          Cadastre-se grátis
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <p className="text-[#3D003D]/60 animate-pulse">Carregando...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
