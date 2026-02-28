"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/actions";

interface ImageUploadProps {
  establishmentId: string;
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ establishmentId, value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setUploading(true);
    const { data, error } = await uploadFile(establishmentId, file);

    if (error || !data) {
      toast.error(error || "Erro ao fazer upload.");
    } else {
      onChange(data.public_url);
      toast.success("Imagem carregada!");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</label>}
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#FF69B4] hover:bg-pink-50 transition-all flex items-center justify-center text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        )}

        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-[#FF69B4] hover:text-[#FF1493] transition-colors disabled:opacity-50"
          >
            {uploading ? "Carregando..." : value ? "Trocar imagem" : "Selecionar imagem"}
          </button>
          <p className="text-[10px] text-gray-400 mt-1">PNG, JPG ou WebP até 5MB</p>
        </div>
      </div>
    </div>
  );
}
