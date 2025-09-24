"use client";

import React, { useState, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import { MessageSquare, Bookmark } from 'lucide-react';

// --- DATOS FICTICIOS Y ESTRUCTURAS DE TIPO ---
type Translation = { language: string; word: string; color: string; };
type Word = {
  id: number;
  word: string;
  color: string;
  translated: boolean;
  translations: Translation[];
};

const initialWords: Word[] = [
  { id: 1, word: 'Punta', color: 'bg-red-500', translated: false, translations: [{ language: 'English', word: 'Point', color: 'bg-yellow-500' }] },
  { id: 2, word: 'Toro', color: 'bg-sky-500', translated: true, translations: [{ language: 'English', word: 'Bull', color: 'bg-yellow-500' }] },
  { id: 3, word: 'Casa', color: 'bg-yellow-500', translated: true, translations: [{ language: 'English', word: 'House', color: 'bg-yellow-500' }] },
  { id: 4, word: 'Cantidad', color: 'bg-teal-400', translated: true, translations: [{ language: 'English', word: 'Quantity', color: 'bg-yellow-500' }] },
  { id: 5, word: 'Puente', color: 'bg-purple-500', translated: true, translations: [{ language: 'English', word: 'Bridge', color: 'bg-yellow-500' }] },
  { id: 6, word: 'Detalles', color: 'bg-red-500', translated: true, translations: [{ language: 'English', word: 'Details', color: 'bg-yellow-500' }] },
  { id: 7, word: 'Preocupación', color: 'bg-sky-500', translated: false, translations: [{ language: 'English', word: 'Worry', color: 'bg-yellow-500' }] },
  { id: 8, word: 'Creciente', color: 'bg-yellow-500', translated: true, translations: [{ language: 'English', word: 'Growing', color: 'bg-yellow-500' }] },
  { id: 9, word: 'Colgar', color: 'bg-teal-400', translated: false, translations: [{ language: 'English', word: 'Hang', color: 'bg-yellow-500' }] },
  { id: 10, word: 'Tarro', color: 'bg-purple-500', translated: true, translations: [{ language: 'English', word: 'Jar', color: 'bg-yellow-500' }] },
  { id: 11, word: 'Cuentagotas', color: 'bg-red-500', translated: true, translations: [{ language: 'English', word: 'Dropper', color: 'bg-yellow-500' }] },
  { id: 12, word: 'Perro', color: 'bg-sky-500', translated: false, translations: [ { language: 'English', word: 'Dog', color: 'bg-yellow-500' }, { language: 'Italian', word: 'Cane', color: 'bg-teal-400' }, { language: 'German', word: 'Hund', color: 'bg-red-500' } ] },
  // ... puedes añadir más palabras
];

// --- SUB-COMPONENTE: Etiqueta de Palabra ---
const WordTag = ({ word, onClick }: { word: Word, onClick: (word: Word) => void }) => (
    <button onClick={() => onClick(word)} className={`px-5 py-3 rounded-full font-bold text-xl sm:text-2xl shadow-md transition-transform hover:scale-105 ${word.color}`}>
        {word.word}
    </button>
);

// --- SUB-COMPONENTE: Modal de Detalles de la Palabra ---
const WordDetailModal = ({ word, onUpdate, onClose }: { word: Word, onUpdate: () => void, onClose: () => void }) => (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xs flex flex-col items-center">
            <div className="w-full bg-red-500 text-black font-bold rounded-t-3xl py-2 text-center text-lg">Spanish Word</div>
            <div className="w-full bg-[#232323] rounded-b-3xl p-6 flex flex-col items-center gap-6">
                <div className={`mt-2 px-8 py-2 rounded-full text-5xl font-bold shadow-lg ${word.translated ? 'bg-sky-500 text-black' : 'bg-red-500 text-white'}`}>
                    {word.word}
                </div>
                
                {word.translated ? (
                    <div className="flex flex-col items-center gap-3">
                        <h3 className="text-2xl font-bold text-sky-400">Your Languages</h3>
                        <div className="flex flex-col gap-2">
                            {word.translations.map(t => (
                                <div key={t.language} className={`flex items-center gap-4 px-4 py-1.5 rounded-full text-black font-bold text-2xl ${t.color}`}>
                                    <span>{t.word}</span>
                                    <span className="bg-white/60 border-2 border-gray-800 rounded-full px-2 py-0.5 text-lg">{t.language}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center gap-4">
                        <p className="text-gray-400 text-sm">This word hasn’t been translated yet, update the translations of your dictionary to get their meaning in all your languages.</p>
                        <button onClick={onUpdate} className="w-full bg-red-500 text-white rounded-full py-2 font-bold text-xl shadow-lg">Update Translations</button>
                    </div>
                )}
                
                <div className="w-full flex gap-4 text-xl font-bold">
                    <button onClick={onClose} className="flex-1 border-2 border-sky-400 text-sky-400 rounded-full py-1.5">Close</button>
                    <button className="flex-1 bg-red-500 text-black rounded-full py-1.5 border-2 border-red-500">Forget</button>
                </div>
            </div>
        </div>
    </div>
);


const DictionaryDetailPage: NextPage = () => {
    const [dictionaryWords, setDictionaryWords] = useState(initialWords);
    const [selectedWord, setSelectedWord] = useState<Word | null>(null);
    const [activeFilters, setActiveFilters] = useState(['Recently Added', 'Descending']);

    const needsTranslationUpdate = useMemo(() => dictionaryWords.some(word => !word.translated), [dictionaryWords]);

    const handleUpdateAll = () => {
        setDictionaryWords(prev => prev.map(word => ({ ...word, translated: true })));
        if (selectedWord) {
            setSelectedWord(prev => prev ? { ...prev, translated: true } : null);
        }
    };

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
    };

    return (
        <div className="w-full min-h-screen relative bg-gradient-to-b from-[#232323] bg-yellow-500/50 text-white font-cabin flex flex-col overflow-hidden">

            <main className="relative z-10 w-full max-w-4xl mx-auto flex-grow p-6 md:p-10 flex flex-col items-center gap-10 pb-32">
                <header className="w-full flex flex-col items-center gap-6">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-cyan-400 text-center mt-10">Dictionary (Spanish)</h1>
                    
                    {needsTranslationUpdate ? (
                        <div className="text-center">
                            <button onClick={handleUpdateAll} className="bg-red-500 text-white rounded-full px-6 py-2 font-bold text-xl shadow-lg transition-transform hover:scale-105">
                                Update Translations
                            </button>
                            <p className="text-xs text-gray-400 mt-2 max-w-xs">Note: If you don’t update the translations, you will only see the words you saved in their original language.</p>
                        </div>
                    ) : (
                         <p className="font-bold text-gray-300">All Translations Up to Date</p>
                    )}

                    <div className="flex items-center gap-3">
                        {['Recently Added', 'Descending'].map(filter => (
                             <button 
                                key={filter}
                                onClick={() => toggleFilter(filter)}
                                className={`px-4 py-1 rounded-full font-bold text-sm shadow-md transition-colors ${activeFilters.includes(filter) ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </header>

                <section className="flex flex-wrap justify-center gap-4">
                    {dictionaryWords.map(word => (
                        <WordTag key={word.id} word={word} onClick={setSelectedWord} />
                    ))}
                </section>
            </main>

            <footer className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-cyan-400 rounded-full flex items-center justify-center gap-12 sm:gap-16 py-3 px-8 sm:py-4 sm:px-12 shadow-2xl">
                    <button className="text-black hover:scale-110 transition-transform"><MessageSquare strokeWidth={2.5} className="w-7 h-7 sm:w-8 sm-8"/></button>
                    <button className="text-black hover:scale-110 transition-transform"><Bookmark strokeWidth={2.5} className="w-7 h-7 sm:w-8 sm:h-8"/></button>
                </div>
            </footer>
            
            {selectedWord && (
                <WordDetailModal word={selectedWord} onUpdate={handleUpdateAll} onClose={() => setSelectedWord(null)} />
            )}
        </div>
    );
};

export default DictionaryDetailPage;