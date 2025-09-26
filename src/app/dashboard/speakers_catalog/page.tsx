"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useSpeakers } from "@/hooks/useSpeakers";
import { Speaker } from "@/services/types";

// Asigno colores a las tarjetas de forma cíclica
const getColorClasses = (index: number) => {
  const colors = [
    {
      bg: "bg-[#06d6a0]",
      cardBg: "bg-[#50f9c2]",
      text: "text-gray-800",
      border: "border-[#06d6a0]",
    },
    {
      bg: "bg-[#ef476f]",
      cardBg: "bg-[#fe6788]",
      text: "text-white",
      border: "border-[#ef476f]",
    },
    {
      bg: "bg-[#ffd166]",
      cardBg: "bg-[#ffe08a]",
      text: "text-gray-800",
      border: "border-[#ffd166]",
    },
    {
      bg: "bg-orange-500",
      cardBg: "bg-orange-400",
      text: "text-white",
      border: "border-orange-500",
    },
    {
      bg: "bg-blue-500",
      cardBg: "bg-blue-400",
      text: "text-white",
      border: "border-blue-500",
    },
    {
      bg: "bg-green-500",
      cardBg: "bg-green-400",
      text: "text-white",
      border: "border-green-500",
    },
    {
      bg: "bg-red-400",
      cardBg: "bg-red-300",
      text: "text-gray-800",
      border: "border-red-400",
    },
    {
      bg: "bg-purple-500",
      cardBg: "bg-purple-400",
      text: "text-white",
      border: "border-purple-500",
    },
    {
      bg: "bg-sky-600",
      cardBg: "bg-sky-500",
      text: "text-white",
      border: "border-sky-600",
    },
  ];
  return colors[index % colors.length];
};

const getFlagFromLanguage = (language: string): string => {
  const flagMap: Record<string, string> = {
    German: "🇩🇪",
    French: "🇫🇷",
    Spanish: "🇪🇸",
    Chinese: "🇨🇳",
    Portuguese: "🇵🇹", // o 🇧🇷 si usas variante BR/PT-BR
    Italian: "🇮🇹",
    English: "🇬🇧",
    Japanese: "🇯🇵",
    Arabic: "🇦🇪",
    Russian: "🇷🇺",
    Hindi: "🇮🇳",
    Irish: "🇮🇪",
  };
  return flagMap[language] || "🏳️";
};

