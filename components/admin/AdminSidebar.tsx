"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions";
import toast from "react-hot-toast";

interface AdminSidebarProps {
  userName: string;
  establishmentName: string;
  establishmentSlug: string;
}

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Cardápios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 1.41 1.41M4.93 4.93a10 10 0 0 0-1.41 1.41M4.93 19.07a10 10 0 0 0 1.41 1.41M19.07 19.07a10 10 0 0 1-1.41 1.41M21 12h1M2 12h1M12 21v1M12 2v1" />
      </svg>
    ),
  },
];

export function AdminSidebar({
  userName,
  establishmentName,
  establishmentSlug,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
          }}
        >
          🍹
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">
            {establishmentName}
          </p>
          <p className="text-xs text-gray-400 truncate">Inova Menu</p>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-1"
        aria-label="Navegação principal"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
              <span className={isActive ? "text-white" : "text-gray-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* View public menu link */}
        {establishmentSlug && (
          <a
            href={`/cardapio/${establishmentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <span className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
            Ver cardápio
          </a>
        )}
      </nav>

      {/* User footer */}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
}
