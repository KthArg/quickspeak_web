// src/app/dashboard/dictionary/page.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import { useTheme } from "@/app/contexts/ThemeContext";
import { MessageSquare, Bookmark } from "lucide-react";

// -------------------- Tipos de API (DTO) --------------------
type ColorToken =
  | "teal"
  | "pink"
  | "yellow"
  | "orange"
  | "blue"
  | "green" 
  | "red"
  | "purple"
  | "sky"
  | "indigo"
  | "emerald"
  | "rose";

type TranslationDTO = { language: string; word: string; color: ColorToken };
type WordDTO = {
  id: number;
  word: string;
  color: ColorToken;
  translated: boolean;
  translations: TranslationDTO[];
};
type WordsResponse = { words: WordDTO[] };

// -------------------- Tipos de UI --------------------
type TranslationUI = { language: string; word: string; colorClass: string };
type WordUI = {
  id: number;
  word: string;
  colorClass: string;
  translated: boolean;
  translations: TranslationUI[];
};

const colorBg: Record<ColorToken, string> = {
  teal: "bg-[#06d6a0]",
  pink: "bg-[#ef476f]",
  yellow: "bg-[#ffd166]",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

// -------------------- SUBCOMPONENTES --------------------
const WordTag = ({
  word,
  onClick,
}: {
  word: WordUI;
  onClick: (word: WordUI) => void;
}) => (
  <button
    onClick={() => onClick(word)}
    className={`px-5 py-3 rounded-full font-bold text-xl sm:text-2xl shadow-md transition-transform hover:scale-105 ${word.colorClass} text-white`}
  >
    {word.word}
  </button>
);

const WordDetailModal = ({
  word,
  onUpdate,
  onClose,
  onForget,
  forgetting,
}: {
  word: WordUI;
  onUpdate: () => void;
  onClose: () => void;
  onForget: (id: number) => void;
  forgetting: boolean;
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
                    key={`${t.language}-${t.word}`}
                    className={`flex items-center gap-4 px-4 py-1.5 rounded-full text-white font-bold text-2xl ${t.colorClass}`}
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
              onClick={() => onForget(word.id)}
              disabled={forgetting}
              className={`flex-1 text-white rounded-full py-1.5 border-2 ${
                theme === "dark"
                  ? "bg-red-500 border-red-500"
                  : "bg-[#ef476f] border-[#ef476f]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {forgetting ? "Forgetting..." : "Forget"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- PAGINA --------------------
const DictionaryDetailPage: NextPage = () => {
  const { theme } = useTheme();

  const [dictionaryWords, setDictionaryWords] = useState<WordUI[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordUI | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "Recently Added",
    "Descending",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forgettingId, setForgettingId] = useState<number | null>(null);

  // Cargar desde API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/dictionary/words", {
          headers: { "Content-Type": "application/json" },
        });
        const { words } = (await res.json()) as WordsResponse;
        if (!alive) return;

        const toUI = (w: WordDTO): WordUI => ({
          id: w.id,
          word: w.word,
          colorClass: colorBg[w.color] ?? "bg-gray-500",
          translated: w.translated,
          translations: (w.translations || []).map((t) => ({
            language: t.language,
            word: t.word,
            colorClass: colorBg[t.color] ?? "bg-gray-400",
          })),
        });

        setDictionaryWords(words.map(toUI));
        setLoading(false);
      } catch (e: any) {
        setError(e?.message ?? "Error loading dictionary");
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const needsTranslationUpdate = useMemo(
    () => dictionaryWords.some((word) => !word.translated),
    [dictionaryWords]
  );

  const handleUpdateAll = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      await fetch("/api/dictionary/words/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ all: true }),
      });

      setDictionaryWords((prev) =>
        prev.map((w) => ({ ...w, translated: true }))
      );
      if (selectedWord) {
        setSelectedWord((p) => (p ? { ...p, translated: true } : null));
      }
    } catch (e) {
      console.error(e);
      alert("No se pudieron actualizar las traducciones.");
    }
  }, [selectedWord]);

    const handleForget = useCallback(
    async (id: number) => {
      try {
        setForgettingId(id);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        // Buscar la palabra en el estado actual
        const wordObj = dictionaryWords.find((w) => w.id === id);
        const wordText = wordObj?.word;

        const res = await fetch(`/api/dictionary/words/${id}/forget`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // Mandar la palabra al BFF si la tenemos
          body: JSON.stringify(
            wordText
              ? { word: wordText }
              : {}
          ),
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Forget failed: ${res.status} ${msg}`);
        }

        // Quitar la palabra de la lista
        setDictionaryWords((prev) => prev.filter((w) => w.id !== id));

        // Cerrar modal si era la seleccionada
        setSelectedWord((prev) => (prev?.id === id ? null : prev));
      } catch (e) {
        console.error("Error forgetting word:", e);
        alert("No se pudo olvidar la palabra.");
      } finally {
        setForgettingId(null);
      }
    },
    [dictionaryWords] 
  );

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  if (loading)
    return <div className="p-10 text-center">Cargando diccionario…</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;

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
          {dictionaryWords.map((word) => (
            <WordTag key={word.id} word={word} onClick={setSelectedWord} />
          ))}
        </section>
      </main>

      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onUpdate={handleUpdateAll}
          onClose={() => setSelectedWord(null)}
          onForget={handleForget}
          forgetting={forgettingId === selectedWord.id}
        />
      )}
    </div>
  );
};

export default DictionaryDetailPage;
