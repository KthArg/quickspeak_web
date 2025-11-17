"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiClient } from "@/app/lib/api";

type Language = { id: number; name: string; flagUrl: string };

const animationStyles = `
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
`;

const PickNativeLanguagePage: NextPage = () => {
  const { theme } = useTheme();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar catálogo de idiomas para selección nativa
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/languages/select-native');

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched languages:", data);

        if (!mounted) return;

        // El backend retorna directamente un array de idiomas
        const languagesArray = Array.isArray(data) ? data : [];

        if (languagesArray.length === 0) {
          setError("No se encontraron idiomas disponibles.");
          return;
        }

        setLanguages(languagesArray);
        // Pre-selecciona el primero
        setSelectedLanguage(languagesArray[0]);
      } catch (e: any) {
        console.error("Error loading languages:", e);
        setError(e?.message || "No se pudo cargar el catálogo de idiomas.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectLanguage = (lang: Language) => setSelectedLanguage(lang);

  const handleContinue = async () => {
    if (!selectedLanguage) return;
    try {
      setSaving(true);

      // Primero agregar el idioma al usuario
      await apiClient.post("/user/languages", { languageId: selectedLanguage.id });

      // Luego marcarlo como nativo
      await apiClient.patch(`/user/languages/${selectedLanguage.id}/make-native`, {});

      // Redirigir a selección de idiomas para aprender
      window.location.href = "/pick_starting_languages";
    } catch (e: any) {
      alert(e?.message || "No se pudo guardar el idioma.");
    } finally {
      setSaving(false);
    }
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

      <div
        className={`absolute bottom-0 left-0 w-full h-3/4
        ${
          theme === "dark"
            ? "bg-gradient-to-t from-purple-500/30 via-transparent to-transparent [filter:blur(100px)]"
            : "bg-gradient-to-t from-purple-300/40 via-transparent to-transparent [filter:blur(100px)]"
        }`}
      />
      <a href="/login">
        <ArrowLeft
          className={`absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 cursor-pointer z-20 ${
            theme === "dark" ? "text-white" : "text-gray-600"
          }`}
        />
      </a>

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

        {loading && <p className="px-4 text-lg">Loading languages…</p>}
        {error && (
          <div className="px-4 text-center">
            <p className="text-red-400 text-lg mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && languages.length === 0 && (
          <p className="px-4 text-lg text-yellow-400">
            No languages available. Please try again later.
          </p>
        )}

        {!loading && !error && languages.length > 0 && (
          <>
            <div className="w-full grid grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12">
              {languages.map((lang) => {
                const isSelected = selectedLanguage?.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang)}
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
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full border-4 border-teal-400 bg-black/30"></div>
                      )}
                    </div>
                    <span
                      className={`font-medium text-lg ${
                        isSelected
                          ? "text-teal-400"
                          : theme === "dark"
                          ? "text-gray-200"
                          : "text-gray-700"
                      }`}
                    >
                      {lang.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-20 pt-4">
              {selectedLanguage && (
                <button
                  onClick={handleContinue}
                  disabled={saving}
                  className={`animate-fade-in-up font-extrabold text-xl rounded-full py-3 px-10 flex items-center gap-2.5 transition-colors
                    ${
                      theme === "dark"
                        ? "bg-[#18D2B4] text-[#073b4c] hover:bg-[#14a892]"
                        : "bg-teal-400 text-white hover:bg-teal-500"
                    }`}
                >
                  <span>{saving ? "Saving…" : "Continue"}</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PickNativeLanguagePage;
