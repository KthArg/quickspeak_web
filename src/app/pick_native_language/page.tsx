"use client";

import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- CSS para la animación del botón ---
const animationStyles = `
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
`;

// --- DATOS DE IDIOMAS ---
const languages = [
  {
    id: 1,
    name: "English",
    flagUrl: "https://unpkg.com/circle-flags/flags/gb.svg",
  },
  {
    id: 2,
    name: "Español",
    flagUrl: "https://unpkg.com/circle-flags/flags/cr.svg",
  },
  {
    id: 3,
    name: "漢語",
    flagUrl: "https://unpkg.com/circle-flags/flags/cn.svg",
  },
  {
    id: 4,
    name: "Hindi",
    flagUrl: "https://unpkg.com/circle-flags/flags/in.svg",
  },
  {
    id: 5,
    name: "Русский",
    flagUrl: "https://unpkg.com/circle-flags/flags/ru.svg",
  },
  {
    id: 6,
    name: "Français",
    flagUrl: "https://unpkg.com/circle-flags/flags/fr.svg",
  },
  {
    id: 7,
    name: "العربية",
    flagUrl: "https://unpkg.com/circle-flags/flags/ae.svg",
  },
  {
    id: 8,
    name: "Português",
    flagUrl: "https://unpkg.com/circle-flags/flags/br.svg",
  },
  {
    id: 9,
    name: "Deutsch",
    flagUrl: "https://unpkg.com/circle-flags/flags/de.svg",
  },
];

const PickNativeLanguagePage: NextPage = () => {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English"); // 'English' pre-seleccionado

  const handleSelectLanguage = (languageName: string) => {
    setSelectedLanguage(languageName);
  };

  const handleContinue = () => {
    alert(`Continuing with native language: ${selectedLanguage}`);
  };

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col items-center justify-center p-4 sm:p-6 transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
    >
      <style>{animationStyles}</style>

      {/* Brillo de fondo dinámico */}
      <div
        className={`absolute bottom-0 left-0 w-full h-3/4
        ${
          theme === "dark"
            ? "bg-gradient-to-t from-purple-500/30 via-transparent to-transparent [filter:blur(100px)]"
            : "bg-gradient-to-t from-purple-300/40 via-transparent to-transparent [filter:blur(100px)]"
        }`}
      ></div>

      <ArrowLeft
        className={`absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 cursor-pointer z-20 ${
          theme === "dark" ? "text-white" : "text-gray-600"
        }`}
      />

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10 md:gap-12 py-10">
        <header className="w-full flex flex-col items-start text-left gap-2 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Pick a Native Language
          </h1>
          <p
            className={`text-lg md:text-xl ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            What language do you speak most right now?
          </p>
        </header>

        <div className="w-full grid grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.name)}
              className="flex flex-col items-center gap-3 text-center transition-transform hover:scale-105 focus:outline-none group"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center">
                <Image
                  src={lang.flagUrl}
                  alt={`Flag of ${lang.name}`}
                  width={112}
                  height={112}
                  className="rounded-full w-full h-full object-cover shadow-lg"
                />
                {/* Indicador de selección */}
                {selectedLanguage === lang.name && (
                  <div className="absolute inset-0 rounded-full border-4 border-teal-400 bg-black/30"></div>
                )}
              </div>
              <span
                className={`font-medium text-lg ${
                  selectedLanguage === lang.name
                    ? "text-teal-400"
                    : theme === "dark"
                    ? "text-gray-200"
                    : "text-gray-700"
                }`}
              >
                {lang.name}
              </span>
            </button>
          ))}
        </div>

        <div className="h-20 pt-4">
          {selectedLanguage && (
            <button
              onClick={handleContinue}
              className={`animate-fade-in-up font-extrabold text-xl rounded-full py-3 px-10 flex items-center gap-2.5 transition-colors
                ${
                  theme === "dark"
                    ? "bg-[#18D2B4] text-[#073b4c] hover:bg-[#14a892]"
                    : "bg-teal-400 text-white hover:bg-teal-500"
                }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default PickNativeLanguagePage;
