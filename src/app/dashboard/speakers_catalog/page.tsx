'use client';

import type { NextPage } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Plus, PlusCircle, MessageSquare, Bookmark, RotateCw } from 'lucide-react';
import { apiClient, type Speaker, type RecentChat } from '@/app/lib/api';

type ColorToken =
  | 'teal' | 'pink' | 'yellow' | 'orange' | 'blue' | 'green'
  | 'red' | 'purple' | 'sky' | 'indigo' | 'emerald' | 'rose';

interface SpeakerUI extends Speaker {
  colorClasses: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
  };
}

const colorMap: Record<ColorToken, SpeakerUI['colorClasses']> = {
  teal: { bg: 'bg-[#06d6a0]', cardBg: 'bg-[#50f9c2]', text: 'text-gray-800', border: 'border-[#06d6a0]' },
  pink: { bg: 'bg-[#ef476f]', cardBg: 'bg-[#fe6788]', text: 'text-white', border: 'border-[#ef476f]' },
  yellow: { bg: 'bg-[#ffd166]', cardBg: 'bg-[#ffe08a]', text: 'text-gray-800', border: 'border-[#ffd166]' },
  orange: { bg: 'bg-orange-500', cardBg: 'bg-orange-400', text: 'text-white', border: 'border-orange-500' },
  blue: { bg: 'bg-blue-500', cardBg: 'bg-blue-400', text: 'text-white', border: 'border-blue-500' },
  green: { bg: 'bg-green-500', cardBg: 'bg-green-400', text: 'text-white', border: 'border-green-500' },
  red: { bg: 'bg-red-400', cardBg: 'bg-red-300', text: 'text-gray-800', border: 'border-red-400' },
  purple: { bg: 'bg-purple-500', cardBg: 'bg-purple-400', text: 'text-white', border: 'border-purple-500' },
  sky: { bg: 'bg-sky-600', cardBg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  indigo: { bg: 'bg-indigo-500', cardBg: 'bg-indigo-400', text: 'text-white', border: 'border-indigo-500' },
  emerald: { bg: 'bg-emerald-500', cardBg: 'bg-emerald-400', text: 'text-white', border: 'border-emerald-500' },
  rose: { bg: 'bg-rose-500', cardBg: 'bg-rose-400', text: 'text-white', border: 'border-rose-500' },
};

interface LanguageFilter {
  name: string;
  flag: string;
  active: boolean;
  color: string;
}

const SpeakersCatalogPage: NextPage = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [speakers, setSpeakers] = useState<SpeakerUI[]>([]);
  const [languages, setLanguages] = useState<LanguageFilter[]>([]);
  const [hoveredSpeakerId, setHoveredSpeakerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingSpeaker, setAddingSpeaker] = useState<string | null>(null);

  // Fetch speakers and derive languages
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<{ speakers: Speaker[] }>('/conversation/speakers/catalog');

        if (!isMounted) return;

        const speakersWithColors: SpeakerUI[] = data.speakers.map((s) => ({
          ...s,
          colorClasses: colorMap[s.color as ColorToken] || colorMap.teal,
        }));

        setSpeakers(speakersWithColors);

        // Derive unique languages from speakers
        const uniqueLangs = Array.from(
          new Set(data.speakers.map((s) => s.language))
        ).map((lang) => ({
          name: lang,
          flag: data.speakers.find((s) => s.language === lang)?.flagEmoji || '🏳️',
          active: false,
          color: 'bg-gray-500 text-white',
        }));

        setLanguages(uniqueLangs);
      } catch (err: any) {
        setError(err.message || 'Failed to load speakers');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLanguageToggle = useCallback((langName: string) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.name === langName ? { ...lang, active: !lang.active } : lang
      )
    );
  }, []);

  const handleSelectSpeaker = useCallback(async (speaker: SpeakerUI) => {
    try {
      setAddingSpeaker(speaker.id);
      await apiClient.post('/conversation/speakers', {
        id: speaker.id,
        name: speaker.name,
        avatarSeed: speaker.avatarSeed,
        flagEmoji: speaker.flagEmoji,
      });

      // Navigate to speakers page
      router.push('/dashboard/speakers');
    } catch (err: any) {
      alert(`Failed to add speaker: ${err.message}`);
    } finally {
      setAddingSpeaker(null);
    }
  }, [router]);

  const filteredSpeakers = useMemo(() => {
    const activeLangs = languages.filter((l) => l.active).map((l) => l.name);
    if (activeLangs.length === 0) return speakers;
    return speakers.filter((s) => activeLangs.includes(s.language));
  }, [languages, speakers]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#232323] text-white' : 'bg-white text-black'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-[#232323] text-red-400' : 'bg-white text-red-600'
      }`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen relative font-cabin p-6 sm:p-10 transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-[#232323] to-[#2c006e] text-white'
        : 'bg-white bg-gradient-to-b to-[#7C01F6A3] text-black'
    }`}>
      <header className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push('/dashboard/speakers')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            ← Back to Speakers
          </button>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Click on a speaker to add them
          </div>
        </div>
        <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold ${
          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'
        }`}>
          Speaker Catalog
        </h1>
      </header>

      {/* Language filters */}
      <nav className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {languages.map((lang) => (
          <button
            key={lang.name}
            onClick={() => handleLanguageToggle(lang.name)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-md font-bold shadow-md transition-all ${
              lang.active
                ? theme === 'dark'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-cyan-400 text-black border-2 border-gray-800/50'
                : theme === 'dark'
                ? 'border-2 border-dashed border-gray-500 text-gray-400 hover:bg-gray-700'
                : 'border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span>{lang.name}</span>
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
              lang.active
                ? theme === 'dark'
                  ? 'bg-black/20'
                  : 'bg-white/50'
                : 'bg-gray-500'
            }`}>
              {lang.flag}
            </span>
          </button>
        ))}
      </nav>

      {/* Speakers grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredSpeakers.map((speaker) => (
          <div
            key={speaker.id}
            onMouseEnter={() => setHoveredSpeakerId(speaker.id)}
            onMouseLeave={() => setHoveredSpeakerId(null)}
            onClick={() => handleSelectSpeaker(speaker)}
            className={`relative rounded-3xl flex shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
              addingSpeaker === speaker.id ? 'opacity-50' : ''
            } ${
              hoveredSpeakerId && hoveredSpeakerId !== speaker.id ? 'blur-md scale-95' : 'scale-100'
            } ${
              theme === 'dark'
                ? `${speaker.colorClasses.bg}`
                : `bg-white border-4 ${speaker.colorClasses.border}`
            }`}
          >
            <div className={`w-2/5 flex-shrink-0 flex flex-col justify-between items-center p-4 pb-0 ${speaker.colorClasses.cardBg} rounded-r-3xl`}>
              <div className="text-center text-gray-800">
                <h3 className="text-2xl font-bold">{speaker.name}</h3>
                <p className="flex items-center justify-center gap-1 font-semibold">
                  {speaker.language} <span>{speaker.flagEmoji}</span>
                </p>
              </div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                <Image
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
                  alt={`Avatar of ${speaker.name}`}
                  fill
                  unoptimized
                />
              </div>
            </div>
            <div className={`w-3/5 p-4 flex flex-col gap-3 ${speaker.colorClasses.text}`}>
              <div>
                <h4 className="font-bold text-lg">Personality</h4>
                <ul className="mt-1 space-y-1 text-md">
                  {speaker.personality.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg">Interests</h4>
                <ul className="mt-1 space-y-1 text-md">
                  {speaker.interests.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
            {addingSpeaker === speaker.id && (
              <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center">
                <div className="bg-white rounded-full p-2">
                  <div className="animate-spin h-6 w-6 border-2 border-gray-600 border-t-transparent rounded-full" />
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default SpeakersCatalogPage;