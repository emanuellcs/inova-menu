"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEstablishment, updateEstablishment } from "@/lib/actions";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Establishment } from "@/types/database";

export default function SettingsPage() {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await getEstablishment();
      if (error || !data) {
        toast.error(error || "Erro ao carregar configurações.");
      } else {
        setEstablishment(data);
        setName(data.name);
        setSlug(data.slug);
        setLogoUrl(data.logo_url || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!establishment) return;
    
    setSaving(true);
    const { error } = await updateEstablishment(establishment.id, {
      name,
      slug,
      logo_url: logoUrl || null,
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success("Configurações salvas!");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-[#FF69B4] border-t-transparent" />
      </div>
    );
  }

  if (!establishment) return null;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie as informações do seu estabelecimento
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome do Estabelecimento
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/10 transition-all"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Link do Cardápio (URL)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm whitespace-nowrap">/cardapio/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/10 transition-all font-mono text-sm"
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Este é o endereço público do seu cardápio.
          </p>
        </div>

        {/* Logo URL */}
        <ImageUpload
          establishmentId={establishment.id}
          value={logoUrl}
          onChange={setLogoUrl}
          label="Logo do Estabelecimento"
        />

        <div className="pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
