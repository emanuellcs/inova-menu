"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [establishmentName, setEstablishmentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    // 2. Create the establishment (the handle_new_user trigger creates the profile)
    const slug = generateSlug(establishmentName);
    const { error: estError } = await supabase.from("establishments").insert({
      owner_id: authData.user.id,
      name: establishmentName,
      slug,
    });

    if (estError) {
      // Slug conflict — append random suffix and retry
      const fallbackSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      await supabase.from("establishments").insert({
        owner_id: authData.user.id,
        name: establishmentName,
        slug: fallbackSlug,
      });
    }

    // 3. Add owner membership
    const estResult = await supabase
      .from("establishments")
      .select("id")
      .eq("owner_id", authData.user.id)
      .single();

    if (estResult.data) {
      await supabase.from("establishment_members").insert({
        establishment_id: estResult.data.id,
        profile_id: authData.user.id,
        role: "owner",
        accepted_at: new Date().toISOString(),
      });
    }

    toast.success("Conta criada com sucesso! Bem-vindo!");
    router.push("/admin");
    router.refresh();
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
            Nome do seu bar / estabelecimento
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
