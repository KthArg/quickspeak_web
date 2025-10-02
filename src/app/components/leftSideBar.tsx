"use client";

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Mic, 
  BookText, 
  Languages, 
  User, 
  LogOut, 
  Settings,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

// --- Sub-componente para cada elemento del menú (Ahora reactivo al tema) ---
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, text, active = false, expanded, onClick }: SidebarItemProps) {
  const { theme } = useTheme(); // Obtiene el tema actual

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-4 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${theme === 'dark'
          ? (active ? "bg-gradient-to-tr from-cyan-400 to-cyan-600 text-white" : "hover:bg-gray-700 text-gray-300")
          : (active ? "bg-[#073b4c] text-white" : "hover:bg-gray-100 text-gray-600")
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

      {/* El Tooltip también cambia de color */}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          ${theme === 'dark' ? 'bg-cyan-900 text-white' : 'bg-gray-800 text-white'}
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}


// --- Componente Principal del Sidebar (Reactivo al tema) ---
export default function LeftSidebar({ onLogoutClick }: { onLogoutClick: () => void }) {
  const { theme } = useTheme(); // Obtiene el tema actual
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeLink, setActiveLink] = useState('Speakers');

  const IconComponent = isExpanded ? ChevronsLeft : ChevronsRight;

  return (
    <aside className={`h-screen transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-20'}`}>
      <nav 
        className={`h-full flex flex-col transition-colors
          ${theme === 'dark' 
            ? 'bg-[#232323] shadow-[inset_-1.5px_0_0_rgba(255,255,255,0.15)] text-white' 
            : 'bg-white border-r-2 border-gray-100 text-[#073b4c]'}
        `}
      >
        
        {/* Logo y Botón para colapsar */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1 className={`overflow-hidden transition-all text-2xl font-bold ${isExpanded ? "w-40" : "w-0"}`}>
            Quick Speak
          </h1>
          <button
            onClick={() => setIsExpanded((curr) => !curr)}
            className={`p-1.5 rounded-lg transition-colors
              ${theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
          >
            <IconComponent size={24} />
          </button>
        </div>

        {/* Separador */}
        <hr className={`my-2 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`} />

        {/* Links Principales */}
        <ul className="flex-1 px-3">
          <SidebarItem
            icon={<Mic size={26} />}
            text="Speakers"
            active={activeLink === 'Speakers'}
            expanded={isExpanded}
            onClick={() => setActiveLink('Speakers')}
          />
          <SidebarItem
            icon={<BookText size={26} />}
            text="Dictionary"
            active={activeLink === 'Dictionary'}
            expanded={isExpanded}
            onClick={() => setActiveLink('Dictionary')}
          />
          <SidebarItem
            icon={<Languages size={26} />}
            text="Languages"
            active={activeLink === 'Languages'}
            expanded={isExpanded}
            onClick={() => setActiveLink('Languages')}
          />
          <SidebarItem
            icon={<User size={26} />}
            text="Profile"
            active={activeLink === 'Profile'}
            expanded={isExpanded}
            onClick={() => setActiveLink('Profile')}
          />
        </ul>

        {/* Links Inferiores */}
        <div className={`p-3 border-t transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
            <SidebarItem
                icon={<Settings size={26} />}
                text="Settings"
                expanded={isExpanded}
                onClick={() => { /* Lógica para ir a Settings */ }}
            />
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