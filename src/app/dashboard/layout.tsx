"use client"; // Necesario para manejar el estado del modal

import { useState } from 'react';
import LeftSidebar from '../components/leftSideBar';
import { Menu, X } from 'lucide-react';

// --- SUB-COMPONENTE: Modal de Confirmación de Logout ---
const LogoutConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-sm flex flex-col items-center gap-6 p-6 rounded-2xl bg-[#232323] border-2 border-cyan-400/50 shadow-2xl">
            <button 
                onClick={onCancel}
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 border-2 border-cyan-400/50 text-cyan-400 rounded-full text-sm font-semibold hover:bg-cyan-400/10"
            >
                <X size={16} /> Close
            </button>

            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold text-cyan-400">Confirm Logout</h2>
                <p className="text-white mt-2">Are you sure you wish to log out of your account?</p>
            </div>

            <div className="w-full flex flex-col gap-3">
                <button
                    onClick={onConfirm}
                    className="w-full bg-gray-600 text-white rounded-lg py-3 font-bold text-lg hover:bg-gray-500 transition-colors"
                >
                    Yes, Logout
                </button>
                <button
                    onClick={onCancel}
                    className="w-full bg-cyan-400 text-black rounded-lg py-3 font-bold text-lg hover:bg-cyan-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    // Aquí iría tu lógica real de logout (llamar a una API, limpiar tokens, etc.)
    console.log("Logging out...");
    setIsLogoutModalOpen(false);
    // Por ejemplo: router.push('/login');
  };

  return (
    <>
      <div className="flex h-screen bg-gray-900">
        <div className="hidden md:flex">
          {/* Pasamos la función para abrir el modal al sidebar */}
          <LeftSidebar onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="md:hidden flex items-center justify-between p-4 bg-[#232323] shadow-md">
            <h1 className="text-xl font-bold text-white">Quick Speak</h1>
            <button className="text-white">
              <Menu size={28} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      
      {/* Renderizado condicional del modal */}
      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}
    </>
  );
}