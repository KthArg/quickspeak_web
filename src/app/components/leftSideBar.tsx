"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";  // Importar usePathname
import { useTheme } from "../contexts/ThemeContext";
import {
  Mic,
  BookText,
  Languages,
  User,
  LogOut,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Bell,
} from "lucide-react";

// --- Sub-componente para cada elemento del menú ---
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded: boolean;
  onClick?: () => void;
  showDot?: boolean; // 👈 nuevo
}

function SidebarItem({
  icon,
  text,
  active = false,
  expanded,
  onClick,
  showDot = false,
}: SidebarItemProps) {
  const { theme } = useTheme();

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-4 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          theme === "dark"
            ? active
              ? "bg-gradient-to-tr from-cyan-400 to-cyan-600 text-white"
              : "hover:bg-gray-700 text-gray-300"
            : active
            ? "bg-[#073b4c] text-white"
            : "hover:bg-gray-100 text-gray-600"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-40 ml-4" : "w-0"
        }`}
      >
        {text}
      </span>

      {/* Tooltip cuando está colapsado */}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          ${
            theme === "dark"
              ? "bg-cyan-900 text-white"
              : "bg-gray-800 text-white"
          }
        `}
        >
          {text}
        </div>
      )}

      {/* Punto de notificación */}
      {showDot && (
        <span className="absolute right-4 w-2 h-2 rounded-full bg-red-500" />
      )}
    </li>
  );
}

// --- Componente Principal del Sidebar ---
export default function LeftSidebar({
  onLogoutClick,
}: {
  onLogoutClick: () => void;
}) {
  const { theme } = useTheme();
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarExpanded");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Estado para saber si hay notificaciones sin leer
  const [hasUnread, setHasUnread] = useState(false);

  // Leer contador de no leídas
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    const userId = storedUserId || "123";
    const apiBase = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;

    if (!token || !apiBase) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(
          `${apiBase}/notifications/unread-count/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        setHasUnread((data.count ?? 0) > 0);
      } catch (err) {
        console.error("Error consultando unread-count:", err);
      }
    };

    fetchCount();

    // Refrescar cada 20s
    const id = setInterval(fetchCount, 20000);
    return () => clearInterval(id);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded((curr: boolean) => {
      const newValue = !curr;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarExpanded", JSON.stringify(newValue));
      }
      return newValue;
    });
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const IconComponent = isExpanded ? ChevronsLeft : ChevronsRight;

  return (
    <aside
      className={`h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <nav
        className={`h-full flex flex-col transition-colors
          ${
            theme === "dark"
              ? "bg-[#232323] shadow-[inset_-1.5px_0_0_rgba(255,255,255,0.15)] text-white"
              : "bg-white border-r-2 border-gray-100 text-[#073b4c]"
          }
        `}
      >
        {/* Logo y Botón para colapsar */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all text-2xl font-bold ${
              isExpanded ? "w-40" : "w-0"
            }`}
          >
            Quick Speak
          </h1>
          <button
            onClick={toggleSidebar}
            className={`p-1.5 rounded-lg transition-colors
              ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            <IconComponent size={24} />
          </button>
        </div>

        <hr
          className={`my-2 transition-colors ${
            theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}
        />

        {/* Links Principales */}
        <ul className="flex-1 px-3">
          <a href="/dashboard/speakers">
            <SidebarItem
              icon={<Mic size={26} />}
              text="Speakers"
              active={isActive("/dashboard/speakers")}
              expanded={isExpanded}
            />
          </a>

          <a href="/dashboard/my_dictionaries">
            <SidebarItem
              icon={<BookText size={26} />}
              text="Dictionary"
              active={isActive("/dashboard/my_dictionaries")}
              expanded={isExpanded}
            />
          </a>

          <a href="/dashboard/languages">
            <SidebarItem
              icon={<Languages size={26} />}
              text="Languages"
              active={isActive("/dashboard/languages")}
              expanded={isExpanded}
            />
          </a>

          {/* Notifications con punto si hay no leídas */}
          <a href="/dashboard/notifications">
            <SidebarItem
              icon={<Bell size={26} />}
              text="Notifications"
              active={isActive("/dashboard/notifications")}
              expanded={isExpanded}
              showDot={hasUnread}
            />
          </a>

          <a href="/dashboard/profile">
            <SidebarItem
              icon={<User size={26} />}
              text="Profile"
              active={isActive("/dashboard/profile")}
              expanded={isExpanded}
            />
          </a>
        </ul>

        {/* Links Inferiores */}
        <div
          className={`p-3 border-t transition-colors ${
            theme === "dark" ? "border-white/10" : "border-gray-200"
          }`}
        >
          <a href="/dashboard/settings">
            <SidebarItem
              icon={<Settings size={26} />}
              text="Settings"
              active={isActive("/dashboard/settings")}
              expanded={isExpanded}
            />
          </a>
          <SidebarItem
            icon={<LogOut size={26} />}
            text="Log out"
            expanded={isExpanded}
            onClick={onLogoutClick}
          />
        </div>
      </nav>
    </aside>
  );
}
