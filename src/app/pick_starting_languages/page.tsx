"use client";

import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { apiClient } from "@/app/lib/api";

type Language = { id: number; name: string; flagUrl: string };

const animationStyles = `
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
`;

const PickLanguagesToLearnPage: NextPage = () => {
  const { theme } = useTheme();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar catálogo desde el mock GET /languages
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.get<{ languages: Language[] }>(
          "/languages/starting"
        );
        if (mounted) setLanguages(data.languages ?? []);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Error cargando idiomas");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedNames = useMemo(
    () =>
      languages.filter((l) => selectedIds.includes(l.id)).map((l) => l.name),
    [languages, selectedIds]
  );

  const toggleLanguage = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = async () => {
    try {
      setSaving(true);
      setError(null);
      // POST al mock /selections/languages
      const res = await apiClient.post<{
        success: boolean;
        selection: { id: number; selected: string[] };
      }>("/selections/starting/languages", { selected: selectedNames });
      alert(
        res.success
          ? `Saved! Selected: ${selectedNames.join(", ")}`
          : "No se pudo guardar"
      );
    } catch (e: any) {
      setError(e?.message ?? "Error al guardar selección");
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
          : "bg-gradient-to-b from-white to-red-100 text-black"
      }`}
    >
      <style>{animationStyles}</style>

      <div
        className={`absolute bottom-0 left-0 w-full h-3/4
        ${
          theme === "dark"
            ? "bg-gradient-to-t from-red-500/30 via-transparent to-transparent [filter:blur(100px)]"
            : "bg-gradient-to-t from-red-300/40 via-transparent to-transparent [filter:blur(100px)]"
        }`}
      />

      <ArrowLeft
        className={`absolute top-6 left-6 md:top-10 md:left-14 w-9 h-9 md:w-11 md:h-11 cursor-pointer z-20 ${
          theme === "dark" ? "text-white" : "text-gray-600"
        }`}
      />

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10 md:gap-12 py-10">
        <header className="w-full flex flex-col items-start text-left gap-2 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Pick Languages To Learn
          </h1>
          <p
            className={`text-lg md:text-xl ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Which languages do you want to start with?
          </p>
        </header>

        {loading && <p className="px-4">Cargando idiomas…</p>}
        {error && <p className="px-4 text-red-400">Error: {error}</p>}

        {!loading && !error && (
          <>
            <div className="w-full grid grid-cols-3 gap-x-4 gap-y-8 md:gap-y-12">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => toggleLanguage(lang.id)}
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
                    {selectedIds.includes(lang.id) && (
                      <div className="absolute inset-0 rounded-full border-4 border-teal-400 bg-black/30" />
                    )}
                  </div>
                  <span
                    className={`font-medium text-lg ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="h-20 pt-4">
              {selectedIds.length > 0 && (
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
                  <span>{saving ? "Saving..." : "Continue"}</span>
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

export default PickLanguagesToLearnPage;
