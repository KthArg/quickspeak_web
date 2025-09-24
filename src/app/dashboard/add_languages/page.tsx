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

// Lista de todos los idiomas disponibles para añadir
const availableLanguages: Language[] = [
  { id: 1, name: '漢語', flagUrl: 'https://unpkg.com/circle-flags/flags/cn.svg' },
  { id: 2, name: 'English', flagUrl: 'https://unpkg.com/circle-flags/flags/gb.svg' },
  { id: 3, name: 'Hindi', flagUrl: 'https://unpkg.com/circle-flags/flags/in.svg' },
  { id: 4, name: 'العربية', flagUrl: 'https://unpkg.com/circle-flags/flags/ae.svg' },
  { id: 5, name: 'Français', flagUrl: 'https://unpkg.com/circle-flags/flags/fr.svg' },
  { id: 6, name: 'Русский', flagUrl: 'https://unpkg.com/circle-flags/flags/ru.svg' },
];

// --- SUB-COMPONENTE: Icono de Idioma ---
const LanguageIcon = ({ lang, isAdded, onClick }: { lang: Language, isAdded: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    disabled={isAdded}
    className={`flex flex-col items-center gap-2 text-center transition-all ${isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
  >
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full">
      <Image src={lang.flagUrl} alt={`${lang.name} flag`} layout="fill" className="rounded-full object-cover" />
    </div>
    <span className="font-bold text-lg text-white">{lang.name}</span>
  </button>
);

// --- SUB-COMPONENTE: Tarjeta para Añadir Más ---
const AddMoreCard = () => (
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

// --- SUB-COMPONENTE: Modal de Confirmación ---
const ConfirmationModal = ({ lang, onConfirm, onClose }: { lang: Language, onConfirm: (lang: Language) => void, onClose: () => void }) => (
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
          onClick={() => onConfirm(lang)} 
          className="w-full bg-cyan-400 text-black rounded-full py-2.5 font-bold text-lg transition-colors"
        >
          Add to Language List
        </button>
        <p className="text-xs text-gray-400 max-w-xs">
            This will allow you to start learning {lang.name}. You can always remove languages later.
            <br/><br/>
            If you wish to make this your native language you must add it to your language list.
        </p>
      </div>
    </div>
  </div>
);


const AddLanguagePage: NextPage = () => {
  // Simula los idiomas que el usuario ya tiene
  const [userLanguages, setUserLanguages] = useState<string[]>(['English']); 
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleAddLanguage = useCallback((lang: Language) => {
    setUserLanguages(prev => [...prev, lang.name]);
    setSelectedLanguage(null); // Cierra el modal
    // Aquí iría la lógica para añadir el idioma en el backend
    alert(`${lang.name} has been added to your list!`);
  }, []);
  
  const handleIconClick = (lang: Language) => {
    if (!userLanguages.includes(lang.name)) {
        setSelectedLanguage(lang);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#7C01F6A3] text-white font-cabin flex flex-col items-center p-6 md:p-10">
        <header className="text-center mb-10 sm:mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mt-10">Add a Language</h1>
        </header>

        <main className="w-full max-w-4xl flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
                {availableLanguages.map(lang => (
                    <LanguageIcon 
                        key={lang.id} 
                        lang={lang} 
                        isAdded={userLanguages.includes(lang.name)}
                        onClick={() => handleIconClick(lang)}
                    />
                ))}
            </div>
        </main>
        
        <footer className="mt-16 w-full flex justify-center">
            <AddMoreCard />
        </footer>

        {selectedLanguage && (
            <ConfirmationModal
                lang={selectedLanguage}
                onConfirm={handleAddLanguage}
                onClose={() => setSelectedLanguage(null)}
            />
        )}
    </div>
  );
};

export default AddLanguagePage;