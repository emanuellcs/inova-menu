import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEstablishmentMenus } from "@/lib/actions";
import { MenuCard } from "@/components/admin/MenuCard";
import { CreateMenuButton } from "@/components/admin/CreateMenuButton";
import type { Menu } from "@/types/database";

export const metadata: Metadata = { title: "Meus Cardápios" };

export default async function DashboardPage() {
  const result = await getEstablishmentMenus();

  if (result.error || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-bold text-gray-800">
          Nenhum cardápio encontrado
        </h2>
        <p className="text-gray-500 max-w-sm">
          Parece que sua conta não está vinculada a um cardápio. Entre em
          contato com o suporte.
        </p>
      </div>
    );
  }

  const { establishmentId, slug, menus } = result.data;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Cardápios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie e publique seus cardápios digitais
          </p>
        </div>
        <CreateMenuButton establishmentId={establishmentId} />
      </div>

      {/* Menu list */}
      {menus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{
              background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4F1 100%)",
            }}
          >
            📋
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
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              establishmentId={establishmentId}
              establishmentSlug={slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
