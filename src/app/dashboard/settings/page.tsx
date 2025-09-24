"use client";

import React, { useState } from 'react';
import type { NextPage } from 'next';
import { User, KeyRound, Shield, Bell, Moon, Languages } from 'lucide-react';

// --- SUB-COMPONENTE: Enlace de Configuración ---
const SettingsLink = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <button className="flex items-center gap-4 text-gray-300 group transition-colors hover:text-white">
    {icon}
    <span className="font-semibold text-xl sm:text-2xl">{text}</span>
  </button>
);

// --- SUB-COMPONENTE: Toggle de Configuración ---
const SettingsToggle = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    const [isOn, setIsOn] = useState(true); // El toggle está activado por defecto

    return (
        <div className="flex items-center justify-between w-full">
             <div className="flex items-center gap-4 text-gray-300">
                {icon}
                <span className="font-semibold text-xl sm:text-2xl">{text}</span>
            </div>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${isOn ? 'bg-cyan-400' : 'bg-gray-600'}`}
            >
                <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${isOn ? 'transform translate-x-6' : ''}`}></span>
            </button>
        </div>
    );
};


const SettingsPage: NextPage = () => {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#7C01F6A3] text-white font-cabin flex flex-col items-center p-6 md:p-10">
      <main className="w-full max-w-md flex flex-col items-start mt-30 gap-15">
        <header className="w-full text-center">
            <h1 className="text-5xl sm:text-6xl font-bold">Settings</h1>
        </header>

        <div className="w-full flex flex-col items-start gap-8">
            {/* Sección de Cuenta */}
            <section className="w-full flex flex-col items-start gap-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-200">Account</h2>
                <div className="pl-2 flex flex-col items-start gap-4">
                    <SettingsLink icon={<User size={24} />} text="Edit profile" />
                    <SettingsLink icon={<KeyRound size={24} />} text="Change password" />
                </div>
            </section>

            {/* Sección de App */}
            <section className="w-full flex flex-col items-start gap-4">
                 <h2 className="text-3xl sm:text-4xl font-bold text-gray-200">App Settings</h2>
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