import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MenuWithSections } from "@/types/database";
import { TotemShell } from "@/components/totem/TotemShell";
import { TotemHeader } from "@/components/totem/TotemHeader";
import { TotemNavBar } from "@/components/totem/TotemNavBar";
import { TotemSection } from "@/components/totem/TotemSection";
import { TotemFooter } from "@/components/totem/TotemFooter";
import { Martini } from "lucide-react";

interface PageProps {
  /** Route parameters containing the establishment slug. */
  params: Promise<{ slug: string }>;
}

/**
 * Generates dynamic SEO metadata for the public menu page.
 * Uses the establishment name and menu details to provide relevant titles and descriptions.
 * @param props The page properties including route parameters.
 * @returns Metadata object for Next.js.
 */
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

/**
 * Resolves a public menu for an establishment based on its slug.
 * Prioritizes the default published menu, falling back to any available published menu.
 * @param slug The unique establishment slug from the URL.
 * @returns The complete menu structure with sections and items, or null if not found.
 */
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

/**
 * Fetches and sorts sections and items for a specific menu.
 * @param menu The menu entity to load content for.
 * @returns The menu with hydrated and sorted sections and items.
 */
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

/**
 * Public Totem Page — Server Component.
 * Fetches the active menu for an establishment and renders the full totem UI.
 * @param props The page properties including route parameters.
 */
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
      <div className="bg-dot-pattern" aria-hidden="true" />

      <TotemHeader theme={theme} />

      {theme.navigation.showNavBar && visibleSections.length > 0 && (
        <TotemNavBar sections={visibleSections} theme={theme} />
      )}

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
            <Martini className="w-16 h-16 mb-4" />
            <p className="text-xl font-medium">
              Nenhum item no cardápio ainda.
            </p>
          </div>
        )}
      </main>

      <TotemFooter theme={theme} />
    </TotemShell>
  );
}
