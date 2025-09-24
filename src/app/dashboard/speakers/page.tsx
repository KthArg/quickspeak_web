"use client";

import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Plus, PlusCircle, MessageSquare, Bookmark, RotateCw } from 'lucide-react';

// --- DATOS FICTICIOS (sin cambios) ---
const savedSpeakersData = [
  { name: 'Mei', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mei', flagUrl: 'https://unpkg.com/circle-flags/flags/cn.svg' },
  { name: 'Eisan', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Eisan', flagUrl: 'https://unpkg.com/circle-flags/flags/br.svg' },
  { name: 'Harper', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Harper', flagUrl: 'https://unpkg.com/circle-flags/flags/de.svg' },
  { name: 'Alex', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex', flagUrl: 'https://unpkg.com/circle-flags/flags/mx.svg' },
  { name: 'Alejandro', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alejandro', flagUrl: 'https://unpkg.com/circle-flags/flags/cr.svg' },
];
const mockRecentChats = [
    { id: 1, name: 'Mei', lastMessage: "Hey, what's up?", timestamp: '4 min', unread: true, colorClass: 'from-red-500 to-pink-500', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mei', flagUrl: 'https://unpkg.com/circle-flags/flags/cn.svg' },
    { id: 2, name: 'Eisan', lastMessage: 'That sounds cool. What...', timestamp: '35 min', unread: true, colorClass: 'from-yellow-500 to-orange-500', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Eisan', flagUrl: 'https://unpkg.com/circle-flags/flags/br.svg' },
    { id: 3, name: 'Harper', lastMessage: 'I like to do a lot of different...', timestamp: '39 min', unread: true, colorClass: 'from-teal-500 to-green-500', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Harper', flagUrl: 'https://unpkg.com/circle-flags/flags/de.svg' },
    { id: 4, name: 'Alejandro', lastMessage: "That's awesome.", timestamp: 'Today', unread: false, colorClass: 'from-sky-500 to-blue-600', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alejandro', flagUrl: 'https://unpkg.com/circle-flags/flags/cr.svg' },
    { id: 5, name: 'Alex', lastMessage: 'Okay, sounds good!', timestamp: 'Today', unread: false, colorClass: 'from-indigo-500 to-purple-600', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex', flagUrl: 'https://unpkg.com/circle-flags/flags/mx.svg' },
];

// --- SUB-COMPONENTE (sin cambios) ---
const ChatListItem = ({ name, lastMessage, timestamp, unread, colorClass, avatarUrl, flagUrl }: typeof mockRecentChats[0]) => (
  <button className={`w-full flex items-center p-2 sm:p-3 rounded-2xl shadow-lg bg-gradient-to-r ${colorClass} transition-transform hover:scale-[1.02]`}>
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0">
      <Image src={flagUrl} alt={`${name}'s country flag`} layout="fill" className="rounded-full object-cover" />
      <Image src={avatarUrl} alt={`Avatar of ${name}`} layout="fill" className="rounded-full" unoptimized={true} />
    </div>
    <div className="flex-grow flex flex-col items-start ml-3 sm:ml-4 text-left">
      <span className="font-bold text-md sm:text-lg">{name}</span>
      <span className="text-white/80 text-sm sm:text-md truncate max-w-[120px] sm:max-w-xs">{lastMessage}</span>
    </div>
    <div className="flex flex-col items-end gap-2 text-right ml-auto pl-2">
      <span className="text-xs sm:text-sm text-white/90">{timestamp}</span>
      {unread && <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-white/50"></div>}
    </div>
  </button>
);


const SpeakersPageV2: NextPage = () => {
  const [savedSpeakers, setSavedSpeakers] = useState(savedSpeakersData);
  const [recentChats, setRecentChats] = useState(mockRecentChats);

  const onSpeakerCatalogClick = useCallback(() => alert("Open speaker catalog!"), []);
  const onAddSpeakerClick = useCallback(() => alert("Add a new speaker!"), []);

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] to-[#2c006e] text-white font-cabin flex flex-col overflow-x-hidden">

      {/* CAMBIO 1: Convertimos <main> en un grid y quitamos el padding. */}
      {/* El padding se define ahora en las columnas del grid. */}
      {/* grid-cols-[1fr,min(1280px,100%),1fr] -> Columna central de máximo 1280px (o el ancho de la pantalla), con las laterales flexibles */}
      {/* La versión para este layout es: col-izq, col-central, col-der */}
      {/* minmax(1.5rem, 1fr) -> La col. lateral tiene MÍNIMO 1.5rem (24px, como p-6), y crece si hay espacio. */}
      {/* minmax(0, 1280px) -> La col. central se encoge hasta 0 y tiene un MÁXIMO de 1280px. */}
      <main className="relative z-10 grid grid-cols-[minmax(1.5rem,1fr)_minmax(0,1280px)_minmax(1.5rem,1fr)] md:grid-cols-[minmax(2.5rem,1fr)_minmax(0,1280px)_minmax(2.5rem,1fr)] w-full flex-grow pt-6 md:pt-10 pb-32">
        
        {/* CAMBIO 2: Hacemos que CADA sección hija del grid ocupe solo la columna central (col-start-2) */}
        {/* Así mantenemos el layout original sin usar padding. */}
        <header className="flex flex-col items-start gap-6 col-start-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400">
            Speakers
          </h1>
          <button
            onClick={onSpeakerCatalogClick}
            className="flex items-center justify-between gap-3 w-full sm:w-auto bg-cyan-500 rounded-full pl-4 pr-2 py-2 sm:pl-6 sm:pr-3 sm:py-2.5 shadow-lg transition-transform hover:scale-105"
          >
            <span className="text-md sm:text-lg font-bold">Speaker Catalog</span>
            <div className="bg-white rounded-full p-0.5">
              <PlusCircle size={28} className="text-cyan-500" />
            </div>
          </button>
        </header>

        <section className="flex flex-col items-start gap-4 mt-8 col-span-full col-start-2">
        {/* El título necesita su propio padding para alinearse con el resto. */}
        <div className="">
            <button className="bg-cyan-500/90 rounded-full px-5 py-2 text-md font-bold shadow flex items-center gap-2">
            Your Saved Speakers
            <div className="w-3 h-3 rounded-full bg-cyan-200 border-2 border-cyan-800"></div>
            </button>
        </div>
        
        {/* El contenedor de scroll ahora funciona correctamente porque su padre (`<section>`) es realmente de ancho completo. */}
        <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {/* El padding interno sigue siendo necesario para el espacio visual y el punto de snap. */}
            <div className="flex items-start gap-4 pt-2">
            {savedSpeakers.map((speaker) => (
                <div key={speaker.name} className="flex flex-col items-center gap-2 w-24 sm:w-28 flex-shrink-0 snap-start">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer transition-transform hover:scale-105">
                    <Image src={speaker.flagUrl} alt={`${speaker.name}'s flag`} layout="fill" className="rounded-full object-cover" />
                    <Image src={speaker.avatarUrl} alt={`${speaker.name}'s avatar`} layout="fill" className="rounded-full" unoptimized={true} />
                </div>
                <span className="text-md sm:text-lg font-semibold text-gray-200 text-center">{speaker.name}</span>
                </div>
            ))}
            <div className="flex flex-col items-center gap-2 w-24 sm:w-28 flex-shrink-0 snap-start">
                <button onClick={onAddSpeakerClick} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-800/60 flex items-center justify-center transition-colors hover:bg-gray-700/80">
                <Plus size={40} className="text-gray-400" />
                </button>
                <span className="text-md sm:text-lg font-semibold text-gray-300">Add</span>
            </div>
            </div>
        </div>
        </section>

        <section className="flex flex-col items-start gap-4 mt-8 col-start-2">
          <div className="flex items-center gap-2 bg-red-500 rounded-full px-4 py-1.5 shadow-lg">
            <span className="text-md font-bold">Recents</span>
            <RotateCw size={16} className="text-white/80" />
          </div>

          {recentChats.length > 0 ? (
            <div className="w-full flex flex-col gap-3">
              {recentChats.map(chat => (
                <ChatListItem key={chat.id} {...chat} />
              ))}
            </div>
          ) : (
            <button 
              onClick={onAddSpeakerClick}
              className="w-full max-w-md p-0.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-shadow"
            >
              <div className="bg-[#31115e] rounded-[14px] flex items-center gap-4 sm:gap-5 p-3 sm:p-4">
                <div className="bg-purple-600 rounded-full p-2 sm:p-3 shadow-md">
                  <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-bold">Add a Speaker</p>
                  <p className="text-gray-300 text-sm sm:text-base">Tap here to pick a personality</p>
                </div>
              </div>
            </button>
          )}
        </section>
      </main>

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

export default SpeakersPageV2;