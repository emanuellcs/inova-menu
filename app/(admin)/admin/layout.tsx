import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: {
    template: "%s | Painel — Inova Menu",
    default: "Painel Administrativo",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  // Fetch profile for display in sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  // Fetch establishment name
  const { data: membership } = await supabase
    .from("establishment_members")
    .select("establishments(name, slug)")
    .eq("profile_id", user.id)
    .not("accepted_at", "is", null)
    .limit(1)
    .single();

  const establishment = (membership as any)?.establishments ?? null;

  return (
    <div className="admin-layout flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        userName={profile?.full_name ?? user.email ?? "Usuário"}
        establishmentName={establishment?.name ?? "Meu Cardápio"}
        establishmentSlug={establishment?.slug ?? ""}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar userName={profile?.full_name ?? user.email ?? "Usuário"} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
