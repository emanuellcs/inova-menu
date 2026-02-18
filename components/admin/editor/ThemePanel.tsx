"use client";

import { useEditorStore } from "@/store/editorStore";
import type {
  ThemeConfig,
  BackgroundType,
  ButtonStyle,
  HoverEffect,
} from "@/types/database";

/**
 * ThemePanel — the "Aparência" tab in the editor's left panel.
 *
 * Every change is written directly into the Zustand store via setThemeField().
 * The user must click "Salvar" in the EditorTopbar to persist to Supabase.
 *
 * Controls:
 *  - Colours (primary, secondary, accent, text, card background, card border)
 *  - Background (gradient, solid, image)
 *  - Typography (font family via Google Fonts URL)
 *  - Header settings (title, subtitle, logo URL, show animated bg)
 *  - Navigation (show nav bar, button style, sticky)
 *  - Product card (show icon, badge, description, price, image, hover effect, border radius)
 *  - Footer (text, subtext)
 */
export function ThemePanel() {
  const menu = useEditorStore((s) => s.menu);
  const setThemeField = useEditorStore((s) => s.setThemeField);

  if (!menu) return null;

  const theme = menu.theme_config;

  function setColors(key: keyof ThemeConfig["colors"], value: string) {
    setThemeField("colors", { ...theme.colors, [key]: value });
  }

  function setBackground(key: keyof ThemeConfig["background"], value: any) {
    setThemeField("background", { ...theme.background, [key]: value });
  }

  function setTypography(key: keyof ThemeConfig["typography"], value: string) {
    setThemeField("typography", { ...theme.typography, [key]: value });
  }

  function setHeader(key: keyof ThemeConfig["header"], value: any) {
    setThemeField("header", { ...theme.header, [key]: value });
  }

  function setNavigation(key: keyof ThemeConfig["navigation"], value: any) {
    setThemeField("navigation", { ...theme.navigation, [key]: value });
  }

  function setProductCard(key: keyof ThemeConfig["productCard"], value: any) {
    setThemeField("productCard", { ...theme.productCard, [key]: value });
  }

  function setFooter(key: keyof ThemeConfig["footer"], value: any) {
    setThemeField("footer", { ...theme.footer, [key]: value });
  }

  return (
    <div className="px-4 py-4 space-y-6 overflow-y-auto">
      {/* ------------------------------------------------------------------ */}
      {/* CORES */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Cores">
        <ColorRow
          label="Primária"
          value={theme.colors.primary}
          onChange={(v) => setColors("primary", v)}
        />
        <ColorRow
          label="Secundária"
          value={theme.colors.secondary}
          onChange={(v) => setColors("secondary", v)}
        />
        <ColorRow
          label="Destaque (Accent)"
          value={theme.colors.accent}
          onChange={(v) => setColors("accent", v)}
        />
        <ColorRow
          label="Texto"
          value={theme.colors.text}
          onChange={(v) => setColors("text", v)}
        />
        <ColorRow
          label="Fundo do card"
          value={theme.colors.cardBackground}
          onChange={(v) => setColors("cardBackground", v)}
        />
        <ColorRow
          label="Borda do card"
          value={theme.colors.cardBorder}
          onChange={(v) => setColors("cardBorder", v)}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* FUNDO */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Fundo da página">
        <SelectRow
          label="Tipo"
          value={theme.background.type}
          options={[
            { value: "gradient", label: "Gradiente" },
            { value: "solid", label: "Cor sólida" },
            { value: "image", label: "Imagem" },
          ]}
          onChange={(v) => setBackground("type", v as BackgroundType)}
        />
        {theme.background.type !== "image" && (
          <ColorRow
            label="Cor inicial"
            value={theme.background.gradientStart}
            onChange={(v) => setBackground("gradientStart", v)}
          />
        )}
        {theme.background.type === "gradient" && (
          <>
            <ColorRow
              label="Cor final"
              value={theme.background.gradientEnd}
              onChange={(v) => setBackground("gradientEnd", v)}
            />
            <NumberRow
              label="Ângulo (graus)"
              value={theme.background.gradientAngle}
              min={0}
              max={360}
              onChange={(v) => setBackground("gradientAngle", v)}
            />
          </>
        )}
        {theme.background.type === "image" && (
          <TextRow
            label="URL da imagem"
            value={theme.background.imageUrl ?? ""}
            placeholder="https://…"
            onChange={(v) => setBackground("imageUrl", v || null)}
          />
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* TIPOGRAFIA */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Tipografia">
        <TextRow
          label="Família da fonte"
          value={theme.typography.fontFamily}
          placeholder="Poppins"
          onChange={(v) => setTypography("fontFamily", v)}
        />
        <TextRow
          label="URL Google Fonts"
          value={theme.typography.fontUrl}
          placeholder="https://fonts.googleapis.com/…"
          onChange={(v) => setTypography("fontUrl", v)}
        />
        <TextRow
          label="Tamanho base"
          value={theme.typography.baseFontSize}
          placeholder="1.1rem"
          onChange={(v) => setTypography("baseFontSize", v)}
        />
        <TextRow
          label="Título de seção"
          value={theme.typography.sectionTitleSize}
          placeholder="2.5rem"
          onChange={(v) => setTypography("sectionTitleSize", v)}
        />
        <TextRow
          label="Título do produto"
          value={theme.typography.productTitleSize}
          placeholder="1.4rem"
          onChange={(v) => setTypography("productTitleSize", v)}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* CABEÇALHO */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Cabeçalho">
        <TextRow
          label="Título"
          value={theme.header.title}
          placeholder="Inova Drinks"
          onChange={(v) => setHeader("title", v)}
        />
        <TextRow
          label="Subtítulo"
          value={theme.header.subtitle ?? ""}
          placeholder="Opcional"
          onChange={(v) => setHeader("subtitle", v || null)}
        />
        <TextRow
          label="URL do logo"
          value={theme.header.logoUrl ?? ""}
          placeholder="https://…"
          onChange={(v) => setHeader("logoUrl", v || null)}
        />
        <ToggleRow
          label="Exibir logo"
          checked={theme.header.showLogo}
          onChange={(v) => setHeader("showLogo", v)}
        />
        <ToggleRow
          label="Fundo animado"
          checked={theme.header.showAnimatedBackground}
          onChange={(v) => setHeader("showAnimatedBackground", v)}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* NAVEGAÇÃO */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Barra de navegação">
        <ToggleRow
          label="Exibir barra de navegação"
          checked={theme.navigation.showNavBar}
          onChange={(v) => setNavigation("showNavBar", v)}
        />
        <SelectRow
          label="Estilo dos botões"
          value={theme.navigation.buttonStyle}
          options={[
            { value: "pill", label: "Arredondado (pill)" },
            { value: "square", label: "Quadrado" },
            { value: "outlined", label: "Contornado" },
          ]}
          onChange={(v) => setNavigation("buttonStyle", v as ButtonStyle)}
        />
        <ToggleRow
          label="Fixo no topo (sticky)"
          checked={theme.navigation.stickyNav}
          onChange={(v) => setNavigation("stickyNav", v)}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* CARD DE PRODUTO */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Card de produto">
        <ToggleRow
          label="Exibir ícone"
          checked={theme.productCard.showIcon}
          onChange={(v) => setProductCard("showIcon", v)}
        />
        <ToggleRow
          label="Exibir badge"
          checked={theme.productCard.showBadge}
          onChange={(v) => setProductCard("showBadge", v)}
        />
        <ToggleRow
          label="Exibir descrição"
          checked={theme.productCard.showDescription}
          onChange={(v) => setProductCard("showDescription", v)}
        />
        <ToggleRow
          label="Exibir preço"
          checked={theme.productCard.showPrice}
          onChange={(v) => setProductCard("showPrice", v)}
        />
        <ToggleRow
          label="Exibir imagem"
          checked={theme.productCard.showImage}
          onChange={(v) => setProductCard("showImage", v)}
        />
        <SelectRow
          label="Efeito ao passar o mouse"
          value={theme.productCard.hoverEffect}
          options={[
            { value: "lift", label: "Elevar" },
            { value: "glow", label: "Brilho" },
            { value: "none", label: "Nenhum" },
          ]}
          onChange={(v) => setProductCard("hoverEffect", v as HoverEffect)}
        />
        <TextRow
          label="Raio da borda"
          value={theme.productCard.borderRadius}
          placeholder="20px"
          onChange={(v) => setProductCard("borderRadius", v)}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* RODAPÉ */}
      {/* ------------------------------------------------------------------ */}
      <Section title="Rodapé">
        <TextRow
          label="Texto principal"
          value={theme.footer.text}
          placeholder="© 2025 Inova Drinks"
          onChange={(v) => setFooter("text", v)}
        />
        <TextRow
          label="Subtexto"
          value={theme.footer.subtext ?? ""}
          placeholder="Feito com amor…"
          onChange={(v) => setFooter("subtext", v || null)}
        />
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs text-gray-600 flex-1 truncate">{label}</label>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#FF69B4"}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF69B4] font-mono"
        />
      </div>
    </div>
  );
}

function TextRow({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] focus:ring-2 focus:ring-[#FF69B4]/15 transition-all"
      />
    </div>
  );
}

function NumberRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] transition-all"
      />
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF69B4] bg-white transition-all"
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-[#FF69B4]" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}
