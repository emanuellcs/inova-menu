import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for use inside Client Components ('use client').
 * Reads the session from cookies automatically via @supabase/ssr.
 *
 * Usage:
 *   const supabase = createClient()
 *   const { data } = await supabase.from('menus').select('*')
 */
export function createClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
