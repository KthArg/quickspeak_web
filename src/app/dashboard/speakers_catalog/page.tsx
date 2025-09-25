"use client";

import { useState, useMemo, useCallback } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useTheme } from '@/app/contexts/ThemeContext';

// --- DATOS (SIN CAMBIOS) ---
const speakersData = [
    { id: 1, name: 'Burkhart', language: 'German', flagEmoji: '🇩🇪', avatarSeed: 'Burkhart', personality: ['😐 Neutral', '😇 Polite'], interests: ['🎸 Metal Music', '🎭 Theater', '🏋️‍♂️ Weightlifting'], colorClasses: { bg: 'bg-[#06d6a0]', cardBg: 'bg-[#50f9c2]', text: 'text-gray-800', border:'border-[#06d6a0]' } },
    { id: 2, name: 'Leonie', language: 'French', flagEmoji: '🇫🇷', avatarSeed: 'Leonie', personality: ['🤝 Friendly', '🤪 Goofy'], interests: ['🗻 Hiking', '🎵 Pop Music', '🐘 Elephants'], colorClasses: { bg: 'bg-[#ef476f]', cardBg: 'bg-[#fe6788]', text: 'text-white', border:'border-[#ef476f]' } },
    { id: 3, name: 'Marta', language: 'Spanish', flagEmoji: '🇪🇸', avatarSeed: 'Marta', personality: ['🧐 Curious', '☺ Kind'], interests: ['🍳 Gourmet Food', '🎞 Old Cinema', '🎓 Education'], colorClasses: { bg: 'bg-[#ffd166]', cardBg: 'bg-[#ffe08a]', text: 'text-gray-800', border:'border-[#ffd166]' } },
    { id: 4, name: 'Aarav', language: 'Hindi', flagEmoji: '🇮🇳', avatarSeed: 'Aarav', personality: ['🧘‍♂️ Calm', '💡 Insightful'], interests: ['🏏 Cricket', '🌶️ Spicy Food', '🎬 Bollywood'], colorClasses: { bg: 'bg-orange-500', cardBg: 'bg-orange-400', text: 'text-white', border:'border-orange-500' } },
    { id: 5, name: 'Marco', language: 'Italian', flagEmoji: '🇮🇹', avatarSeed: 'Marco', personality: ['😎 Confident', '🍝 Passionate'], interests: ['⚽ Soccer', '🏛️ History', '🍷 Fine Wine'], colorClasses: { bg: 'bg-blue-500', cardBg: 'bg-blue-400', text: 'text-white', border:'border-blue-500' } },
    { id: 6, name: 'Sofia', language: 'Portuguese', flagEmoji: '🇧🇷', avatarSeed: 'Sofia', personality: ['🎉 Energetic', '🎨 Creative'], interests: ['💃 Samba', '🏖️ Beaches', '📸 Photography'], colorClasses: { bg: 'bg-green-500', cardBg: 'bg-green-400', text: 'text-white', border:'border-green-500' } },
    { id: 7, name: 'Kenji', language: 'Japanese', flagEmoji: '🇯🇵', avatarSeed: 'Kenji', personality: ['🙏 Respectful', '💻 Tech-savvy'], interests: ['🍣 Sushi', '🌸 Anime', '🕹️ Video Games'], colorClasses: { bg: 'bg-red-400', cardBg: 'bg-red-300', text: 'text-gray-800', border:'border-red-400' } },
    { id: 8, name: 'Fatima', language: 'Arabic', flagEmoji: '🇦🇪', avatarSeed: 'Fatima', personality: ['👑 Gracious', ' hospitable'], interests: ['☕ Coffee', '🖋️ Poetry', '🏜️ Desert Camping'], colorClasses: { bg: 'bg-purple-500', cardBg: 'bg-purple-400', text: 'text-white', border:'border-purple-500' } },
    { id: 9, name: 'Dmitri', language: 'Russian', flagEmoji: '🇷🇺', avatarSeed: 'Dmitri', personality: ['💪 Stoic', '🤔 Philosophical'], interests: ['📚 Literature', '♟️ Chess', '❄️ Winter Sports'], colorClasses: { bg: 'bg-sky-600', cardBg: 'bg-sky-500', text: 'text-white', border:'border-sky-600' } },
    { id: 10, name: 'Chloe', language: 'English', flagEmoji: '🇬🇧', avatarSeed: 'Chloe', personality: [' witty', ' sarcastic'], interests: ['🎸 Indie Rock', '🌧️ Rainy Days', '☕ Tea'], colorClasses: { bg: 'bg-indigo-500', cardBg: 'bg-indigo-400', text: 'text-white', border:'border-indigo-500' } },
    { id: 11, name: 'Liam', language: 'Irish', flagEmoji: '🇮🇪', avatarSeed: 'Liam', personality: ['😂 Humorous', ' storytelling'], interests: ['🎻 Folk Music', '🍻 Pubs', '🍀 Mythology'], colorClasses: { bg: 'bg-emerald-500', cardBg: 'bg-emerald-400', text: 'text-white', border:'border-emerald-500' } },
    { id: 12, name: 'Hao', language: 'Chinese', flagEmoji: '🇨🇳', avatarSeed: 'Hao', personality: [' diligent', ' ambitious'], interests: ['🏓 Table Tennis', '🍵 Tea Ceremony', '📈 Business'], colorClasses: { bg: 'bg-rose-500', cardBg: 'bg-rose-400', text: 'text-white', border:'border-rose-500' } },
];
const initialLanguages = [
    { name: 'French', flag: '🇫🇷', active: false, color: 'bg-red-500 text-white' },
    { name: 'Spanish', flag: '🇪🇸', active: false, color: 'bg-red-500 text-white' },
    { name: 'German', flag: '🇩🇪', active: false, color: 'bg-red-500 text-white' },
    { name: 'Hindi', flag: '🇮🇳', active: false, color: 'bg-red-500 text-white' },
    { name: 'Italian', flag: '🇮🇹', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Portuguese', flag: '🇧🇷', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Japanese', flag: '🇯🇵', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Arabic', flag: '🇦🇪', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Russian', flag: '🇷🇺', active: false, color: 'bg-red-500 text-white'  },
    { name: 'English', flag: '🇬🇧', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Irish', flag: '🇮🇪', active: false, color: 'bg-red-500 text-white'  },
    { name: 'Chinese', flag: '🇨🇳', active: false, color: 'bg-red-500 text-white'  },
];

// --- SUB-COMPONENTE PARA LAS TARJETAS DE SPEAKER ---
const SpeakerCard = ({ speaker, isBlurred, onMouseEnter, onMouseLeave }: { 
    speaker: typeof speakersData[0],
    isBlurred: boolean,
    onMouseEnter: () => void,
    onMouseLeave: () => void
}) => {
    const { theme } = useTheme();
    return (
        <div 
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`rounded-3xl flex shadow-lg overflow-hidden transition-all duration-300 ease-in-out
                ${isBlurred ? 'blur-md scale-95' : 'scale-100'}
                ${theme === 'dark' ? `${speaker.colorClasses.bg}` : ` bg-white border-4 ${speaker.colorClasses.border}`}
            `}
        >
            <div className={`w-2/5 flex-shrink-0 flex flex-col justify-between items-center p-4 pb-0 ${speaker.colorClasses.cardBg} rounded-r-3xl`}>
                <div className="text-center text-gray-800">
                    <h3 className="text-2xl font-bold">{speaker.name}</h3>
                    <p className="flex items-center justify-center gap-1 font-semibold">{speaker.language} <span>{speaker.flagEmoji}</span></p>
                </div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                     <Image src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`} alt={`Avatar of ${speaker.name}`} layout="fill" unoptimized={true} />
                </div>
            </div>
            <div className={`w-3/5 p-4 flex flex-col gap-3 ${theme === 'dark' ? speaker.colorClasses.text : 'text-gray-800'}`}>
                <div><h4 className="font-bold text-lg">Personality</h4><ul className="mt-1 space-y-1 text-md">{speaker.personality.map(p => <li key={p}>{p}</li>)}</ul></div>
                <div><h4 className="font-bold text-lg">Interests</h4><ul className="mt-1 space-y-1 text-md">{speaker.interests.map(i => <li key={i}>{i}</li>)}</ul></div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTE PARA LOS BOTONES DE FILTRO ---
const LanguageFilter = ({ lang, onToggle }: { lang: typeof initialLanguages[0], onToggle: (name: string) => void }) => {
    const { theme } = useTheme();
    return (
        <button
            onClick={() => onToggle(lang.name)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-md font-bold transition-all shadow-md
                ${lang.active 
                    ? (theme === 'dark' ? lang.color : `${lang.color.replace('text-white', 'text-black')} border-2 border-gray-800/50`)
                    : (theme === 'dark' ? 'border-2 border-dashed border-gray-500 text-gray-400 hover:bg-gray-700' : 'border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100')}`
            }
        >
            <span>{lang.name}</span>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${lang.active ? (theme === 'dark' ? 'bg-black/20' : 'bg-white/50') : 'bg-gray-500'}`}>
                {lang.flag}
            </span>
        </button>
    );
};


const SpeakerCatalogPage: NextPage = () => {
    const { theme } = useTheme();
    const [languages, setLanguages] = useState(initialLanguages);
    const [hoveredSpeakerId, setHoveredSpeakerId] = useState<number | null>(null);

    const handleLanguageToggle = useCallback((langName: string) => {
        setLanguages(prevLangs => prevLangs.map(lang => lang.name === langName ? { ...lang, active: !lang.active } : lang));
    }, []);

    const filteredSpeakers = useMemo(() => {
        const activeLangs = languages.filter(l => l.active).map(l => l.name);
        if (activeLangs.length === 0) return speakersData;
        return speakersData.filter(speaker => activeLangs.includes(speaker.language));
    }, [languages]);

    return (
        <div className={`w-full min-h-screen font-cabin p-6 sm:p-10 transition-colors
            ${theme === 'dark' ? 'bg-gradient-to-b from-[#232323] to-[#2c006e] text-white' : 'bg-white bg-gradient-to-b to-[#7C01F6A3] text-black'}`}
        >
            <header className="text-center mb-8">
                <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'}`}>Speaker Catalog</h1>
            </header>
            
            <nav className="flex flex-wrap items-center justify-center gap-3 mb-10">
                {languages.map(lang => <LanguageFilter key={lang.name} lang={lang} onToggle={handleLanguageToggle} />)}
            </nav>

            <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredSpeakers.map(speaker => (
                    <SpeakerCard 
                        key={`${speaker.id}-${speaker.name}`} 
                        speaker={speaker}
                        isBlurred={hoveredSpeakerId !== null && hoveredSpeakerId !== speaker.id}
                        onMouseEnter={() => setHoveredSpeakerId(speaker.id)}
                        onMouseLeave={() => setHoveredSpeakerId(null)}
                    />
                ))}
            </main>
        </div>
    );
};

export default SpeakerCatalogPage;