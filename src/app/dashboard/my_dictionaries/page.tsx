"use client";

import type { NextPage } from "next";
import { useTheme } from "@/app/contexts/ThemeContext";
import Image from "next/image";
import { Languages, MessageSquare, Bookmark } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";

// Helper function to get color based on index
const getLanguageColor = (index: number) => {
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-teal-400",
    "bg-sky-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
  ];
  return colors[index % colors.length];
};

// Interface for dictionary display
interface DictionaryDisplay {
  language: string;
  wordCount: number;
  flagUrl: string;
  color: string;
}

// --- SUB-COMPONENTE: Tarjeta de Diccionario ---
const DictionaryCard = ({ dictionary }: { dictionary: DictionaryDisplay }) => {
  const { theme } = useTheme();
  return (
    <button
      className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] ${dictionary.color}`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 bg-white/20 p-1">
        <Image
          src={dictionary.flagUrl}
          alt={`${dictionary.language} flag`}
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <div
        className={`flex-grow flex flex-col items-start ml-4 text-left ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <h3 className="font-bold text-2xl sm:text-3xl">
          {dictionary.language}
        </h3>
        <p
          className={`font-semibold text-md sm:text-lg ${
            theme === "dark" ? "text-white/80" : "text-gray-800"
          }`}
        >
          {dictionary.wordCount} words saved
        </p>
      </div>
    </button>
  );
};

const DictionaryPage: NextPage = () => {
  const { theme } = useTheme();
  const { words, loading } = useDictionary();

  // Group words by language and create dictionary summary
  const dictionariesData: DictionaryDisplay[] = words.reduce(
    (acc: DictionaryDisplay[], word) => {
      const existingDict = acc.find((dict) => dict.language === word.language);

      if (existingDict) {
        existingDict.wordCount++;
      } else {
        // Get flag URL based on language code
        const getFlagUrl = (languageCode: string) => {
          const flagMap: { [key: string]: string } = {
            zh: "https://unpkg.com/circle-flags/flags/cn.svg",
            pt: "https://unpkg.com/circle-flags/flags/br.svg",
            de: "https://unpkg.com/circle-flags/flags/de.svg",
            es: "https://unpkg.com/circle-flags/flags/es.svg",
            fr: "https://unpkg.com/circle-flags/flags/fr.svg",
            it: "https://unpkg.com/circle-flags/flags/it.svg",
            ja: "https://unpkg.com/circle-flags/flags/jp.svg",
            ko: "https://unpkg.com/circle-flags/flags/kr.svg",
            ru: "https://unpkg.com/circle-flags/flags/ru.svg",
            ar: "https://unpkg.com/circle-flags/flags/ae.svg",
          };
          return (
            flagMap[languageCode] ||
            "https://unpkg.com/circle-flags/flags/us.svg"
          );
        };

        acc.push({
          language: word.language,
          wordCount: 1,
          flagUrl: getFlagUrl(word.language),
          color: getLanguageColor(acc.length),
        });
      }

      return acc;
    },
    []
  );

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col overflow-hidden transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#121212] text-white"
            : "bg-gradient-to-b from-white to-teal-100 text-black"
        }`}
    >
      {/* Brillo de fondo sutil */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-t from-teal-900/30 to-transparent"
            : ""
        }`}
      ></div>

      <main className="relative z-10 w-full max-w-2xl mx-auto flex-grow p-6 md:p-10 flex flex-col gap-8 pb-32">
        <header className="flex flex-col items-start gap-4">
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-bold ${
              theme === "dark" ? "text-cyan-400" : "text-cyan-500"
            }`}
          >
            Dictionary
          </h1>
          <div className="bg-red-500 rounded-full px-4 py-1.5 shadow">
            <span className="text-md font-bold text-white">
              Choose a Dictionary
            </span>
          </div>
        </header>

        <section className="w-full flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
              Loading dictionaries...
            </div>
          ) : dictionariesData.length > 0 ? (
            dictionariesData.map((dict) => (
              <DictionaryCard key={dict.language} dictionary={dict} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Languages size={48} className="mx-auto mb-4 opacity-50" />
              <p>No words saved yet. Start building your dictionary!</p>
            </div>
          )}

          <button
            className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg border-2 border-dashed transition-colors 
            ${
              theme === "dark"
                ? "border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400"
                : "border-purple-600 text-purple-700 hover:bg-purple-50"
            }`}
          >
            <div
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center ${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              }`}
            >
              <Languages
                size={40}
                className={`${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`}
              />
            </div>
            <div className="flex-grow flex flex-col items-start ml-4 text-left">
              <h3 className="font-bold text-2xl sm:text-3xl">More Languages</h3>
              <p
                className={`font-semibold text-md sm:text-lg ${
                  theme === "dark" ? "text-purple-300/80" : "text-purple-700/80"
                }`}
              >
                Tap here to add another language
              </p>
            </div>
          </button>
        </section>
      </main>

      <footer className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className={`rounded-full flex items-center justify-center gap-12 sm:gap-16 py-3 px-8 sm:py-4 sm:px-12 shadow-2xl ${
            theme === "dark" ? "bg-cyan-400" : "bg-cyan-400"
          }`}
        >
          <button className="text-black hover:scale-110 transition-transform">
            <MessageSquare
              strokeWidth={2.5}
              className="w-7 h-7 sm:w-8 sm:h-8"
            />
          </button>
          <button className="text-black hover:scale-110 transition-transform">
            <Bookmark strokeWidth={2.5} className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DictionaryPage;