/* ====== Tarjeta de Speaker (idéntico layout/hover/contrast) ====== */
const SpeakerCard = ({
  speaker,
  colorClasses,
  isBlurred,
  onMouseEnter,
  onMouseLeave,
}: {
  speaker: Speaker;
  colorClasses: { bg: string; cardBg: string; text: string; border: string };
  isBlurred: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-3xl flex shadow-lg overflow-hidden transition-all duration-300 ease-in-out
        ${isBlurred ? "blur-md scale-95" : "scale-100"}
        ${
          theme === "dark"
            ? `${colorClasses.bg}`
            : `bg-white border-4 ${colorClasses.border}`
        }
      `}
    >
      <div
        className={`w-2/5 flex-shrink-0 flex flex-col justify-between items-center p-4 pb-0 ${colorClasses.cardBg} rounded-r-3xl`}
      >
        <div className="text-center text-gray-800">
          <h3 className="text-2xl font-bold">{speaker.name}</h3>
          <p className="flex items-center justify-center gap-1 font-semibold">
            {speaker.language}{" "}
            <span>{getFlagFromLanguage(speaker.language)}</span>
          </p>
        </div>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
          {/* Mantengo tu avatar de la API; si quieres el look Dicebear: usa la línea comentada */}
          <Image
            src={
              speaker.avatarUrl /* `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(speaker.name)}` */
            }
            alt={`Avatar of ${speaker.name}`}
            fill
            unoptimized
          />
        </div>
      </div>

      <div
        className={`w-3/5 p-4 flex flex-col gap-3 ${
          theme === "dark" ? colorClasses.text : "text-gray-800"
        }`}
      >
        <div>
          <h4 className="font-bold text-lg">Personality</h4>
          <ul className="mt-1 space-y-1 text-md">
            {(speaker.personality ?? []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg">Interests</h4>
          <ul className="mt-1 space-y-1 text-md">
            {(speaker.interests ?? []).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ====== Filtros (mismos estilos: borde discontinuo, badge con bandera) ====== */
type LanguageFilter = {
  name: string;
  flag: string;
  active: boolean;
  color: string; // conservamos esta prop para compatibilidad con el estilo anterior
};

const LanguageFilterButton = ({
  lang,
  onToggle,
}: {
  lang: LanguageFilter;
  onToggle: (name: string) => void;
}) => {
  const { theme } = useTheme();

  // Estética igual a la versión Anterior:
  // - Botón redondo con borde dashed cuando inactivo
  // - Cuando activo: rojo (dark) o rojo con texto negro + borde en light
  // - Badge circular con la bandera a la derecha
  const inactiveBase =
    theme === "dark"
      ? "border-2 border-dashed border-gray-500 text-gray-400 hover:bg-gray-700"
      : "border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100";

  const activeBase =
    theme === "dark"
      ? `${lang.color}` // p.ej. "bg-red-500 text-white"
      : `${lang.color.replace(
          "text-white",
          "text-black"
        )} border-2 border-gray-800/50`;

  return (
    <button
      onClick={() => onToggle(lang.name)}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-md font-bold transition-all shadow-md ${
        lang.active ? activeBase : inactiveBase
      }`}
    >
      <span>{lang.name}</span>
      <span
        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
          lang.active
            ? theme === "dark"
              ? "bg-black/20"
              : "bg-white/50"
            : "bg-gray-500"
        }`}
      >
        {lang.flag}
      </span>
    </button>
  );
};

/* ====== Página ====== */
const SpeakerCatalogPage: NextPage = () => {
  const { theme } = useTheme();
  const { speakers, loading, error } = useSpeakers();
  const [hoveredSpeakerId, setHoveredSpeakerId] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageFilter[]>([]);

  // Inicializa filtros desde los datos cargados (misma UX del “Anterior”)
  useEffect(() => {
    if (speakers.length > 0) {
      const unique = Array.from(new Set(speakers.map((s) => s.language)));
      setLanguages(
        unique.map((lang) => ({
          name: lang,
          flag: getFlagFromLanguage(lang),
          active: false,
          color: "bg-red-500 text-white",
        }))
      );
    }
  }, [speakers]);

  const handleLanguageToggle = useCallback((langName: string) => {
    setLanguages((prev) =>
      prev.map((l) => (l.name === langName ? { ...l, active: !l.active } : l))
    );
  }, []);

  const filteredSpeakers = useMemo(() => {
    const active = languages.filter((l) => l.active).map((l) => l.name);
    if (active.length === 0) return speakers;
    return speakers.filter((s) => active.includes(s.language));
  }, [languages, speakers]);

  return (
    <div
      className={`w-full min-h-screen font-cabin p-6 sm:p-10 transition-colors ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
          : "bg-white bg-gradient-to-b to-[#7C01F6A3] text-black"
      }`}
    >
      <header className="text-center mb-8">
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl font-bold ${
            theme === "dark" ? "text-cyan-400" : "text-cyan-500"
          }`}
        >
          Speaker Catalog
        </h1>
      </header>

      <nav className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {languages.map((lang) => (
          <LanguageFilterButton
            key={lang.name}
            lang={lang}
            onToggle={handleLanguageToggle}
          />
        ))}
      </nav>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div
            className={`text-xl ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Loading speakers...
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredSpeakers.map((speaker, index) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              colorClasses={getColorClasses(index)}
              isBlurred={
                hoveredSpeakerId !== null && hoveredSpeakerId !== speaker.id
              }
              onMouseEnter={() => setHoveredSpeakerId(speaker.id)}
              onMouseLeave={() => setHoveredSpeakerId(null)}
            />
          ))}
        </main>
      )}
    </div>
  );
};

export default SpeakerCatalogPage;
