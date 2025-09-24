"use client";

import type { NextPage } from 'next';
import Image from 'next/image';
import { Languages, MessageSquare, Bookmark } from 'lucide-react';

// --- DATOS FICTICIOS PARA LOS DICCIONARIOS ---
const dictionariesData = [
  { id: 1, language: 'Mandarin', wordCount: 40, flagUrl: 'https://unpkg.com/circle-flags/flags/cn.svg', color: 'bg-red-500' },
  { id: 2, language: 'Portuguese', wordCount: 122, flagUrl: 'https://unpkg.com/circle-flags/flags/br.svg', color: 'bg-yellow-500' },
  { id: 3, language: 'German', wordCount: 2, flagUrl: 'https://unpkg.com/circle-flags/flags/de.svg', color: 'bg-teal-400' },
  { id: 4, language: 'Spanish', wordCount: 81, flagUrl: 'https://unpkg.com/circle-flags/flags/cr.svg', color: 'bg-sky-500' },
];

// --- SUB-COMPONENTE: Tarjeta de Diccionario ---
const DictionaryCard = ({ dictionary }: { dictionary: typeof dictionariesData[0] }) => (
  <button className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] ${dictionary.color}`}>
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 bg-white/20 p-1">
      <Image src={dictionary.flagUrl} alt={`${dictionary.language} flag`} layout="fill" className="rounded-full object-cover" />
    </div>
    <div className="flex-grow flex flex-col items-start ml-4 text-left text-white">
      <h3 className="font-bold text-2xl sm:text-3xl">{dictionary.language}</h3>
      <p className="font-semibold text-white/80 text-md sm:text-lg">{dictionary.wordCount} words saved</p>
    </div>
  </button>
);


const DictionaryPage: NextPage = () => {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#2c006e] text-white font-cabin flex flex-col overflow-hidden">
      
      {/* Brillo de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent"></div>

      {/* Contenedor principal */}
      <main className="relative z-10 w-full max-w-5xl mx-auto flex-grow p-6 md:p-10 flex flex-col gap-8 pb-32">
        <header className="flex flex-col items-start gap-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-cyan-400">
            Dictionary
          </h1>
          <div className="bg-red-500 rounded-full px-4 py-1.5 shadow">
            <span className="text-md font-bold">Choose a Dictionary</span>
          </div>
        </header>

        <section className="w-full flex flex-col gap-4">
          {/* Mapeo de los diccionarios existentes */}
          {dictionariesData.map(dict => (
            <DictionaryCard key={dict.id} dictionary={dict} />
          ))}

          {/* Botón para añadir más idiomas */}
          <button className="w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg border-2 border-dashed border-purple-500 text-purple-300 transition-colors hover:bg-purple-500/10 hover:border-purple-400">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center">
              <Languages size={40} className="text-purple-400" />
            </div>
            <div className="flex-grow flex flex-col items-start ml-4 text-left">
              <h3 className="font-bold text-2xl sm:text-3xl">More Languages</h3>
              <p className="font-semibold text-purple-300/80 text-md sm:text-lg">Tap here to add another language</p>
            </div>
          </button>
        </section>
      </main>

      {/* Barra de navegación inferior fija */}
      <footer className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-cyan-400 rounded-full flex items-center justify-center gap-12 sm:gap-16 py-3 px-8 sm:py-4 sm:px-12 shadow-2xl">
            <button className="text-black hover:scale-110 transition-transform">
                <MessageSquare strokeWidth={2.5} className="w-7 h-7 sm:w-8 sm:h-8"/>
            </button>
            <button className="text-black hover:scale-110 transition-transform">
                <Bookmark strokeWidth={2.5} className="w-7 h-7 sm:w-8 sm:h-8"/>
            </button>
        </div>
      </footer>
    </div>
  );
};

export default DictionaryPage;