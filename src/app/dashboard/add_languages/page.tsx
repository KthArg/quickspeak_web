"use client";

import React, { useState, useCallback } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Languages, X } from "lucide-react";
import { useLanguages } from "@/hooks/useLanguages";
import { Language } from "@/services/types";

// --- SUB-COMPONENTE: Icono de Idioma ---
const LanguageIcon = ({
  lang,
  isAdded,
  onClick,
}: {
  lang: Language;
  isAdded: boolean;
  onClick: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      disabled={isAdded}
      className={`flex flex-col items-center gap-2 text-center transition-all ${
        isAdded ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full">
        <Image
          src={lang.flag}
          alt={`${lang.name} flag`}
          layout="fill"
          className="rounded-full object-cover"
        />
      </div>
      <span
        className={`font-bold text-lg ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {lang.nativeName || lang.name}
      </span>
    </button>
  );
};

// --- SUB-COMPONENTE: Tarjeta para Añadir Más ---
const AddMoreCard = () => {
  const { theme } = useTheme();
  return (
    <button
      className={`w-full max-w-sm sm:max-w-md flex items-center p-3 sm:p-4 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] ${
        theme === "dark" ? "bg-cyan-500/80" : "bg-cyan-400"
      }`}
    >
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center ${
          theme === "dark" ? "bg-gray-700/50" : "bg-white/50"
        }`}
      >
        <Languages
          size={40}
          className={`${theme === "dark" ? "text-cyan-200" : "text-cyan-800"}`}
        />
      </div>
      <div className="flex-grow flex flex-col items-start ml-4 text-left">
        <h3
          className={`font-bold text-xl sm:text-2xl ${
            theme === "dark" ? "text-black" : "text-white"
          }`}
        >
          More Languages
        </h3>
        <p
          className={`font-semibold text-sm sm:text-md ${
            theme === "dark" ? "text-gray-800" : "text-gray-100"
          }`}
        >
          Tap here to add another language
        </p>
      </div>
    </button>
  );
};

// --- SUB-COMPONENTE: Modal de Confirmación ---
const ConfirmationModal = ({
  lang,
  onConfirm,
  onClose,
}: {
  lang: Language;
  onConfirm: (lang: Language) => void;
  onClose: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xs flex flex-col items-center gap-4 p-6 rounded-3xl shadow-2xl
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-2 border-cyan-400/50"
                    : "bg-white"
                }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-sm font-semibold 
                    ${
                      theme === "dark"
                        ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                        : "border-gray-400 text-gray-600 hover:bg-gray-100"
                    }`}
        >
          <X size={16} /> Close
        </button>

        <div className="relative w-28 h-28 rounded-full mt-6">
          <Image
            src={lang.flag}
            alt={`${lang.name} flag`}
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>

        <h2
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {lang.name}
        </h2>

        <div className="w-full flex flex-col items-center gap-3 text-center">
          <button
            onClick={() => onConfirm(lang)}
            className={`w-full rounded-full py-2.5 font-bold text-lg transition-colors
                        ${
                          theme === "dark"
                            ? "bg-cyan-400 text-black"
                            : "border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50"
                        }`}
          >
            Add to Language List
          </button>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } max-w-xs`}
          >
            This will allow you to start learning {lang.name}. You can always
            remove languages later.
            <br />
            <br />
            If you wish to make this your native language you must add it to
            your language list.
          </p>
        </div>
      </div>
    </div>
  );
};

const AddLanguagesPage: NextPage = () => {
  const { theme } = useTheme();
  const { availableLanguages, userLanguages, loading, addLanguage } =
    useLanguages();

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const handleAddLanguage = useCallback(
    async (lang: Language) => {
      try {
        await addLanguage({
          code: lang.code,
          name: lang.name,
          nativeName: lang.nativeName,
          flag: lang.flag,
          level: "beginner",
        });
        setSelectedLanguage(null);
        alert(`${lang.name} has been added to your list!`);
      } catch (error) {
        console.error("Failed to add language:", error);
        alert("Failed to add language. Please try again.");
      }
    },
    [addLanguage]
  );

  const handleIconClick = (lang: Language) => {
    const isAdded =
      userLanguages?.learningLanguages.some(
        (userLang) => userLang.code === lang.code
      ) || false;
    if (!isAdded) {
      setSelectedLanguage(lang);
    }
  };

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col items-center p-6 md:p-10 transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
    >
      <header className="text-center mb-10 sm:mb-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mt-10">
          Add a Language
        </h1>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
            Loading languages...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
            {availableLanguages.map((lang) => {
              const isAdded =
                userLanguages?.learningLanguages.some(
                  (userLang) => userLang.code === lang.code
                ) || false;
              return (
                <LanguageIcon
                  key={lang.code}
                  lang={lang}
                  isAdded={isAdded}
                  onClick={() => handleIconClick(lang)}
                />
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-16 w-full flex justify-center">
        <AddMoreCard />
      </footer>

      {selectedLanguage && (
        <ConfirmationModal
          lang={selectedLanguage}
          onConfirm={handleAddLanguage}
          onClose={() => setSelectedLanguage(null)}
        />
      )}
    </div>
  );
};

export default AddLanguagesPage;
