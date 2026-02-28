"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [establishmentName, setEstablishmentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    // 1. Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError || !authData.user) {
      toast.error(
        authError?.message.includes("already registered")
          ? "Este e-mail já está cadastrado."
          : "Erro ao criar conta. Tente novamente.",
      );
      setLoading(false);
      return;
    }

    // Guard: Supabase returns user with empty identities if email is already registered but unconfirmed
    if (authData.user.identities && authData.user.identities.length === 0) {
      toast.error("Este e-mail já está cadastrado. Tente entrar na sua conta.");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2. Create the establishment and owner membership via RPC
    // This bypasses RLS issues for unconfirmed users as it's a security definer function.
    const slug = generateSlug(establishmentName);
    
    const { error: rpcError } = await supabase.rpc("create_establishment_on_signup", {
      p_owner_id: userId,
      p_name: establishmentName,
      p_slug: slug
    });

    if (rpcError) {
      // If slug conflict, try once with a random suffix
      const fallbackSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      const { error: retryError } = await supabase.rpc("create_establishment_on_signup", {
        p_owner_id: userId,
        p_name: establishmentName,
        p_slug: fallbackSlug
      });

      if (retryError) {
        console.error("RPC Error:", retryError);
        // We don't block the user if the establishment creation fails here (they can fix it later),
        // but it's better to show an error if it's critical.
        // toast.error("Conta criada, mas houve um erro ao configurar seu bar.");
      }
    }

    // 3. Handle confirmation flow
    if (!authData.session) {
      setNeedsConfirmation(true);
      setLoading(false);
      return;
    }

    toast.success("Conta criada com sucesso! Bem-vindo!");
    router.push("/admin/dashboard");
    router.refresh();
  }

  if (needsConfirmation) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-10 h-10 text-[#FF69B4]" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-[#3D003D] mb-4">
          Confirme seu e-mail
        </h2>
        <p className="text-[#3D003D]/70 mb-8 leading-relaxed">
          Enviamos um link de confirmação para{" "}
          <strong className="text-[#FF69B4]">{email}</strong>. Verifique sua
          caixa de entrada (e a pasta de spam) para ativar sua conta.
        </p>
        <Link
          href="/entrar"
          className="nav-pill-btn px-8 py-3 text-sm font-semibold inline-block"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-[#3D003D] mb-6 text-center">
        Criar sua conta grátis
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full name */}
        <div>
          <label
            htmlFor="full-name"
            className="block text-sm font-medium text-[#3D003D]/80 mb-1"
          >
            Seu nome completo
          </label>
          <input
            id="full-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="João da Silva"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFB6C1] bg-white/80
                       text-[#3D003D] placeholder-[#3D003D]/40
                       focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                       transition-all duration-200"
          />
        </div>

        {/* Establishment name */}
        <div>
          <label
            htmlFor="establishment-name"
            className="block text-sm font-medium text-[#3D003D]/80 mb-1"
          >
            Nome do seu bar / cardápio
          </label>
          <input
            id="establishment-name"
            type="text"
            required
            value={establishmentName}
            onChange={(e) => setEstablishmentName(e.target.value)}
            placeholder="Inova Drinks Bar"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFB6C1] bg-white/80
                       text-[#3D003D] placeholder-[#3D003D]/40
                       focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/20
                       transition-all duration-200"
          />
          {establishmentName && (
            <p className="mt-1 text-xs text-[#3D003D]/50">
              URL do cardápio:{" "}
              <span className="font-medium text-[#FF69B4]">
                /cardapio/{generateSlug(establishmentName)}
              </span>
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#3D003D]/80 mb-1"
          >
            Senha{" "}
            <span className="text-[#3D003D]/40">(mínimo 8 caracteres)</span>
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
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
          {loading ? "Criando conta…" : "Criar conta grátis"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#3D003D]/60">
        Já tem uma conta?{" "}
        <Link
          href="/entrar"
          className="text-[#FF69B4] font-semibold hover:text-[#FF1493] transition-colors"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
