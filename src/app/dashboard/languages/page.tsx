"use client";

import React, { useState, useCallback, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Languages, X } from "lucide-react";
import { apiClient } from "@/app/lib/api";

type Language = {
  id: number;
  name: string;
  flagUrl: string;
};

const LanguageIcon = ({
  lang,
  isNative,
  onClick,
}: {
  lang: Language;
  isNative: boolean;
  onClick: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 text-center transition-transform hover:scale-105"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full">
        <Image
          src={lang.flagUrl}
          alt={`${lang.name} flag`}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-bold text-lg ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {lang.name}
        </span>
        {isNative && (
          <span className="font-semibold text-sm text-cyan-400">Native</span>
        )}
      </div>
    </button>
  );
};

const AddLanguageCard = () => {
  const { theme } = useTheme();
  return (
    <a
      href="/dashboard/add_languages"
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
    </a>
  );
};

const LanguageModal = ({
  lang,
  isNative,
  onMakeNative,
  onRemove,
  onClose,
}: {
  lang: Language;
  isNative: boolean;
  onMakeNative: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onClose: () => void;
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState<"native" | "remove" | null>(null);

  const makeNative = async () => {
    try {
      setLoading("native");
      await onMakeNative(lang.id);
    } finally {
      setLoading(null);
    }
  };

  const remove = async () => {
    try {
      setLoading("remove");
      await onRemove(lang.id);
    } finally {
      setLoading(null);
    }
  };

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
            onClick={makeNative}
            disabled={isNative || loading !== null}
            className={`w-full rounded-full py-2.5 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              ${
                theme === "dark"
                  ? "bg-cyan-400 text-black"
                  : "bg-cyan-500 text-white"
              }`}
          >
            {isNative
              ? "Current Native Language"
              : loading === "native"
              ? "Setting…"
              : "Make Native Language"}
          </button>
          <p
            className={`text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } max-w-xs`}
          >
            This will make this the language in which clarifications are given
            to you.
          </p>
        </div>

        {!isNative && (
          <button
            onClick={remove}
            disabled={loading !== null}
            className={`w-full rounded-full py-2 font-bold text-lg transition-colors
              ${
                theme === "dark"
                  ? "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500/10"
                  : "bg-white border-2 border-red-500 text-red-500 hover:bg-red-500/5"
              }`}
          >
            {loading === "remove" ? "Removing…" : "Remove from Languages"}
          </button>
        )}
      </div>
    </div>
  );
};

const LanguagesPage: NextPage = () => {
  const { theme } = useTheme();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [nativeLanguageId, setNativeLanguageId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/languages/catalog');
        const data = await response.json();
        setLanguages(data.languages);
        setNativeLanguageId(data.nativeLanguageId);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando idiomas");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMakeNative = useCallback(async (id: number) => {
    const response = await fetch('/api/languages/native', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (data.success) {
      setNativeLanguageId(data.nativeLanguageId);
      setSelectedLanguage(null);
    }
  }, []);

  const handleRemoveLanguage = useCallback(async (id: number) => {
    const response = await fetch('/api/languages/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await response.json();
    if (data.success) {
      setLanguages((prev) => prev.filter((l) => l.id !== id));
      setSelectedLanguage(null);
    }
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando idiomas…</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

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
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl font-bold ${
            theme === "dark" ? "text-cyan-400" : "text-cyan-500"
          }`}
        >
          Languages
        </h1>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {languages.map((lang) => (
            <LanguageIcon
              key={lang.id}
              lang={lang}
              isNative={nativeLanguageId === lang.id}
              onClick={() => setSelectedLanguage(lang)}
            />
          ))}
        </div>
      </main>

      <footer className="mt-16 w-full flex justify-center">
        <AddLanguageCard />
      </footer>

      {selectedLanguage && nativeLanguageId !== null && (
        <LanguageModal
          lang={selectedLanguage}
          isNative={selectedLanguage.id === nativeLanguageId}
          onMakeNative={handleMakeNative}
          onRemove={handleRemoveLanguage}
          onClose={() => setSelectedLanguage(null)}
        />
      )}
    </div>
  );
};

export default LanguagesPage;
