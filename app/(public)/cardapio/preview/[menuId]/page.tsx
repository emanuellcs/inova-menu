import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TotemShell } from "@/components/totem/TotemShell";
import { TotemHeader } from "@/components/totem/TotemHeader";
import { TotemNavBar } from "@/components/totem/TotemNavBar";
import { TotemSection } from "@/components/totem/TotemSection";
import { TotemFooter } from "@/components/totem/TotemFooter";
import type { MenuWithSections } from "@/types/database";

/**
 * Identical to the public totem page but accessed via menuId (not slug)
 * and works for draft menus. Protected by the admin session cookie.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;
  const supabase = await createClient();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", menuId)
    .single();

  if (!menu) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*, items(*)")
    .eq("menu_id", menuId)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  const sectionsWithItems = (sections ?? []).map((s: any) => ({
    ...s,
    items: (s.items ?? []).sort(
      (a: any, b: any) => a.display_order - b.display_order,
    ),
  }));

  const fullMenu: MenuWithSections = {
    ...(menu as any),
    sections: sectionsWithItems,
  };
  const theme = fullMenu.theme_config;
  const visibleSections = fullMenu.sections;

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
      </main>
      <TotemFooter theme={theme} />
    </TotemShell>
  );
}
