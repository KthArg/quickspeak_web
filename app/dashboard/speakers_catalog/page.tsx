"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
// Update the import path if apiClient is located elsewhere, for example:
import { apiClient } from "../../lib/api";

// -------------------- Tipos --------------------
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

type SpeakerDTO = {
  id: string;
  name: string;
  language: string;
  flagEmoji: string; // Ej: "🇫🇷"
  avatarSeed: string;
  personality: string[];
  interests: string[];
  color: ColorToken; // token simple desde el mock
};

type SpeakersResponse = { speakers: SpeakerDTO[] };

type SpeakerUI = SpeakerDTO & {
  colorClasses: { bg: string; cardBg: string; text: string; border: string };
};

type LanguageUI = {
  name: string;
  flag: string;
  active: boolean;
  color: string;
};

// -------------------- Map color token -> Tailwind --------------------
const colorMap: Record<
  ColorToken,
  { bg: string; cardBg: string; text: string; border: string }
> = {
  teal: {
    bg: "bg-[#06d6a0]",
    cardBg: "bg-[#50f9c2]",
    text: "text-gray-800",
    border: "border-[#06d6a0]",
  },
  pink: {
    bg: "bg-[#ef476f]",
    cardBg: "bg-[#fe6788]",
    text: "text-white",
    border: "border-[#ef476f]",
  },
  yellow: {
    bg: "bg-[#ffd166]",
    cardBg: "bg-[#ffe08a]",
    text: "text-gray-800",
    border: "border-[#ffd166]",
  },
  orange: {
    bg: "bg-orange-500",
    cardBg: "bg-orange-400",
    text: "text-white",
    border: "border-orange-500",
  },
  blue: {
    bg: "bg-blue-500",
    cardBg: "bg-blue-400",
    text: "text-white",
    border: "border-blue-500",
  },
  green: {
    bg: "bg-green-500",
    cardBg: "bg-green-400",
    text: "text-white",
    border: "border-green-500",
  },
  red: {
    bg: "bg-red-400",
    cardBg: "bg-red-300",
    text: "text-gray-800",
    border: "border-red-400",
  },
  purple: {
    bg: "bg-purple-500",
    cardBg: "bg-purple-400",
    text: "text-white",
    border: "border-purple-500",
  },
  sky: {
    bg: "bg-sky-600",
    cardBg: "bg-sky-500",
    text: "text-white",
    border: "border-sky-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    cardBg: "bg-indigo-400",
    text: "text-white",
    border: "border-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    cardBg: "bg-emerald-400",
    text: "text-white",
    border: "border-emerald-500",
  },
  rose: {
    bg: "bg-rose-500",
    cardBg: "bg-rose-400",
    text: "text-white",
    border: "border-rose-500",
  },
};

// -------------------- Helpers --------------------
// Deriva los idiomas únicos a partir de speakers (usa language + flagEmoji)
function deriveLanguages(list: SpeakerDTO[]): LanguageUI[] {
  const seen = new Map<string, { name: string; flag: string }>();
  for (const s of list) {
    const key = `${s.language}__${s.flagEmoji || ""}`.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.set(key, { name: s.language, flag: s.flagEmoji || "🏳️" });
    }
  }
  // color de chip igual al que ya usabas en dark (puedes cambiarlo si quieres)
  return Array.from(seen.values()).map((l) => ({
    name: l.name,
    flag: l.flag,
    active: false,
    color: "bg-red-500 text-white",
  }));
}

// -------------------- Subcomponentes --------------------
const SpeakerCard = ({
  speaker,
  isBlurred,
  onMouseEnter,
  onMouseLeave,
}: {
  speaker: SpeakerUI;
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
            ? `${speaker.colorClasses.bg}`
            : ` bg-white border-4 ${speaker.colorClasses.border}`
        }
      `}
    >
      <div
        className={`w-2/5 flex-shrink-0 flex flex-col justify-between items-center p-4 pb-0 ${speaker.colorClasses.cardBg} rounded-r-3xl`}
      >
        <div className="text-center text-gray-800">
          <h3 className="text-2xl font-bold">{speaker.name}</h3>
          <p className="flex items-center justify-center gap-1 font-semibold">
            {speaker.language} <span>{speaker.flagEmoji}</span>
          </p>
        </div>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
          <Image
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
            alt={`Avatar of ${speaker.name}`}
            layout="fill"
            unoptimized={true}
          />
        </div>
      </div>
      <div
        className={`w-3/5 p-4 flex flex-col gap-3 ${
          theme === "dark" ? speaker.colorClasses.text : "text-gray-800"
        }`}
      >
        <div>
          <h4 className="font-bold text-lg">Personality</h4>
          <ul className="mt-1 space-y-1 text-md">
            {speaker.personality.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg">Interests</h4>
          <ul className="mt-1 space-y-1 text-md">
            {speaker.interests.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const LanguageFilter = ({
  lang,
  onToggle,
}: {
  lang: LanguageUI;
  onToggle: (name: string) => void;
}) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={() => onToggle(lang.name)}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-md font-bold transition-all shadow-md
        ${
          lang.active
            ? theme === "dark"
              ? lang.color
              : `${lang.color.replace(
                  "text-white",
                  "text-black"
                )} border-2 border-gray-800/50`
            : theme === "dark"
            ? "border-2 border-dashed border-gray-500 text-gray-400 hover:bg-gray-700"
            : "border-2 border-dashed border-gray-400 text-gray-500 hover:bg-gray-100"
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

// -------------------- Página --------------------
const SpeakerCatalogPage: NextPage = () => {
  const { theme } = useTheme();

  const [speakers, setSpeakers] = useState<SpeakerUI[]>([]);
  const [languages, setLanguages] = useState<LanguageUI[]>([]);
  const [hoveredSpeakerId, setHoveredSpeakerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { speakers } = await apiClient.get<SpeakersResponse>(
          "/speakers/catalog"
        );
        if (!alive) return;

        const speakersUI: SpeakerUI[] = speakers.map((s) => ({
          ...s,
          colorClasses: colorMap[s.color] ?? colorMap.teal,
        }));

        setSpeakers(speakersUI);
        setLanguages(deriveLanguages(speakers));
        setLoading(false);
      } catch (e: any) {
        setError(e?.message ?? "Error loading data");
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleLanguageToggle = useCallback((langName: string) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.name === langName ? { ...lang, active: !lang.active } : lang
      )
    );
  }, []);

  const filteredSpeakers = useMemo(() => {
    const active = languages.filter((l) => l.active).map((l) => l.name);
    if (active.length === 0) return speakers;
    return speakers.filter((s) => active.includes(s.language));
  }, [languages, speakers]);

  if (loading)
    return <div className="p-10 text-center">Cargando catálogo…</div>;
  if (error)
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;

  return (
    <div
      className={`w-full min-h-screen font-cabin p-6 sm:p-10 transition-colors
      ${
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
          <LanguageFilter
            key={lang.name}
            lang={lang}
            onToggle={handleLanguageToggle}
          />
        ))}
      </nav>

      <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredSpeakers.map((speaker) => (
          <SpeakerCard
            key={speaker.id}
            speaker={speaker}
            isBlurred={
              hoveredSpeakerId !== null && hoveredSpeakerId !== speaker.id
            }
            onMouseEnter={() => setHoveredSpeakerId(speaker.id)}
            onMouseLeave={() => setHoveredSpeakerId(null)}
          />
        ))}
      </main>
    </div>
  );
};

export default SpeakerCatalogPage;
