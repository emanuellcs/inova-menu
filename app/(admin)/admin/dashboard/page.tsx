import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getEstablishmentMenus } from "@/lib/actions";
import { MenuCard } from "@/components/admin/MenuCard";
import { CreateMenuButton } from "@/components/admin/CreateMenuButton";
import type { Menu } from "@/types/database";
import { AlertCircle, FilePlus } from "lucide-react";

export const metadata: Metadata = { title: "Meus Cardápios" };

export default async function DashboardPage() {
  const result = await getEstablishmentMenus();
  
  // If we can't find establishment via getEstablishmentMenus, 
  // try to at least get the establishment ID to allow creation.
  let establishmentId = result.data?.establishmentId;
  let menus = result.data?.menus ?? [];
  let slug = result.data?.slug;

  if (!establishmentId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: membership } = await supabase
        .from("establishment_members")
        .select("establishment_id")
        .eq("profile_id", user.id)
        .single();
      establishmentId = membership?.establishment_id;
    }
  }

  if (!establishmentId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-800">
          Nenhum estabelecimento encontrado
        </h2>
        <p className="text-gray-500 max-w-sm">
          Parece que sua conta não está vinculada a um estabelecimento. 
          Por favor, complete seu cadastro ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Cardápios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie e publique seus cardápios digitais
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CreateMenuButton establishmentId={establishmentId} label="Criar Cardápio" />
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{
              background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
            }}
          >
            <FilePlus className="w-10 h-10 text-[#FF69B4]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Nenhum cardápio criado ainda
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Crie seu primeiro cardápio e publique no totem.
            </p>
          </div>
          <CreateMenuButton
            establishmentId={establishmentId}
            variant="prominent"
            label="Criar meu primeiro cardápio"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              establishmentId={establishmentId}
              establishmentSlug={slug ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
