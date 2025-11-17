'use client';

import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Languages, MessageSquare, Bookmark } from 'lucide-react';
import { apiClient, type DictionaryItem } from '@/app/lib/api';
import Image from 'next/image';

const DictionaryCatalogPage: NextPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [dictionaries, setDictionaries] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<{ dictionaries: DictionaryItem[] }>('/conversation/dictionary/catalog');
        if (!isMounted) return;
        setDictionaries(data.dictionaries);
      } catch (err: any) {
        setError(err.message || 'Failed to load dictionaries');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const languageColor = (language: string): string => {
    const lang = language.toLowerCase();
    if (lang.includes('mandarin') || lang.includes('chinese')) return 'bg-red-500';
    if (lang.includes('portuguese')) return 'bg-yellow-500';
    if (lang.includes('german')) return 'bg-teal-400';
    if (lang.includes('spanish')) return 'bg-sky-500';
    if (lang.includes('french')) return 'bg-purple-500';
    return 'bg-gray-400';
  };

  const handleDictionaryClick = (language: string) => {
    router.push(`/dashboard/dictionary?language=${encodeURIComponent(language)}`);
  };

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
    <div className={`w-full min-h-screen relative font-cabin flex flex-col overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-[#232323] to-[#121212] text-white'
        : 'bg-gradient-to-b from-white to-teal-100 text-black'
    }`}>
      {/* Background glow */}
      <div className={`absolute inset-0 ${
        theme === 'dark' ? 'bg-gradient-to-t from-teal-900/30 to-transparent' : ''
      }`} />
      <main className="relative z-10 w-full max-w-2xl mx-auto flex-grow p-6 md:p-10 flex flex-col gap-8 pb-32">
        <header className="flex flex-col items-start gap-4">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'
          }`}>
            Dictionary
          </h1>
          <div className="bg-red-500 rounded-full px-4 py-1.5 shadow">
            <span className="text-md font-bold text-white">Choose a Dictionary</span>
          </div>
        </header>
        {loading && (
          <section className="w-full">
            <div className="animate-pulse rounded-2xl h-20 bg-gray-300/40 mb-3" />
            <div className="animate-pulse rounded-2xl h-20 bg-gray-300/40 mb-3" />
            <div className="animate-pulse rounded-2xl h-20 bg-gray-300/40" />
          </section>
        )}
        {error && !loading && (
          <section className="w-full">
            <div className="rounded-2xl p-4 bg-red-600/20 border border-red-600/40 text-red-200">
              {error}
            </div>
          </section>
        )}
        {!loading && !error && (
          <section className="w-full flex flex-col gap-4">
            {dictionaries.map((dict) => (
              <button
                key={dict.id}
                onClick={() => handleDictionaryClick(dict.language)}
                className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg border-2 transition-transform hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400'
                    : 'border-purple-600 text-purple-700 hover:bg-purple-50'
                }`}
                style={{ borderColor: languageColor(dict.language).replace('bg-', '') }}
              >
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <Languages
                    size={40}
                    className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}
                  />
                </div>
                <div className="flex-grow flex flex-col items-start ml-4 text-left">
                  <h3 className="font-bold text-2xl sm:text-3xl">{dict.language}</h3>
                  <p className={`font-semibold text-md sm:text-lg ${
                    theme === 'dark' ? 'text-purple-300/80' : 'text-purple-700/80'
                  }`}>
                    {dict.wordCount} words saved
                  </p>
                </div>
              </button>
            ))}
            {/* Add more languages card */}
            <a
              href="/dashboard/add_languages"
              className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg border-2 border-dashed transition-colors ${
                theme === 'dark'
                  ? 'border-purple-500 text-purple-300 hover:bg-purple-500/10'
                  : 'border-purple-600 text-purple-700 hover:bg-purple-50'
              }`}
            >
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}>
                <Languages
                  size={40}
                  className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}
                />
              </div>
              <div className="flex-grow flex flex-col items-start ml-4 text-left">
                <h3 className="font-bold text-2xl sm:text-3xl">More Languages</h3>
                <p className={`font-semibold text-md sm:text-lg ${
                  theme === 'dark' ? 'text-purple-300/80' : 'text-purple-700/80'
                }`}>
                  Tap here to add another language
                </p>
              </div>
            </a>
          </section>
        )}
      </main>
    </div>
  );
};

export default DictionaryCatalogPage;