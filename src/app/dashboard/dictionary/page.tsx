'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';
import { apiClient, type Word, type WordDTO } from '@/app/lib/api';

type ColorToken =
  | 'teal' | 'pink' | 'yellow' | 'orange' | 'blue' | 'green'
  | 'red' | 'purple' | 'sky' | 'indigo' | 'emerald' | 'rose';

interface WordUI {
  id: number;
  word: string;
  colorClass: string;
  translated: boolean;
  translations: Array<{
    language: string;
    word: string;
    colorClass: string;
  }>;
}

const colorBg: Record<ColorToken, string> = {
  teal: 'bg-[#06d6a0]', pink: 'bg-[#ef476f]', yellow: 'bg-[#ffd166]', orange: 'bg-orange-500',
  blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500', purple: 'bg-purple-500',
  sky: 'bg-sky-500', indigo: 'bg-indigo-500', emerald: 'bg-emerald-500', rose: 'bg-rose-500',
};


const DictionaryDetailPage: NextPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const language = searchParams.get('language') || 'Spanish';
  const [dictionaryWords, setDictionaryWords] = useState<WordUI[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordUI | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Recently Added', 'Descending']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forgettingId, setForgettingId] = useState<number | null>(null);

  // Load words for this dictionary
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<{ words: WordDTO[] }>(`/conversation/dictionary/words?language=${language}`);

        if (!isMounted) return;
        const words: WordUI[] = data.words.map((w) => ({
          id: w.id,
          word: w.word,
          colorClass: colorBg[w.color as ColorToken] || 'bg-gray-500',
          translated: w.translated,
          translations: (w.translations || []).map((t) => ({
            language: t.language,
            word: t.word,
            colorClass: colorBg[t.color as ColorToken] || 'bg-gray-400',
          })),
        }));
        setDictionaryWords(words);
      } catch (err: any) {
        setError(err.message || 'Failed to load dictionary');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [language]);

  const needsTranslationUpdate = useMemo(
    () => dictionaryWords.some((word) => !word.translated),
    [dictionaryWords]
  );

  const handleUpdateAll = useCallback(async () => {
    try {
      await apiClient.post('/conversation/dictionary/words/update-translations', { all: true });
      // Refresh words
      const data = await apiClient.get<{ words: WordDTO[] }>(`/conversation/dictionary/words?language=${language}`);
      const words: WordUI[] = data.words.map((w) => ({
        id: w.id,
        word: w.word,
        colorClass: colorBg[w.color as ColorToken] || 'bg-gray-500',
        translated: w.translated,
        translations: (w.translations || []).map((t) => ({
          language: t.language,
          word: t.word,
          colorClass: colorBg[t.color as ColorToken] || 'bg-gray-400',
        })),
      }));
      setDictionaryWords(words);
    } catch (err: any) {
      alert('Failed to update translations');
    }
  }, [language]);

  const handleForget = useCallback(async (id: number) => {
    try {
      setForgettingId(id);
      await apiClient.post(`/conversation/dictionary/words/${id}/forget`, {});
      setDictionaryWords((prev) => prev.filter((w) => w.id !== id));
      setSelectedWord(null);
    } catch (err: any) {
      alert('Failed to forget word');
    } finally {
      setForgettingId(null);
    }
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
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
        : 'bg-gradient-to-b from-white to-yellow-100 text-black'
    }`}>
      <main className="relative z-10 w-full max-w-4xl mx-auto flex-grow p-6 md:p-10 flex flex-col items-center gap-10 pb-32">
        <header className="w-full flex flex-col items-center gap-6">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold text-center mt-10 ${
            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-500'
          }`}>
            Dictionary ({language})
          </h1>
          {needsTranslationUpdate && (
            <div className="text-center">
              <button
                onClick={handleUpdateAll}
                className={`rounded-full px-6 py-2 font-bold text-xl shadow-lg transition-transform hover:scale-105 ${
                  theme === 'dark' ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                Update Translations
              </button>
              <p className={`text-xs mt-2 max-w-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Note: If you don't update the translations, you will only see the words you saved in their original language.
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            {['Recently Added', 'Descending'].map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-1 rounded-full font-bold text-sm shadow-md transition-colors ${
                  activeFilters.includes(filter)
                    ? theme === 'dark'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <section className="flex flex-wrap justify-center gap-4">
          {dictionaryWords.map((word) => (
            <button
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className={`px-5 py-3 rounded-full font-bold text-xl sm:text-2xl shadow-md transition-transform hover:scale-105 ${word.colorClass} text-white`}
            >
              {word.word}
            </button>
          ))}
        </section>
      </main>

      {/* Word Detail Modal */}
      {selectedWord && (
        <div
          onClick={() => setSelectedWord(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs flex flex-col items-center"
          >
            <div
              className={`w-full text-white font-bold rounded-t-3xl py-2 text-center text-lg ${theme === 'dark' ? 'bg-red-500' : 'bg-[#ef476f]'}`}
            >
              {language} Word
            </div>
            <div
              className={`w-full rounded-b-3xl p-6 flex flex-col items-center gap-6 ${theme === 'dark' ? 'bg-[#232323]' : 'bg-white'}`}
            >
              <div
                className={`mt-4 px-8 py-2 rounded-full text-5xl font-bold shadow-lg ${selectedWord.translated ? 'bg-sky-500 text-black' : 'bg-red-500 text-white'}`}
              >
                {selectedWord.word}
              </div>

              {selectedWord.translated ? (
                <div className="flex flex-col items-center gap-3">
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-sky-400' : 'text-gray-800'}`}>
                    Your Languages
                  </h3>
                  <div className="flex flex-col gap-2">
                    {selectedWord.translations.map((t) => (
                      <div
                        key={`${t.language}-${t.word}`}
                        className={`flex items-center gap-4 px-4 py-1.5 rounded-full text-white font-bold text-2xl ${t.colorClass}`}
                      >
                        <span>{t.word}</span>
                        <span
                          className={`border-2 rounded-full px-2 py-0.5 text-lg ${theme === 'dark' ? 'bg-white/60 text-black border-gray-800' : 'bg-black/60 text-white border-white'}`}
                        >
                          {t.language}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center gap-4">
                  <p className={`text-xs max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    This word hasn't been translated yet. Update translations to see meanings in all your languages.
                  </p>
                  <button
                    onClick={handleUpdateAll}
                    className={`w-full rounded-full py-2 font-bold text-xl shadow-lg ${theme === 'dark' ? 'bg-red-500 text-white' : 'bg-[#ef476f] text-white'}`}
                  >
                    Update Translations
                  </button>
                </div>
              )}

              <div className="w-full flex gap-4 text-xl font-bold">
                <button
                  onClick={() => setSelectedWord(null)}
                  className={`flex-1 border-2 rounded-full py-1.5 ${theme === 'dark' ? 'border-sky-400 text-sky-400' : 'border-cyan-500 text-cyan-600'}`}
                >
                  Close
                </button>
                <button
                  onClick={() => handleForget(selectedWord.id)}
                  disabled={forgettingId === selectedWord.id}
                  className={`flex-1 text-white rounded-full py-1.5 border-2 ${theme === 'dark' ? 'bg-red-500 border-red-500' : 'bg-[#ef476f] border-[#ef476f]'} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {forgettingId === selectedWord.id ? 'Forgetting...' : 'Forget'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DictionaryDetailPage;