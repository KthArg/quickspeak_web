"use client";

import React, { useState, useMemo } from "react";
import type { NextPage } from "next";
import { useTheme } from "@/app/contexts/ThemeContext";
import { MessageSquare, Bookmark } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";
import { Word as ApiWord, Word } from "@/services/types";

// --- SUB-COMPONENTE: Etiqueta de Palabra ---
const WordTag = ({
  word,
  onClick,
}: {
  word: Word;
  onClick: (word: Word) => void;
}) => (
  <button
    onClick={() => onClick(word)}
    className={`px-5 py-3 rounded-full font-bold text-xl sm:text-2xl shadow-md transition-transform hover:scale-105 ${word.color} text-white`}
  >
    {word.word}
  </button>
);

// --- SUB-COMPONENTE: Modal de Detalles de la Palabra ---
const WordDetailModal = ({
  word,
  onUpdate,
  onClose,
  onDelete,
}: {
  word: Word;
  onUpdate: () => void;
  onClose: () => void;
  onDelete: (wordId: string) => void;
}) => {
  const { theme } = useTheme();
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs flex flex-col items-center"
      >
        <div
          className={`w-full text-white font-bold rounded-t-3xl py-2 text-center text-lg ${
            theme === "dark" ? "bg-red-500" : "bg-[#ef476f]"
          }`}
        >
          Spanish Word
        </div>
        <div
          className={`w-full rounded-b-3xl p-6 flex flex-col items-center gap-6 ${
            theme === "dark" ? "bg-[#232323]" : "bg-white"
          }`}
        >
          <div
            className={`mt-4 px-8 py-2 rounded-full text-5xl font-bold shadow-lg ${
              theme === "dark"
                ? word.translated
                  ? "bg-sky-500 text-black"
                  : "bg-red-500 text-white"
                : "bg-cyan-400 text-white"
            }`}
          >
            {word.word}
          </div>

          {word.translated ? (
            <div className="flex flex-col items-center gap-3">
              <h3
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-sky-400" : "text-gray-800"
                }`}
              >
                Your Languages
              </h3>
              <div className="flex flex-col gap-2">
                {word.translations.map((t) => (
                  <div
                    key={t.language}
                    className={`flex items-center gap-4 px-4 py-1.5 rounded-full text-white font-bold text-2xl ${t.color}`}
                  >
                    <span>{t.word}</span>
                    <span
                      className={`border-2 rounded-full px-2 py-0.5 text-lg ${
                        theme === "dark"
                          ? "bg-white/60 text-black border-gray-800"
                          : "bg-black/60 text-white border-white"
                      }`}
                    >
                      {t.language}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-4">
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                This word hasn’t been translated yet, update the translations of
                your dictionary to get their meaning in all your languages.
              </p>
              <button
                onClick={onUpdate}
                className={`w-full rounded-full py-2 font-bold text-xl shadow-lg ${
                  theme === "dark"
                    ? "bg-red-500 text-white"
                    : "bg-[#ef476f] text-white"
                }`}
              >
                Update Translations
              </button>
            </div>
          )}

          <div className="w-full flex gap-4 text-xl font-bold">
            <button
              onClick={onClose}
              className={`flex-1 border-2 rounded-full py-1.5 ${
                theme === "dark"
                  ? "border-sky-400 text-sky-400"
                  : "border-cyan-500 text-cyan-600"
              }`}
            >
              Close
            </button>
            <button
              onClick={() => onDelete(word.id)}
              className={`flex-1 text-white rounded-full py-1.5 border-2 ${
                theme === "dark"
                  ? "bg-red-500 border-red-500"
                  : "bg-[#ef476f] border-[#ef476f]"
              }`}
            >
              Forget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DictionaryDetailPage: NextPage = () => {
  const { theme } = useTheme();
  const { words, loading, error, updateWord, updateWordsInBatch, deleteWord } =
    useDictionary();
  const [selectedWord, setSelectedWord] = useState<ApiWord | null>(null);
  const [activeFilters, setActiveFilters] = useState([
    "Recently Added",
    "Descending",
  ]);

  const needsTranslationUpdate = useMemo(
    () => words.some((word) => !word.translated),
    [words]
  );

  const handleUpdateAll = async () => {
    try {
      // Filtrar palabras que necesitan traducción
      const wordsToUpdate = words
        .filter((word) => !word.translated)
        .map((word) => ({
          id: word.id,
          translated: true,
          // Mantener las traducciones existentes o agregar traducciones simuladas
          translations:
            word.translations.length > 0
              ? word.translations
              : [
                  {
                    language: "English",
                    word: `${word.word}_EN`, // Traducción simulada
                    color: "bg-yellow-500",
                  },
                  {
                    language: "German",
                    word: `${word.word}_DE`, // Traducción simulada
                    color: "bg-red-500",
                  },
                ],
        }));

      if (wordsToUpdate.length > 0) {
        await updateWordsInBatch(wordsToUpdate);
      }

      // Actualizar palabra seleccionada si no estaba traducida
      if (selectedWord && !selectedWord.translated) {
        setSelectedWord((prev) =>
          prev ? { ...prev, translated: true } : null
        );
      }
    } catch (error) {
      console.error("Error updating translations:", error);
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    try {
      await deleteWord(wordId);
      setSelectedWord(null); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col overflow-hidden transition-colors
            ${
              theme === "dark"
                ? "bg-gradient-to-b from-[#232323] to-[#121212] text-white"
                : "bg-gradient-to-b from-white to-yellow-100 text-black"
            }`}
    >
      <main className="relative z-10 w-full max-w-4xl mx-auto flex-grow p-6 md:p-10 flex flex-col items-center gap-10 pb-32">
        <header className="w-full flex flex-col items-center gap-6">
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-bold text-center mt-10 ${
              theme === "dark" ? "text-cyan-400" : "text-cyan-500"
            }`}
          >
            Dictionary (Spanish)
          </h1>

          {needsTranslationUpdate ? (
            <div className="text-center">
              <button
                onClick={handleUpdateAll}
                className={`rounded-full px-6 py-2 font-bold text-xl shadow-lg transition-transform hover:scale-105 ${
                  theme === "dark"
                    ? "bg-red-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                Update Translations
              </button>
              <p
                className={`text-xs mt-2 max-w-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Note: If you don’t update the translations, you will only see
                the words you saved in their original language.
              </p>
            </div>
          ) : (
            <p
              className={`font-bold ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              All Translations Up to Date
            </p>
          )}

          <div className="flex items-center gap-3">
            {["Recently Added", "Descending"].map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-1 rounded-full font-bold text-sm shadow-md transition-colors ${
                  activeFilters.includes(filter)
                    ? theme === "dark"
                      ? "bg-red-500 text-white"
                      : "bg-red-500 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <section className="flex flex-wrap justify-center gap-4">
          {loading ? (
            <div
              className={`text-xl ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Loading words...
            </div>
          ) : error ? (
            <div className="text-xl text-red-500">Error: {error}</div>
          ) : (
            words.map((word) => (
              <WordTag key={word.id} word={word} onClick={setSelectedWord} />
            ))
          )}
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

      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onUpdate={handleUpdateAll}
          onClose={() => setSelectedWord(null)}
          onDelete={handleDeleteWord}
        />
      )}
    </div>
  );
};

export default DictionaryDetailPage;
