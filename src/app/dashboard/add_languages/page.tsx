"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Languages, X } from "lucide-react";

// --- Tipos ---
type Language = {
  id: number;
  name: string;
  flagUrl: string;
};

// Sub-componente: Icono de Idioma
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
          src={lang.flagUrl}
          alt={`${lang.name} flag`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <span
        className={`font-bold text-lg ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {lang.name}
      </span>
    </button>
  );
};

// Sub-componente: Modal de Confirmación
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
            src={lang.flagUrl}
            alt={`${lang.name} flag`}
            fill
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

const AddLanguagePage: NextPage = () => {
  const { theme } = useTheme();

  // Estados que vienen de la API
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  // Cargar catálogos y estado inicial del usuario
  useEffect(() => {
    (async () => {
      try {
        const catalogResponse = await fetch("/api/languages/full-catalog");

        if (!catalogResponse.ok) {
          throw new Error(`Error ${catalogResponse.status}: ${catalogResponse.statusText}`);
        }

        const catalog = await catalogResponse.json();
        console.log("Full catalog response:", catalog);

        // Manejar diferentes formatos de respuesta
        const languagesArray = Array.isArray(catalog)
          ? catalog
          : (catalog?.languages || []);

        setAvailableLanguages(languagesArray);
      } catch (e: any) {
        console.error("Error cargando catálogo de idiomas", e);
        setAvailableLanguages([]);
      }

      try {
        const meResponse = await fetch("/api/user/languages");

        if (!meResponse.ok) {
          throw new Error(`Error ${meResponse.status}: ${meResponse.statusText}`);
        }

        const me = await meResponse.json();
        console.log("User languages response:", me);

        // Manejar diferentes formatos de respuesta
        const userLangsArray = Array.isArray(me)
          ? me.map((lang: any) => lang.name)
          : (me?.userLanguages || []);

        setUserLanguages(userLangsArray);
      } catch (e: any) {
        console.error("Error cargando idiomas del usuario", e);
        setUserLanguages([]);
      }
    })();
  }, []);

  const handleAddLanguage = useCallback(async (lang: Language) => {
    try {
      await fetch("/api/user/languages/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: lang.name }),
      });
      // Actualiza el estado local para reflejar el cambio
      setUserLanguages((prev) =>
        prev.includes(lang.name) ? prev : [...prev, lang.name]
      );
      setSelectedLanguage(null);
      alert(`${lang.name} has been added to your list!`);
    } catch (e) {
      console.error("Error agregando idioma", e);
      alert("There was an error adding the language.");
    }
  }, []);

  const handleIconClick = (lang: Language) => {
    if (!userLanguages.includes(lang.name)) {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
          {availableLanguages && availableLanguages.length > 0 ? (
            availableLanguages.map((lang) => (
              <LanguageIcon
                key={lang.id}
                lang={lang}
                isAdded={userLanguages.includes(lang.name)}
                onClick={() => handleIconClick(lang)}
              />
            ))
          ) : (
            <div className={`col-span-full text-center py-12 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              <p className="text-xl mb-4">Loading languages...</p>
              <p className="text-sm">Please wait while we fetch available languages</p>
            </div>
          )}
        </div>
      </main>

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

export default AddLanguagePage;
