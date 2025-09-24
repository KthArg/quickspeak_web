"use client";

import React, { useState, useCallback } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { Languages, X } from 'lucide-react';

// --- DATOS INICIALES Y ESTRUCTURAS DE TIPO ---
type Language = {
  id: number;
  name: string;
  flagUrl: string;
};

const initialLanguages: Language[] = [
  { id: 1, name: 'English', flagUrl: 'https://unpkg.com/circle-flags/flags/gb.svg' },
  { id: 2, name: 'Português', flagUrl: 'https://unpkg.com/circle-flags/flags/br.svg' },
  { id: 3, name: 'Deutsch', flagUrl: 'https://unpkg.com/circle-flags/flags/de.svg' },
  { id: 4, name: 'Italian', flagUrl: 'https://unpkg.com/circle-flags/flags/it.svg' },
  { id: 5, name: 'Español', flagUrl: 'https://unpkg.com/circle-flags/flags/cr.svg' },
];

// --- SUB-COMPONENTE: Icono de Idioma ---
const LanguageIcon = ({ lang, isNative, onClick }: { lang: Language, isNative: boolean, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 text-center transition-transform hover:scale-105">
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full">
      <Image src={lang.flagUrl} alt={`${lang.name} flag`} layout="fill" className="rounded-full object-cover" />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-lg text-white">{lang.name}</span>
      {isNative && <span className="font-semibold text-sm text-cyan-400">Native</span>}
    </div>
  </button>
);

// --- SUB-COMPONENTE: Tarjeta para Añadir Idioma ---
const AddLanguageCard = () => (
    <button className="w-full max-w-sm sm:max-w-md flex items-center p-3 sm:p-4 rounded-2xl shadow-lg bg-cyan-500/80 transition-transform hover:scale-[1.02]">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 bg-gray-700/50 flex items-center justify-center">
            <Languages size={40} className="text-cyan-200" />
        </div>
        <div className="flex-grow flex flex-col items-start ml-4 text-left text-black">
            <h3 className="font-bold text-xl sm:text-2xl">More Languages</h3>
            <p className="font-semibold text-gray-800 text-sm sm:text-md">Tap here to add another language</p>
        </div>
    </button>
);

// --- SUB-COMPONENTE: Modal de Opciones de Idioma ---
const LanguageModal = ({ lang, isNative, onMakeNative, onRemove, onClose }: { lang: Language, isNative: boolean, onMakeNative: (id: number) => void, onRemove: (id: number) => void, onClose: () => void }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-xs flex flex-col items-center gap-4 p-6 rounded-3xl bg-gray-800 border-2 border-cyan-400/50 shadow-2xl">
      <button onClick={onClose} className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 border-2 border-cyan-400/50 text-cyan-400 rounded-full text-sm font-semibold hover:bg-cyan-400/10">
        <X size={16} /> Close
      </button>
      
      <div className="relative w-28 h-28 rounded-full mt-6">
        <Image src={lang.flagUrl} alt={`${lang.name} flag`} layout="fill" className="rounded-full object-cover" />
      </div>
      
      <h2 className="text-3xl font-bold text-white">{lang.name}</h2>
      
      <div className="w-full flex flex-col items-center gap-3 text-center">
        <button 
          onClick={() => onMakeNative(lang.id)} 
          disabled={isNative}
          className="w-full bg-cyan-400 text-black rounded-full py-2.5 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isNative ? 'Current Native Language' : 'Make Native Language'}
        </button>
        <p className="text-xs text-gray-400 max-w-xs">This will make this the language in which clarifications are given to you.</p>
      </div>

      {!isNative && (
        <button 
          onClick={() => onRemove(lang.id)}
          className="w-full bg-transparent border-2 border-red-500 text-red-500 rounded-full py-2 font-bold text-lg hover:bg-red-500/10 transition-colors"
        >
          Remove from Languages
        </button>
      )}
    </div>
  </div>
);


const LanguagesPage: NextPage = () => {
  const [languages, setLanguages] = useState(initialLanguages);
  const [nativeLanguageId, setNativeLanguageId] = useState(1); // English es nativo por defecto
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleMakeNative = useCallback((id: number) => {
    setNativeLanguageId(id);
    setSelectedLanguage(null); // Cierra el modal
  }, []);

  const handleRemoveLanguage = useCallback((id: number) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id));
    setSelectedLanguage(null); // Cierra el modal
  }, []);
  
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#7C01F6A3] text-white font-cabin flex flex-col items-center p-6 md:p-10">
        <header className="text-center mb-10 sm:mb-16">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-cyan-400">Languages</h1>
        </header>

        <main className="w-full max-w-4xl flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                {languages.map(lang => (
                    <LanguageIcon 
                        key={lang.id} 
                        lang={lang} 
                        isNative={lang.id === nativeLanguageId}
                        onClick={() => setSelectedLanguage(lang)}
                    />
                ))}
            </div>
        </main>
        
        <footer className="mt-16 w-full flex justify-center">
            <AddLanguageCard />
        </footer>

        {selectedLanguage && (
            <LanguageModal
                lang={selectedLanguage}
                isNative={selectedLanguage.id === nativeLanguageId}
                onMakeNative={handleMakeNative}
                onRemove={handleRemoveLanguage}
                onClose={() => setSelectedLanguage(null)}
            />
        )}
    </div>
  );
};

export default LanguagesPage;