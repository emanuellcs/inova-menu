"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions";
import toast from "react-hot-toast";
import { 
  Martini, 
  FileText, 
  Settings, 
  ExternalLink, 
  LogOut 
} from "lucide-react";

interface AdminSidebarProps {
  /** The full name of the current user. */
  userName: string;
  /** The name of the establishment currently being managed. */
  establishmentName: string;
  /** The unique URL slug for the establishment's public menu. */
  establishmentSlug: string;
}

/** Primary navigation links for the administration sidebar. */
const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Cardápios",
    icon: FileText,
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings,
  },
];

/**
 * Sidebar component for the administration dashboard.
 * Provides consistent navigation and user session management across the admin interface.
 * Visible only on desktop-sized viewports.
 */
export function AdminSidebar({
  userName,
  establishmentName,
  establishmentSlug,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Handles the user logout process.
   */
  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair.");
      return;
    }
    router.push("/entrar");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          <Martini className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">
            {establishmentName}
          </p>
          <p className="text-xs text-gray-400 truncate">Inova Menu</p>
        </div>
      </div>

      <nav
        className="flex-1 px-3 py-4 space-y-1"
        aria-label="Navegação principal"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                isActive
                  ? "text-white shadow-md shadow-pink-200"
                  : "text-gray-500 hover:bg-pink-50 hover:text-[#FF1493]",
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
                    }
                  : undefined
              }
            >
              <Icon 
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform duration-300", 
                  isActive ? "text-white" : "text-gray-400 group-hover:text-[#FF1493] group-hover:scale-110"
                )} 
                aria-hidden="true"
              />
              {item.label}
            </Link>

          );
        })}

        {establishmentSlug && (
          <a
            href={`/cardapio/${establishmentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            Ver cardápio
          </a>
        )}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Sair
        </button>
      </div>
    </aside>
  );
}
