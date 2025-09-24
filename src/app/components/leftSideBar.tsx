"use client";

import { useState } from 'react';
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

// --- Sub-componente para cada elemento del menú ---
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  expanded: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, text, active = false, expanded, onClick }: SidebarItemProps) {
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-4 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-cyan-400 to-cyan-600 text-white"
          : "hover:bg-gray-700 text-gray-300"
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

      {/* Tooltip que aparece cuando el menú está contraído */}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-cyan-900 text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}


// --- Componente Principal del Sidebar (Modificado para aceptar onLogoutClick) ---
export default function LeftSidebar({ onLogoutClick }: { onLogoutClick: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeLink, setActiveLink] = useState('Speakers');

  return (
    <aside className={`h-screen transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-20'}`}>
      <nav className="h-full flex flex-col bg-[#232323] shadow-[inset_-1.5px_0_0_rgba(255,255,255,0.15)]">
        
        {/* Logo y Botón para colapsar */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1 className={`overflow-hidden transition-all text-2xl font-bold ${isExpanded ? "w-40" : "w-0"}`}>
            Quick Speak
          </h1>
          <button
            onClick={() => setIsExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {isExpanded ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
          </button>
        </div>

        {/* Separador */}
        <hr className="border-t-2 border-white/10 my-2" />

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
        <div className="border-t border-white/10 p-3">
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
                onClick={onLogoutClick} // <-- El evento se conecta aquí
            />
        </div>
      </nav>
    </aside>
  );
}