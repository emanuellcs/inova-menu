"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateAnchorId, generateSlug } from "@/lib/utils";
import { DEFAULT_THEME_CONFIG } from "@/types/database";
import type {
  Menu,
  Section,
  Item,
  ThemeConfig,
  SectionWithItems,
} from "@/types/database";

// ---------------------------------------------------------------------------
// Helper — get the current authenticated user or throw
// ---------------------------------------------------------------------------

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado.");
  return { supabase, user };
}

// =============================================================================
// MENU ACTIONS
// =============================================================================

/** Creates a new draft menu for an establishment with the default theme. */
export async function createMenu(
  establishmentId: string,
  name: string,
): Promise<{ data: Menu | null; error: string | null }> {
  try {
    const { supabase } = await requireUser();

    const { data, error } = await supabase
      .from("menus")
      .insert({
        establishment_id: establishmentId,
        name,
        status: "draft",
        is_default: false,
        theme_config: DEFAULT_THEME_CONFIG as any,
      })
      .select("*")
      .single();

    if (error) throw error;
    revalidatePath("/admin/dashboard");
    return { data: data as Menu, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/** Saves the menu's theme_config and basic fields (name, description). */
export async function saveMenu(
  menuId: string,
  updates: { name?: string; description?: string; theme_config?: ThemeConfig },
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    const { error } = await supabase
      .from("menus")
      .update(updates as any)
      .eq("id", menuId);

    if (error) throw error;
    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Publishes a menu: sets status to 'published' and creates a version snapshot. */
export async function publishMenu(
  menuId: string,
  label?: string,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    // Set status to published
    const { error: statusError } = await supabase
      .from("menus")
      .update({ status: "published" })
      .eq("id", menuId);

    if (statusError) throw statusError;

    // Create immutable version snapshot via the DB function
    const { error: versionError } = await supabase.rpc("create_menu_version", {
      p_menu_id: menuId,
      p_label: label ?? null,
    });

    if (versionError) throw versionError;

    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Sets a menu as the default for its establishment. */
export async function setDefaultMenu(
  menuId: string,
  establishmentId: string,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    // Unset all defaults for this establishment
    await supabase
      .from("menus")
      .update({ is_default: false })
      .eq("establishment_id", establishmentId);

    // Set this menu as default
    const { error } = await supabase
      .from("menus")
      .update({ is_default: true })
      .eq("id", menuId);

    if (error) throw error;
    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Archives a menu (soft delete). */
export async function archiveMenu(
  menuId: string,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase
      .from("menus")
      .update({ status: "archived" })
      .eq("id", menuId);
    if (error) throw error;
    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

// =============================================================================
// SECTION ACTIONS
// =============================================================================

/** Creates a new section at the end of the menu. */
export async function createSection(
  menuId: string,
  title: string,
  currentCount: number,
): Promise<{ data: SectionWithItems | null; error: string | null }> {
  try {
    const { supabase } = await requireUser();

    const anchorId = generateAnchorId(title);

    const { data, error } = await supabase
      .from("sections")
      .insert({
        menu_id: menuId,
        title,
        anchor_id: anchorId,
        display_order: currentCount,
        is_visible: true,
        style_overrides: {},
      })
      .select("*")
      .single();

    if (error) throw error;
    return { data: { ...(data as Section), items: [] }, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/** Updates a section's fields. */
export async function updateSection(
  sectionId: string,
  updates: Partial<Section>,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    // Auto-update anchor_id if title changed
    if (updates.title) {
      updates.anchor_id = generateAnchorId(updates.title);
    }

    const { error } = await supabase
      .from("sections")
      .update(updates as any)
      .eq("id", sectionId);

    if (error) throw error;
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Deletes a section and all its items (cascaded by DB). */
export async function deleteSection(
  sectionId: string,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase
      .from("sections")
      .delete()
      .eq("id", sectionId);
    if (error) throw error;
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Batch-updates display_order for all sections after a drag-and-drop. */
export async function reorderSections(
  updates: { id: string; display_order: number }[],
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    // Execute all updates in parallel
    const promises = updates.map(({ id, display_order }) =>
      supabase.from("sections").update({ display_order }).eq("id", id),
    );
    const results = await Promise.all(promises);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;

    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

// =============================================================================
// ITEM ACTIONS
// =============================================================================

/** Creates a new item in a section. */
export async function createItem(
  sectionId: string,
  name: string,
  currentCount: number,
): Promise<{ data: Item | null; error: string | null }> {
  try {
    const { supabase } = await requireUser();

    const { data, error } = await supabase
      .from("items")
      .insert({
        section_id: sectionId,
        name,
        display_order: currentCount,
        is_available: true,
        is_featured: false,
        style_overrides: {},
        modal_config: {
          iconClass: "fas fa-cocktail",
          showIngredients: true,
          showPrice: true,
          extraInfo: null,
        },
      })
      .select("*")
      .single();

    if (error) throw error;
    return { data: data as Item, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/** Updates any fields on an item. */
export async function updateItem(
  itemId: string,
  updates: Partial<Item>,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase
      .from("items")
      .update(updates as any)
      .eq("id", itemId);
    if (error) throw error;
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Deletes an item. */
export async function deleteItem(
  itemId: string,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    const { error } = await supabase.from("items").delete().eq("id", itemId);
    if (error) throw error;
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/** Batch-updates display_order for items after drag-and-drop. */
export async function reorderItems(
  updates: { id: string; display_order: number }[],
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    const promises = updates.map(({ id, display_order }) =>
      supabase.from("items").update({ display_order }).eq("id", id),
    );
    const results = await Promise.all(promises);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

// =============================================================================
// ESTABLISHMENT ACTIONS
// =============================================================================

/** Fetches all menus for the user's first establishment. */
export async function getEstablishmentMenus(): Promise<{
  data: { establishmentId: string; slug: string; menus: Menu[] } | null;
  error: string | null;
}> {
  try {
    const { supabase, user } = await requireUser();

    // Get the user's establishment via membership
    const { data: membership } = await supabase
      .from("establishment_members")
      .select("establishment_id, establishments(*)")
      .eq("profile_id", user.id)
      .not("accepted_at", "is", null)
      .order("invited_at", { ascending: true })
      .limit(1)
      .single();

    if (!membership) throw new Error("Nenhum cardápio encontrado.");

    const est = (membership as any).establishments;
    const establishmentId = membership.establishment_id;

    const { data: menus, error: menusError } = await supabase
      .from("menus")
      .select("*")
      .eq("establishment_id", establishmentId)
      .neq("status", "archived")
      .order("created_at", { ascending: false });

    if (menusError) throw menusError;

    return {
      data: { establishmentId, slug: est.slug, menus: (menus ?? []) as Menu[] },
      error: null,
    };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/** Fetches a single menu with all sections and items for the editor. */
export async function getMenuForEditor(menuId: string): Promise<{
  data: import("@/types/database").MenuWithSections | null;
  error: string | null;
}> {
  try {
    const { supabase } = await requireUser();

    const { data: menu, error: menuError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", menuId)
      .single();

    if (menuError || !menu)
      throw menuError ?? new Error("Cardápio não encontrado.");

    const { data: sections, error: sectionsError } = await supabase
      .from("sections")
      .select(`*, items(*)`)
      .eq("menu_id", menuId)
      .order("display_order", { ascending: true });

    if (sectionsError) throw sectionsError;

    const sectionsWithItems = (sections ?? []).map((s: any) => ({
      ...s,
      items: (s.items ?? []).sort(
        (a: any, b: any) => a.display_order - b.display_order,
      ),
    }));

    return {
      data: { ...(menu as any), sections: sectionsWithItems },
      error: null,
    };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/** Signs the user out. */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    await supabase.auth.signOut();
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}
