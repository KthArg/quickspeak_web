"use client";

import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Languages, MessageSquare, Bookmark } from "lucide-react";
import { apiClient } from "@/app/lib/api";

// ===== Tipos de respuesta del backend =====
type DictionaryItem = {
  id: number;
  language: string;
  wordCount: number;
  flagUrl: string;
};

type DictionariesResponse = {
  dictionaries: DictionaryItem[];
};

// ===== Util: mapeo de colores por idioma (frontend) =====
const languageColor = (lang: string): string => {
  const key = lang.toLowerCase();
  if (key.includes("mandarin") || key.includes("chinese") || key.includes("zh"))
    return "bg-red-500";
  if (key.includes("portuguese") || key.includes("pt")) return "bg-yellow-500";
  if (key.includes("german") || key.includes("de")) return "bg-teal-400";
  if (key.includes("spanish") || key.includes("es")) return "bg-sky-500";
  // color por defecto
  return "bg-gray-400";
};

// --- SUB-COMPONENTE: Tarjeta de Diccionario ---
const DictionaryCard = ({
  dictionary,
  theme,
  onClick,
}: {
  dictionary: DictionaryItem & { color: string };
  theme: "light" | "dark";
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 sm:p-4 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] ${dictionary.color}`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 bg-white/20 p-1">
        <Image
          src={dictionary.flagUrl}
          alt={`${dictionary.language} flag`}
          fill
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
  const router = useRouter();
  const [data, setData] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga desde el mock de APIM
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await apiClient.get<DictionariesResponse>(
          "/dictionaries/catalog"
        );
        if (!isMounted) return;
        setData(res.dictionaries ?? []);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Error al cargar diccionarios");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // agregamos color en frontend
  const decorated = useMemo(() => {
    return data.map((d) => ({ ...d, color: languageColor(d.language) }));
  }, [data]);

  // función para navegar al diccionario
  const handleDictionaryClick = () => {
    router.push("/dashboard/dictionary");
  };

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

        {/* Estados: loading / error / data */}
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
            {decorated.map((dict) => (
              <DictionaryCard
                key={dict.id}
                dictionary={dict}
                theme={theme as "light" | "dark"}
                onClick={handleDictionaryClick}
              />
            ))}

            <a
              href="/dashboard/add_languages"
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
                <h3 className="font-bold text-2xl sm:text-3xl">
                  More Languages
                </h3>
                <p
                  className={`font-semibold text-md sm:text-lg ${
                    theme === "dark"
                      ? "text-purple-300/80"
                      : "text-purple-700/80"
                  }`}
                >
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

export default DictionaryPage;
