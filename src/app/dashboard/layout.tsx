"use client";

import React, { useState } from 'react';
import LeftSidebar from '../components/leftSideBar';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X } from 'lucide-react';

// --- SUB-COMPONENTE: Modal de Confirmación de Logout (con Light Mode) ---
const LogoutConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`relative w-full max-w-sm flex flex-col items-center gap-6 p-8 rounded-2xl shadow-2xl 
                ${theme === 'dark' 
                    ? 'bg-[#232323] border-2 border-cyan-400/50' 
                    : 'bg-white'}`
            }>
                <button 
                    onClick={onCancel}
                    className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-sm font-semibold transition-colors 
                        ${theme === 'dark' 
                            ? 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10' 
                            : 'border-gray-400 text-gray-600 hover:bg-gray-100'}`
                    }
                >
                    <X size={16} /> Close
                </button>

                <div className="text-center mt-8">
                    <h2 className={`text-3xl font-bold 
                        ${theme === 'dark' ? 'text-cyan-400' : 'text-[#073b4c]'}`
                    }>
                        Confirm Logout
                    </h2>
                    <p className={`mt-2 
                        ${theme === 'dark' ? 'text-white' : 'text-black'}`
                    }>
                        Are you sure you wish to log out of your account?
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className={`w-full rounded-lg py-3 font-bold text-lg text-white transition-colors 
                            ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-[#444] hover:bg-gray-600'}`
                        }
                    >
                        Yes, Logout
                    </button>
                    <button
                        onClick={onCancel}
                        className={`w-full rounded-lg py-3 font-bold text-lg transition-colors 
                            ${theme === 'dark' 
                                ? 'bg-cyan-400 text-black hover:bg-cyan-300' 
                                : 'bg-[#073b4c] text-white hover:bg-opacity-90'}`
                        }
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme } = useTheme();

  const handleLogoutConfirm = () => {
    console.log("Logging out...");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <div className={`flex h-screen w-full ${theme === 'dark' ? 'bg-gradient-to-b from-[#232323] to-[#2c006e]' : 'bg-gray-50'}`}>
        <div className="hidden md:flex flex-shrink-0">
          <LeftSidebar onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </div>
        <div className="flex-1 flex flex-col h-screen">
          <header className={`md:hidden flex items-center justify-between p-4 shadow-md flex-shrink-0 ${theme === 'dark' ? 'bg-[#232323]' : 'bg-white border-b'}`}>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Quick Speak</h1>
            <button className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}><Menu size={28} /></button>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      
      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}
    </>
  );
}