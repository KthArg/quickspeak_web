"use client";

import React from 'react';
import type { NextPage } from 'next';
import { User, KeyRound, Shield, Bell, Moon, Languages } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

// --- SUB-COMPONENTES REACTIVOS ---
const SettingsLink = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    const { theme } = useTheme();
    return (
        <button className={`flex items-center gap-4 group transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-800 hover:text-cyan-500'}`}>
            {icon}
            <span className="font-semibold text-xl sm:text-2xl">{text}</span>
        </button>
    );
};

const SettingsToggle = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className="flex items-center justify-between w-full">
             <div className={`flex items-center gap-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                {icon}
                <span className="font-semibold text-xl sm:text-2xl">{text}</span>
            </div>
            <button 
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-cyan-400' : 'bg-gray-800'}`}
            >
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${isDarkMode ? 'transform translate-x-6' : ''}`}></span>
            </button>
        </div>
    );
};


const SettingsPage: NextPage = () => {
    const { theme } = useTheme(); // Obtiene el tema para aplicar colores dinámicamente

    return (
        // El fondo del layout ya cambia, así que este div solo necesita centrar el contenido.
        // Aplicamos el gradiente morado aquí solo en modo oscuro.
        <div className={`w-full min-h-full flex flex-col items-center justify-center p-6 md:p-10 ${theme === 'dark' ? 'bg-gradient-to-b from-[#232323] to-[#2c006e]' : 'bg-white bg-gradient-to-b to-[#7C01F6A3]'}`}>
          <main className="w-full max-w-md flex flex-col items-start gap-10">
            <header className="w-full text-center">
                <h1 className={`text-5xl sm:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h1>
            </header>

            <div className="w-full flex flex-col items-start gap-8">
                <section className="w-full flex flex-col items-start gap-4">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Account</h2>
                    <div className="pl-2 flex flex-col items-start gap-4">
                        <SettingsLink icon={<User size={24} />} text="Edit profile" />
                        <SettingsLink icon={<KeyRound size={24} />} text="Change password" />
                    </div>
                </section>
                <section className="w-full flex flex-col items-start gap-4">
                     <h2 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>App Settings</h2>
                     <div className="w-full pl-2 flex flex-col items-start gap-4">
                        <SettingsLink icon={<Shield size={24} />} text="Privacy" />
                        <SettingsLink icon={<Bell size={24} />} text="Notifications" />
                        <SettingsToggle icon={<Moon size={24} />} text="Dark mode" />
                        <SettingsLink icon={<Languages size={24} />} text="App Language" />
                    </div>
                </section>
            </div>
          </main>
        </div>
    );
};

export default SettingsPage;