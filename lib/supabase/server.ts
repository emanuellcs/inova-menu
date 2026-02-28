import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Creates a Supabase client for use inside Server Components,
 * Server Actions, and Route Handlers.
 *
 * This client automatically reads and writes session cookies via
 * Next.js's cookies() API.
 *
 * Usage (Server Component):
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where cookies
            // cannot be set. Middleware handles session refresh instead.
          }
        },
      },
    },
  );
}
