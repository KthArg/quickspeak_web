"use client";

import type { NextPage } from 'next';
import Image from 'next/image';
import { useTheme } from './contexts/ThemeContext';
import { ArrowRight } from 'lucide-react';
import React from 'react';

// --- DATOS PARA LAS TARJETAS DE PERSONALIDAD ---
const personalities = [
    { name: 'Aurora', language: 'Spanish', color: 'bg-red-500', avatarSeed: 'Aurora' },
    { name: 'Beatrix', language: 'German', color: 'bg-teal-400', avatarSeed: 'Beatrix' },
    { name: 'Bernard', language: 'French', color: 'bg-sky-500', avatarSeed: 'Bernard' },
    { name: 'Vanessa', language: 'Portuguese', color: 'bg-purple-500', avatarSeed: 'Vanessa' },
    { name: 'Gaston', language: 'French', color: 'bg-emerald-500', avatarSeed: 'Gaston' },
    { name: 'Rahjeet', language: 'Hindi', color: 'bg-yellow-500', avatarSeed: 'Rahjeet' },
    { name: 'Ferdinand', language: 'German', color: 'bg-amber-500', avatarSeed: 'Ferdinand' },
    { name: 'Isabelle', language: 'French', color: 'bg-violet-500', avatarSeed: 'Isabelle' },
    { name: 'Liam', language: 'Irish', color: 'bg-lime-500', avatarSeed: 'Liam' },
    { name: 'Mei', language: 'Chinese', color: 'bg-rose-500', avatarSeed: 'Mei' },
];

// --- CSS PARA LA ANIMACIÓN DEL GRID ---
const animationStyles = `
  @keyframes scroll-x {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Solo se mueve en el eje X */
  }
  .animate-scroll-x {
    animation: scroll-x 60s linear infinite;
  }
`;

// --- SUB-COMPONENTE: Tarjeta de Personalidad ---
const PersonalityCard = ({ p }: { p: typeof personalities[0] }) => (
    <div className={`w-64 h-72 rounded-3xl ${p.color} p-4 pb-0 flex flex-col justify-between shadow-2xl`}>
        <div className="text-white text-center">
            <h3 className="text-2xl font-bold">{p.name}</h3>
            <p className="flex items-center justify-center gap-1.5 font-semibold text-white/80 text-center">
                {p.language} 
                <span className="w-4 h-4 rounded-full bg-black/20 text-xs flex items-center justify-center">🇪🇸</span>
            </p>
        </div>
        <div className="relative self-center w-40 h-40">
            <Image 
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${p.avatarSeed}`}
                alt={`Avatar of ${p.name}`}
                layout="fill"
                unoptimized
            />
        </div>
    </div>
);

// --- SUB-COMPONENTE: Grid Animado ---
const AnimatedGrid = () => (
    // Se eliminó la rotación y se ajustó el layout a Flexbox para un movimiento horizontal
    <div className="absolute top-0 left-0 flex space-x-6 - animate-scroll-x">
        {/* Se duplica el contenido para crear el bucle infinito */}
        {[...personalities, ...personalities].map((p, index) => (
            <div key={`${p.name}-1-${index}`} className="flex flex-col space-y-6">
                <PersonalityCard p={p} />
                <PersonalityCard p={personalities[(index + 4) % personalities.length]} />
                <PersonalityCard p={personalities[(index + 8) % personalities.length]} />
                <PersonalityCard p={personalities[(index + 12) % personalities.length]} />
                <PersonalityCard p={personalities[(index + 16) % personalities.length]} />
            </div>
        ))}
    </div>
);


// --- SUB-COMPONENTE: Contenido Principal (Hero) ---
const HeroContent = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <div className="relative z-10 w-full h-full flex flex-col justify-end items-start p-6 sm:p-12 md:p-20 text-left">
            <div className="max-w-xl flex flex-col items-start gap-6">
                <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold leading-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    Speak with<br/>Endless<br/>Personalities
                </h1>
                <p className={`text-xl sm:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Learn languages for fun
                </p>
                <div className="flex flex-col items-start gap-3 mt-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl font-bold text-2xl shadow-lg transition-transform hover:scale-105">
                        <span>Sign Up for Free</span>
                        <ArrowRight size={28} />
                    </button>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already a member? <a href="#" className={`underline ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const LandingPage: NextPage = () => {
  const { theme } = useTheme();
  return (
    <div className={`w-full h-screen relative font-cabin flex flex-col overflow-hidden transition-colors
        ${theme === 'dark' ? 'bg-[#232323]' : 'bg-gradient-to-b from-white to-purple-200'}`}
    >
        <style>{animationStyles}</style>

        <div className={`absolute inset-0 transition-opacity -rotate-12 -translate-x-1/2 ${theme === 'dark' ? 'opacity-40' : 'opacity-80'}`}>
            <AnimatedGrid />
        </div>
        
        <div className={`absolute inset-0 
            ${theme === 'dark' 
                ? 'bg-gradient-to-t from-[#232323] to-purple-900/30' 
                : 'bg-gradient-to-t from-purple-200 via-purple-200/50 to-transparent'}`
        }></div>

        <HeroContent />
    </div>
  );
};

export default LandingPage;