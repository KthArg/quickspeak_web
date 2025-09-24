"use client";

import type { NextPage } from 'next';
import Image from 'next/image';
import { User, UserCog, Trophy } from 'lucide-react';

// --- DATOS FICTICIOS DEL PERFIL ---
const userData = {
  name: 'Alex',
  avatarSeed: 'Alex', // Para generar un avatar consistente de DiceBear
  flagUrl: 'https://unpkg.com/circle-flags/flags/cr.svg', // Bandera de Costa Rica
};

// --- SUB-COMPONENTE: Enlace del Perfil ---
const ProfileLink = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <button className="flex items-center gap-4 text-white group">
    <div className="text-gray-300 group-hover:text-cyan-400 transition-colors">
      {icon}
    </div>
    <span className="font-semibold text-2xl sm:text-3xl group-hover:text-cyan-400 transition-colors">
      {text}
    </span>
  </button>
);


const ProfilePage: NextPage = () => {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#7C01F6A3] text-white font-cabin flex flex-col items-center p-6 md:p-10">
      <main className="w-full max-w-md flex flex-col items-center mt-10 gap-12 sm:gap-16">
        <header className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold">Profile</h1>
        </header>

        <section className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-2xl">
                <Image 
                    src={userData.flagUrl} 
                    alt="User's country flag" 
                    layout="fill" 
                    className="rounded-full object-cover" 
                />
                <Image 
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userData.avatarSeed}`} 
                    alt="User avatar" 
                    layout="fill" 
                    className="rounded-full p-2"
                    unoptimized={true}
                />
            </div>
            <h2 className="text-4xl font-bold">{userData.name}</h2>
        </section>
        
        <nav className="flex flex-col items-start gap-6">
            <ProfileLink icon={<User size={32} />} text="Account" />
            <ProfileLink icon={<UserCog size={32} />} text="Personal info" />
            <ProfileLink icon={<Trophy size={32} />} text="Achievements" />
        </nav>
      </main>
    </div>
  );
};

export default ProfilePage;