"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/redefinir-senha`,
    });

    if (error) {
      toast.error("Erro ao enviar e-mail de recuperação.");
    } else {
      setSubmitted(true);
      toast.success("E-mail enviado!");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-6">📧</div>
        <h2 className="text-2xl font-bold text-[#3D003D] mb-4">Verifique seu e-mail</h2>
        <p className="text-[#3D003D]/70 mb-8 leading-relaxed">
          Enviamos as instruções para recuperar sua senha para <strong className="text-[#FF69B4]">{email}</strong>.
        </p>
        <Link href="/entrar" className="nav-pill-btn px-8 py-3 text-sm font-semibold inline-block">
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-[#3D003D] mb-2 text-center">Recuperar Senha</h2>
      <p className="text-sm text-[#3D003D]/60 mb-8 text-center">
        Digite seu e-mail para receber as instruções.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#3D003D]/80 mb-1">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFB6C1] bg-white/80
                       text-[#3D003D] placeholder-[#3D003D]/40
                       focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                       transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="nav-pill-btn w-full py-3 text-base font-semibold disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar instruções"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3D003D]/60">
        Lembrou a senha?{" "}
        <Link href="/entrar" className="text-[#FF69B4] font-semibold hover:text-[#FF1493] transition-colors">
          Fazer login
        </Link>
      </p>
    </>
  );
}
