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

/**
 * Internal helper to ensure the user is authenticated.
 * Throws an error if no active session is found.
 * @returns An object containing the Supabase client and the current user.
 */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Não autenticado.");
  return { supabase, user };
}

/**
 * Creates a new draft menu for an establishment with the default theme configuration.
 * @param establishmentId The ID of the establishment owning the menu.
 * @param name The display name of the menu.
 * @returns The created menu or an error message.
 */
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

/**
 * Updates a menu's theme configuration and basic metadata.
 * @param menuId The ID of the menu to update.
 * @param updates Object containing the fields to update (name, description, theme_config).
 * @returns An error message if the operation fails.
 */
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

/**
 * Publishes a menu, making it visible to the public and creating an immutable version snapshot.
 * @param menuId The ID of the menu to publish.
 * @param label Optional descriptive label for this version.
 * @returns An error message if the operation fails.
 */
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

/**
 * Sets a specific menu as the default for its establishment.
 * Any existing default menu for the establishment will be unset.
 * @param menuId The ID of the menu to set as default.
 * @param establishmentId The ID of the establishment.
 * @returns An error message if the operation fails.
 */
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

/**
 * Archives a menu (soft delete), removing it from the active dashboard.
 * @param menuId The ID of the menu to archive.
 * @returns An error message if the operation fails.
 */
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

/**
 * Creates a new section at the end of a menu.
 * @param menuId The ID of the parent menu.
 * @param title The title of the new section.
 * @param currentCount Current number of sections to determine display order.
 * @returns The created section or an error message.
 */
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

/**
 * Updates an existing section's fields.
 * Automatically updates the anchor_id if the title changes.
 * @param sectionId The ID of the section to update.
 * @param updates Partial section object with fields to update.
 * @returns An error message if the operation fails.
 */
export async function updateSection(
  sectionId: string,
  updates: Partial<Section>,
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

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

/**
 * Deletes a section and all its associated items.
 * @param sectionId The ID of the section to delete.
 * @returns An error message if the operation fails.
 */
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

/**
 * Updates the display order of multiple sections simultaneously.
 * @param updates Array of objects containing section ID and new display order.
 * @returns An error message if the operation fails.
 */
export async function reorderSections(
  updates: { id: string; display_order: number }[],
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

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

/**
 * Creates a new product item within a section.
 * @param sectionId The ID of the parent section.
 * @param name The name of the item.
 * @param currentCount Current number of items in the section to determine display order.
 * @returns The created item or an error message.
 */
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

/**
 * Updates fields for a product item.
 * @param itemId The ID of the item to update.
 * @param updates Partial item object with fields to update.
 * @returns An error message if the operation fails.
 */
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

/**
 * Deletes a product item from a section.
 * @param itemId The ID of the item to delete.
 * @returns An error message if the operation fails.
 */
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

/**
 * Updates the display order of multiple items simultaneously.
 * @param updates Array of objects containing item ID and new display order.
 * @returns An error message if the operation fails.
 */
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

/**
 * Fetches the establishment details for the currently authenticated user.
 * @returns The establishment object or an error message.
 */
export async function getEstablishment(): Promise<{
  data: import("@/types/database").Establishment | null;
  error: string | null;
}> {
  try {
    const { supabase, user } = await requireUser();

    const { data: membership } = await supabase
      .from("establishment_members")
      .select("establishment_id, establishments(*)")
      .eq("profile_id", user.id)
      .not("accepted_at", "is", null)
      .limit(1)
      .single();

    if (!membership) throw new Error("Estabelecimento não encontrado.");

    return { data: (membership as any).establishments, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/**
 * Updates basic configuration details for an establishment.
 * @param id The ID of the establishment.
 * @param updates Object containing fields to update (name, slug, logo_url).
 * @returns An error message if the operation fails.
 */
export async function updateEstablishment(
  id: string,
  updates: { name?: string; slug?: string; logo_url?: string | null },
): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();

    if (updates.slug) {
      updates.slug = generateSlug(updates.slug);
    }

    const { error } = await supabase
      .from("establishments")
      .update(updates)
      .eq("id", id);

    if (error) {
      if (error.code === "23505") throw new Error("Este slug já está em uso.");
      throw error;
    }

    revalidatePath("/admin/configuracoes");
    revalidatePath("/admin/dashboard");
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}

/**
 * Uploads a file to Supabase Storage and registers it as a media asset.
 * @param establishmentId The ID of the establishment owning the asset.
 * @param file The file object to upload.
 * @returns The public URL of the uploaded file or an error message.
 */
export async function uploadFile(
  establishmentId: string,
  file: File,
): Promise<{ data: { public_url: string } | null; error: string | null }> {
  try {
    const { supabase, user } = await requireUser();

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${establishmentId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("media_assets").insert({
      establishment_id: establishmentId,
      uploaded_by: user.id,
      storage_path: filePath,
      public_url: publicUrl,
      file_name: file.name,
      mime_type: file.type,
      file_size_bytes: file.size,
    });

    if (dbError) throw dbError;

    return { data: { public_url: publicUrl }, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

/**
 * Fetches all non-archived menus associated with the user's primary establishment.
 * @returns An object containing the establishment ID, slug, and menu list.
 */
export async function getEstablishmentMenus(): Promise<{
  data: { establishmentId: string; slug: string; menus: Menu[] } | null;
  error: string | null;
}> {
  try {
    const { supabase, user } = await requireUser();

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

/**
 * Fetches a single menu with all its sections and items, ordered for display.
 * @param menuId The ID of the menu to fetch.
 * @returns The complete menu structure or an error message.
 */
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

/**
 * Terminates the current user session.
 * @returns An error message if the operation fails.
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { supabase } = await requireUser();
    await supabase.auth.signOut();
    return { error: null };
  } catch (e: any) {
    return { error: e.message };
  }
}
