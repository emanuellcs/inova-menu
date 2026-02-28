"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { cn } from "@/lib/utils";
import type {
  ThemeConfig,
  BackgroundType,
  ButtonStyle,
  HoverEffect,
} from "@/types/database";

import { 
  Palette, 
  Layout, 
  GlassWater, 
  Settings 
} from "lucide-react";

/**
 * Component for configuring the visual theme of the menu.
 * Organizes settings into tabs: Colors, Header, Products, and Advanced.
 */
export function ThemePanel() {
  const menu = useEditorStore((s) => s.menu);
  const setThemeField = useEditorStore((s) => s.setThemeField);
  const [activeTab, setActiveTab] = useState<"colors" | "header" | "cards" | "advanced">("colors");

  if (!menu) return null;

  const theme = menu.theme_config;

  /**
   * Helper to update a nested theme configuration field.
   * @param key The top-level theme category.
   * @param subKey The specific field within the category.
   * @param value The new value.
   */
  function update<T extends keyof ThemeConfig>(key: T, subKey: string, value: any) {
    setThemeField(key, { ...(theme[key] as any), [subKey]: value });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100 bg-gray-50/50 p-1">
        {[
          { id: "colors", label: "Cores", icon: Palette },
          { id: "header", label: "Topo", icon: Layout },
          { id: "cards", label: "Produtos", icon: GlassWater },
          { id: "advanced", label: "Mais", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-white text-[#FF1493] shadow-sm ring-1 ring-black/5"
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              )}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>


      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8">
        {/* Color and Background Settings */}
        {activeTab === "colors" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Group title="Cores da Marca" description="As cores principais do seu cardápio.">
              <ColorRow label="Principal" value={theme.colors.primary} onChange={(v) => update("colors", "primary", v)} />
              <ColorRow label="Destaques" value={theme.colors.accent} onChange={(v) => update("colors", "accent", v)} />
              <ColorRow label="Texto" value={theme.colors.text} onChange={(v) => update("colors", "text", v)} />
            </Group>

            <Group title="Fundo da Página">
              <SelectRow
                label="Tipo de Fundo"
                value={theme.background.type}
                options={[
                  { value: "gradient", label: "Gradiente" },
                  { value: "solid", label: "Cor sólida" },
                  { value: "image", label: "Imagem" },
                ]}
                onChange={(v) => update("background", "type", v as BackgroundType)}
              />
              {theme.background.type === "image" ? (
                <ImageUpload
                  establishmentId={menu.establishment_id}
                  value={theme.background.imageUrl}
                  onChange={(url) => update("background", "imageUrl", url)}
                />
              ) : (
                <ColorRow 
                   label={theme.background.type === "solid" ? "Cor do Fundo" : "Cor Inicial"} 
                   value={theme.background.gradientStart} 
                   onChange={(v) => update("background", "gradientStart", v)} 
                />
              )}
              {theme.background.type === "gradient" && (
                 <ColorRow label="Cor Final" value={theme.background.gradientEnd} onChange={(v) => update("background", "gradientEnd", v)} />
              )}
            </Group>
          </div>
        )}

        {/* Header and Identity Settings */}
        {activeTab === "header" && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Group title="Logo e Identidade">
                <ImageUpload
                  establishmentId={menu.establishment_id}
                  value={theme.header.logoUrl}
                  onChange={(url) => update("header", "logoUrl", url)}
                  label="Logo do Bar"
                />
                <ToggleRow label="Mostrar Logo" checked={theme.header.showLogo} onChange={(v) => update("header", "showLogo", v)} />
             </Group>

             <Group title="Textos">
                <TextRow label="Título" value={theme.header.title} onChange={(v) => update("header", "title", v)} />
                <TextRow label="Subtítulo" value={theme.header.subtitle ?? ""} onChange={(v) => update("header", "subtitle", v)} />
             </Group>

             <Group title="Efeitos">
                <ToggleRow label="Animação de Fundo" checked={theme.header.showAnimatedBackground} onChange={(v) => update("header", "showAnimatedBackground", v)} />
             </Group>
           </div>
        )}

        {/* Product Card Visual Settings */}
        {activeTab === "cards" && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Group title="Estilo dos Cards" description="Como os itens são exibidos.">
                <SelectRow
                  label="Efeito ao tocar/passar mouse"
                  value={theme.productCard.hoverEffect}
                  options={[
                    { value: "lift", label: "Elevar" },
                    { value: "glow", label: "Brilho" },
                    { value: "none", label: "Nenhum" },
                  ]}
                  onChange={(v) => update("productCard", "hoverEffect", v as HoverEffect)}
                />
                <TextRow label="Arredondamento (ex: 20px)" value={theme.productCard.borderRadius} onChange={(v) => update("productCard", "borderRadius", v)} />
             </Group>

             <Group title="Visibilidade">
                <ToggleRow label="Mostrar Ícones" checked={theme.productCard.showIcon} onChange={(v) => update("productCard", "showIcon", v)} />
                <ToggleRow label="Mostrar Preço" checked={theme.productCard.showPrice} onChange={(v) => update("productCard", "showPrice", v)} />
                <ToggleRow label="Mostrar Imagens" checked={theme.productCard.showImage} onChange={(v) => update("productCard", "showImage", v)} />
                <ToggleRow label="Mostrar Descrição" checked={theme.productCard.showDescription} onChange={(v) => update("productCard", "showDescription", v)} />
             </Group>
           </div>
        )}

        {/* Navigation, Typography and Footer Settings */}
        {activeTab === "advanced" && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Group title="Navegação">
                <ToggleRow label="Barra de Categorias" checked={theme.navigation.showNavBar} onChange={(v) => update("navigation", "showNavBar", v)} />
                <SelectRow
                  label="Estilo dos Botões"
                  value={theme.navigation.buttonStyle}
                  options={[
                    { value: "pill", label: "Pill (Arredondado)" },
                    { value: "square", label: "Quadrado" },
                    { value: "outlined", label: "Contorno" },
                  ]}
                  onChange={(v) => update("navigation", "buttonStyle", v as ButtonStyle)}
                />
             </Group>

             <Group title="Tipografia (Fontes)">
                <TextRow label="Nome da Fonte" value={theme.typography.fontFamily} placeholder="Ex: Poppins" onChange={(v) => update("typography", "fontFamily", v)} />
                <TextRow label="Google Fonts URL" value={theme.typography.fontUrl} onChange={(v) => update("typography", "fontUrl", v)} />
             </Group>

             <Group title="Rodapé">
                <TextRow label="Texto" value={theme.footer.text} onChange={(v) => update("footer", "text", v)} />
                <TextRow label="Subtexto" value={theme.footer.subtext ?? ""} onChange={(v) => update("footer", "subtext", v)} />
             </Group>
           </div>
        )}
      </div>
    </div>
  );
}

/**
 * Visual group for organizing related settings.
 */
function Group({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{title}</h4>
        {description && <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-3 bg-gray-50/50 rounded-2xl p-3 ring-1 ring-gray-100">
        {children}
      </div>
    </div>
  );
}

/**
 * Interactive color picker row with a hex text input.
 */
function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#FF69B4"}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer p-0 bg-white overflow-hidden"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-[10px] px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF69B4] font-mono text-center"
        />
      </div>
    </div>
  );
}

/**
 * Basic text input row.
 */
function TextRow({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-400 uppercase mb-1.5 ml-1">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] transition-all"
      />
    </div>
  );
}

/**
 * Dropdown select input row.
 */
function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-400 uppercase mb-1.5 ml-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] bg-white transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Boolean toggle switch row.
 */
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-[#FF69B4]" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
