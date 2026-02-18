import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MenuWithSections } from "@/types/database";
import { TotemShell } from "@/components/totem/TotemShell";
import { TotemHeader } from "@/components/totem/TotemHeader";
import { TotemNavBar } from "@/components/totem/TotemNavBar";
import { TotemSection } from "@/components/totem/TotemSection";
import { TotemFooter } from "@/components/totem/TotemFooter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// Dynamic metadata — uses the establishment name and menu name
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: establishment } = await supabase
    .from("establishments")
    .select("name")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!establishment) {
    return { title: "Cardápio não encontrado" };
  }

  return {
    title: `Cardápio — ${establishment.name}`,
    description: `Veja o cardápio completo de ${establishment.name}`,
  };
}

// ---------------------------------------------------------------------------
// Data fetching — resolves slug → establishment → default published menu
// with all sections and items in display_order
// ---------------------------------------------------------------------------

async function fetchMenu(slug: string): Promise<MenuWithSections | null> {
  const supabase = await createClient();

  // 1. Resolve the establishment by slug
  const { data: establishment, error: estError } = await supabase
    .from("establishments")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (estError || !establishment) return null;

  // 2. Find the default published menu for this establishment
  const { data: menu, error: menuError } = await supabase
    .from("menus")
    .select("*")
    .eq("establishment_id", establishment.id)
    .eq("status", "published")
    .eq("is_default", true)
    .single();

  if (menuError || !menu) {
    // Fallback: any published menu
    const { data: fallbackMenu, error: fallbackError } = await supabase
      .from("menus")
      .select("*")
      .eq("establishment_id", establishment.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fallbackError || !fallbackMenu) return null;

    return fetchMenuSections(fallbackMenu as any);
  }

  return fetchMenuSections(menu as any);
}

async function fetchMenuSections(menu: any): Promise<MenuWithSections> {
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("sections")
    .select(
      `
      *,
      items (*)
    `,
    )
    .eq("menu_id", menu.id)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  // Sort items within each section by display_order
  const sectionsWithSortedItems = (sections ?? []).map((section: any) => ({
    ...section,
    items: (section.items ?? []).sort(
      (a: any, b: any) => a.display_order - b.display_order,
    ),
  }));

  return {
    ...menu,
    sections: sectionsWithSortedItems,
  };
}

// ---------------------------------------------------------------------------
// Page component — Server Component, no 'use client'
// ---------------------------------------------------------------------------

export default async function TotemPage({ params }: PageProps) {
  const { slug } = await params;
  const menu = await fetchMenu(slug);

  if (!menu) {
    notFound();
  }

  const theme = menu.theme_config;
  const visibleSections = menu.sections.filter((s) => s.is_visible);

  return (
    <TotemShell theme={theme}>
      {/* Animated dot background pattern */}
      <div className="bg-dot-pattern" aria-hidden="true" />

      {/* Header */}
      <TotemHeader theme={theme} />

      {/* Navigation bar — section quick links */}
      {theme.navigation.showNavBar && visibleSections.length > 0 && (
        <TotemNavBar sections={visibleSections} theme={theme} />
      )}

      {/* Main content */}
      <main
        className="relative z-10 mx-auto px-4 pb-16"
        style={{
          maxWidth: theme.layout.maxWidth,
          padding: `0 ${theme.layout.containerPadding} 4rem`,
        }}
      >
        {visibleSections.map((section, index) => (
          <TotemSection
            key={section.id}
            section={section}
            theme={theme}
            animationDelay={index * 0.1}
          />
        ))}

        {visibleSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
            <span className="text-6xl mb-4">🍹</span>
            <p className="text-xl font-medium">
              Nenhum item no cardápio ainda.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <TotemFooter theme={theme} />
    </TotemShell>
  );
}
