"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// --- CSS de la animación inyectado directamente ---
const animationStyles = `
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }
`;

// Datos de los idiomas
const languages = [
  { name: 'English', src: 'https://unpkg.com/circle-flags/flags/gb.svg' },
  { name: 'Español', src: 'https://unpkg.com/circle-flags/flags/cr.svg' },
  { name: '漢語', src: 'https://unpkg.com/circle-flags/flags/cn.svg' },
  { name: 'Hindi', src: 'https://unpkg.com/circle-flags/flags/in.svg' },
  { name: 'Русский', src: 'https://unpkg.com/circle-flags/flags/ru.svg' },
  { name: 'Français', src: 'https://unpkg.com/circle-flags/flags/fr.svg' },
  { name: 'العربية', src: 'https://unpkg.com/circle-flags/flags/ae.svg' },
  { name: 'Português', src: 'https://unpkg.com/circle-flags/flags/br.svg' },
  { name: 'Deutsch', src: 'https://unpkg.com/circle-flags/flags/de.svg' },
  { name: 'Italian', src: 'https://unpkg.com/circle-flags/flags/it.svg' },
];

const DarkModePickNativeLanguage: NextPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleSelectLanguage = (languageName: string) => {
    setSelectedLanguage(languageName);
    console.log(`Selected native language: ${languageName}`);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      alert(`Continuing with: ${selectedLanguage}`);
      // Lógica para navegar a la siguiente página
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#232323] overflow-hidden text-white font-cabin flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Etiqueta <style> para inyectar el CSS de la animación */}
      <style>{animationStyles}</style>

      {/* Fondo con desenfoque morado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-[rgba(124,1,246,0.4)] w-full h-full rounded-full [filter:blur(600px)]"></div>
      
      {/* Ícono para volver */}
      <ArrowLeft className="absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 text-white cursor-pointer z-20" />

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10 md:gap-12 py-10">
        {/* Encabezado */}
        <div className="w-full flex flex-col items-center text-center gap-2">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Pick a Native Language
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            What language do you speak most right now?
          </p>
        </div>

        {/* Grid de idiomas */}
        <div className="w-full max-w-xl grid grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 md:gap-x-70">
          {languages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => handleSelectLanguage(lang.name)}
              className="flex flex-col items-center gap-3 text-center transition-transform hover:scale-105 focus:outline-none group"
            >
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-lg
                  ${selectedLanguage === lang.name ? 'ring-4 ring-cyan-400' : 'ring-2 ring-transparent'}`}
              >
                <Image
                  src={lang.src}
                  alt={`Flag of ${lang.name}`}
                  width={20}
                  height={20}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-gray-200 text-lg">
                {lang.name}
              </span>
            </button>
          ))}
        </div>

        {/* Contenedor del botón "Continue" */}
        <div className="h-20">
          {selectedLanguage && (
            <button
              onClick={handleContinue}
              // Usamos la clase que definimos en la etiqueta <style>
              className="animate-fade-in-up bg-[#18D2B4] text-[#073b4c] font-extrabold text-xl rounded-full py-3 px-10 flex items-center gap-2.5 hover:bg-[#14a892] transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default DarkModePickNativeLanguage;