"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// --- CSS para la animación del botón (igual que antes) ---
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

// Mismos datos de idiomas
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

const DarkModePickLanguagesToLearn: NextPage = () => {
  // --- CAMBIO PRINCIPAL: El estado ahora es un array de strings ---
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // --- Lógica para AÑADIR o QUITAR un idioma de la selección ---
  const handleToggleLanguage = (languageName: string) => {
    setSelectedLanguages((prevSelected) => {
      // Si el idioma ya está seleccionado, lo quitamos (deselección)
      if (prevSelected.includes(languageName)) {
        return prevSelected.filter((lang) => lang !== languageName);
      }
      // Si no está seleccionado, lo añadimos
      return [...prevSelected, languageName];
    });
  };

  const handleContinue = () => {
    if (selectedLanguages.length > 0) {
      alert(`Continuing with: ${selectedLanguages.join(', ')}`);
      // Lógica para navegar a la siguiente página
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#232323] overflow-hidden text-white font-cabin flex flex-col items-center justify-center p-4 sm:p-6">
      <style>{animationStyles}</style>

      {/* --- CAMBIO DE COLOR: El difuminado ahora es ROJO --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-[#EF476FA3] w-full h-full rounded-full [filter:blur(500px)]"></div>
      
      <ArrowLeft className="absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 text-white cursor-pointer z-20" />

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10 md:gap-12 py-10">
        <div className="w-full flex flex-col items-center text-center gap-2">
          {/* --- CAMBIO DE TEXTO: Nuevo título y subtítulo --- */}
          <h1 className="text-4xl md:text-5xl font-semibold">
            Languages to learn
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Which languages do you want to start with?
          </p>
        </div>

        <div className="w-full max-w-xl grid grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12 md:gap-x-70">
          {languages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => handleToggleLanguage(lang.name)}
              className="flex flex-col items-center gap-3 text-center transition-transform hover:scale-105 focus:outline-none group"
            >
              <div
                // --- CAMBIO DE LÓGICA: Comprueba si el idioma está INCLUIDO en el array ---
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-lg
                  ${selectedLanguages.includes(lang.name) ? 'ring-4 ring-cyan-400' : 'ring-2 ring-transparent'}`}
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

        <div className="h-20 pt-4">
          {/* --- CAMBIO DE LÓGICA: El botón aparece si hay al menos UN idioma seleccionado --- */}
          {selectedLanguages.length > 0 && (
            <button
              onClick={handleContinue}
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

export default DarkModePickLanguagesToLearn;