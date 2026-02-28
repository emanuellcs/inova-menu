"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions";
import toast from "react-hot-toast";
import { 
  Menu as MenuIcon, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  LogOut, 
  Martini,
  FileText,
  Settings
} from "lucide-react";

interface AdminTopbarProps {
  /** The full name of the current user. */
  userName: string;
  /** The email address of the current user. */
  userEmail?: string;
  /** The name of the establishment currently being managed. */
  establishmentName: string;
  /** The unique URL slug for the establishment's public menu. */
  establishmentSlug: string;
}

/** Mapping of static administration routes to their display labels. */
const STATIC_ROUTES: Record<string, { label: string; parentHref?: string }> = {
  "/admin/dashboard": { label: "Cardápios" },
  "/admin/configuracoes": { label: "Configurações" },
};

/** Navigation items available in the mobile drawer. */
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

interface Crumb {
  label: string;
  href?: string;
}

/**
 * Custom hook to generate breadcrumb data based on the current URL pathname.
 * Handles both static administration routes and dynamic editor paths.
 * @param pathname The current URL path.
 * @returns An array of breadcrumb objects.
 */
function useBreadcrumbs(pathname: string): Crumb[] {
  if (pathname.startsWith("/admin/editor/")) {
    return [
      { label: "Cardápios", href: "/admin/dashboard" },
      { label: "Editor de cardápio" },
    ];
  }
  const route = STATIC_ROUTES[pathname];
  if (route) {
    const crumbs: Crumb[] = [];
    if (route.parentHref) {
      const parent = STATIC_ROUTES[route.parentHref];
      if (parent) crumbs.push({ label: parent.label, href: route.parentHref });
    }
    crumbs.push({ label: route.label });
    return crumbs;
  }
  return [{ label: "Painel" }];
}

/**
 * Extracts initials from a user's name (e.g., "John Doe" -> "JD").
 * @param name The full name to extract initials from.
 * @returns A string containing the uppercase initials.
 */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * Component for rendering a circular user avatar with initials.
 */
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
      }}
    >
      {initials(name)}
    </div>
  );
}

/**
 * Dropdown menu for user-related actions (e.g., viewing profile, signing out).
 */
function UserMenu({
  userName,
  userEmail,
  onSignOut,
}: {
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Abrir menu do usuário"
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
      >
        <Avatar name={userName} size={32} />

        <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-[128px] truncate transition-colors">
          {userName}
        </span>

        <ChevronDown
          className={cn(
            "hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-[#FFF0F5] to-[#FFE4F1] border-b border-pink-100">
            <Avatar name={userName} size={36} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName}
              </p>
              {userEmail && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          <div className="py-1.5">
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Off-canvas drawer for mobile navigation.
 */
function MobileDrawer({
  isOpen,
  onClose,
  userName,
  userEmail,
  establishmentName,
  establishmentSlug,
  pathname,
  onSignOut,
}: {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail?: string;
  establishmentName: string;
  establishmentSlug: string;
  pathname: string;
  onSignOut: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navegação"
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
              }}
            >
              <Martini className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">
                {establishmentName}
              </p>
              <p className="text-xs text-gray-400">Inova Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav
          className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
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
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "text-white shadow-md shadow-pink-100"
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
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}

          {establishmentSlug && (
            <a
              href={`/cardapio/${establishmentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            >
              <ExternalLink className="w-5 h-5 text-gray-400" />
              Ver cardápio ao vivo
            </a>
          )}
        </nav>

        <div className="border-t border-gray-100 px-4 py-4 space-y-2">
          <div className="flex items-center gap-3 px-1 py-1">
            <Avatar name={userName} size={36} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName}
              </p>
              {userEmail && (
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}

/**
 * Indicator shown in the topbar when there are unsaved changes in the editor.
 * Dynamically imports the editor store to avoid bloating other administration pages.
 */
function UnsavedIndicator() {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    import("@/store/editorStore").then(({ useEditorStore }) => {
      setIsDirty(useEditorStore.getState().isDirty);
      unsubscribe = useEditorStore.subscribe((s) => setIsDirty(s.isDirty));
    });

    return () => unsubscribe?.();
  }, []);

  if (!isDirty) return null;

  return (
    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0 ml-2 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Não salvo
    </span>
  );
}

/**
 * Main administration top bar.
 * Provides breadcrumbs, user management, and responsive navigation controls.
 */
export function AdminTopbar({
  userName,
  userEmail,
  establishmentName,
  establishmentSlug,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const breadcrumbs = useBreadcrumbs(pathname);
  const isEditorPage = pathname.startsWith("/admin/editor/");

  /**
   * Triggers the user sign-out process.
   */
  async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
      toast.error("Erro ao sair.");
      return;
    }
    toast.success("Até logo!");
    router.push("/entrar");
    router.refresh();
  }

  return (
    <>
      <header className="flex items-center gap-3 px-4 lg:px-6 h-14 bg-white border-b border-gray-100 flex-shrink-0 z-30">
        <button
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex-shrink-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
            }}
          >
            <Martini className="w-4 h-4 text-white" />
          </div>
        </div>

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 flex-1 min-w-0"
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0 hidden lg:block" />
                )}

                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-sm font-medium text-gray-400 hover:text-[#FF1493] transition-colors truncate hidden lg:block"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-sm truncate",
                      isLast
                        ? "font-bold text-gray-900"
                        : "text-gray-400 font-medium hidden lg:block",
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}

          {isEditorPage && <UnsavedIndicator />}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          {establishmentSlug && (
            <a
              href={`/cardapio/${establishmentSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:text-[#FF1493] border border-gray-100 hover:border-pink-100 hover:bg-pink-50 transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver ao vivo
            </a>
          )}

          <UserMenu
            userName={userName}
            userEmail={userEmail}
            onSignOut={handleSignOut}
          />
        </div>
      </header>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        userEmail={userEmail}
        establishmentName={establishmentName}
        establishmentSlug={establishmentSlug}
        pathname={pathname}
        onSignOut={handleSignOut}
      />
    </>
  );
}
