"use client";

import type { NextPage } from "next";
import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  Plus,
  PlusCircle,
  MessageSquare,
  Bookmark,
  RotateCw,
} from "lucide-react";
import { apiClient } from "@/app/lib/api";

// -------------------- Tipos --------------------
type SavedSpeaker = {
  id: string;
  name: string;
  avatarSeed: string;
  flagEmoji: string;
};

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

type RecentChat = {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  colorClass?: string;
  color?: ColorToken;
  avatarSeed: string;
  flagEmoji: string;
};

type SavedSpeakersResponse = {
  savedSpeakers: SavedSpeaker[];
};

type RecentChatsResponse = {
  recentChats: RecentChat[];
};

// -------------------- Helper para convertir emoji a código de país --------------------
function flagEmojiToCountryCode(flagEmoji: string): string {
  // Los emojis de banderas están compuestos por Regional Indicator Symbols
  // Extraemos los code points y los convertimos al código ISO del país
  const codePoints = [...flagEmoji].map((char) => char.codePointAt(0)!);
  const countryCode = codePoints
    .map((cp) => String.fromCharCode(cp - 127397))
    .join("")
    .toLowerCase();

  // Mapeo de códigos de país especiales que pueden tener diferentes códigos en circle-flags
  const specialMappings: Record<string, string> = {
    uk: "gb", // Reino Unido usa GB en circle-flags
    en: "gb", // Inglés genérico -> bandera de GB
  };

  return specialMappings[countryCode] || countryCode;
}

// -------------------- Map token -> gradiente Tailwind --------------------
const gradientMap: Record<ColorToken, string> = {
  teal: "from-teal-500 to-green-500",
  pink: "from-pink-500 to-rose-500",
  yellow: "from-yellow-500 to-orange-500",
  orange: "from-orange-500 to-orange-600",
  blue: "from-blue-500 to-blue-600",
  green: "from-emerald-500 to-green-600",
  red: "from-red-500 to-rose-600",
  purple: "from-purple-500 to-fuchsia-600",
  sky: "from-sky-500 to-sky-600",
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  rose: "from-rose-500 to-rose-600",
};

// -------------------- Sub-componente --------------------
const ChatListItem = ({
  name,
  lastMessage,
  timestamp,
  unread,
  colorClass,
  color,
  avatarSeed,
  flagEmoji,
  onChatClick,
}: RecentChat & { onChatClick: () => void }) => {
  const resolvedGradient =
    colorClass || (color ? gradientMap[color] : "from-gray-500 to-gray-700");

  const countryCode = flagEmojiToCountryCode(flagEmoji);

  return (
    <button
      onClick={onChatClick}
      className={`w-full flex items-center p-2 sm:p-3 rounded-2xl shadow-lg bg-gradient-to-r ${resolvedGradient} transition-transform hover:scale-[1.02]`}
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0">
        {/* Bandera circular de fondo */}
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
          <Image
            src={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
            alt={`${name}'s country flag`}
            layout="fill"
            className="object-cover"
            unoptimized={true}
          />
        </div>
        {/* Avatar encima */}
        <Image
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`}
          alt={`Avatar of ${name}`}
          layout="fill"
          className="rounded-full relative z-10"
          unoptimized={true}
        />
      </div>
      <div className="flex-grow flex flex-col items-start ml-3 sm:ml-4 text-left">
        <span className="font-bold text-md sm:text-lg text-white">{name}</span>
        <span className="text-white/80 text-sm sm:text-md truncate max-w-[120px] sm:max-w-xs">
          {lastMessage}
        </span>
      </div>
      <div className="flex flex-col items-end gap-2 text-right ml-auto pl-2">
        <span className="text-xs sm:text-sm text-white/90">{timestamp}</span>
        {unread && (
          <div className="w-3 h-3 rounded-full bg-slate-800 border-2 border-white/50"></div>
        )}
      </div>
    </button>
  );
};

const SpeakersPageV2: NextPage = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [savedSpeakers, setSavedSpeakers] = useState<SavedSpeaker[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [savedSpeakersResponse, recentChatsResponse] = await Promise.all([
          apiClient.get<SavedSpeakersResponse>("/speakers/saved"),
          apiClient.get<RecentChatsResponse>("/chats/recent"),
        ]);

        setSavedSpeakers(savedSpeakersResponse.savedSpeakers);
        setRecentChats(recentChatsResponse.recentChats);
      } catch (err: any) {
        setError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Escuchar eventos de actualización de speakers
    const handleSpeakerAdded = () => {
      fetchData();
    };

    window.addEventListener("speakerAdded", handleSpeakerAdded);

    return () => {
      window.removeEventListener("speakerAdded", handleSpeakerAdded);
    };
  }, []);

  const onSpeakerCatalogClick = useCallback(() => {
    router.push("/dashboard/speakers_catalog");
  }, [router]);

  const onAddSpeakerClick = useCallback(() => {
    router.push("/dashboard/speakers_catalog");
  }, [router]);

  const onChatClick = useCallback(() => {
    router.push("/dashboard/chat");
  }, [router]);

  if (loading) {
    return (
      <div
        className={`w-full min-h-screen flex items-center justify-center font-cabin transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
      >
        <div className="text-xl">Loading speakers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full min-h-screen flex items-center justify-center font-cabin transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
      >
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen relative font-cabin flex flex-col overflow-x-hidden transition-colors
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e] text-white"
            : "bg-gradient-to-b from-white to-purple-200 text-black"
        }`}
    >
      <main className="relative z-10 grid grid-cols-[minmax(1.5rem,1fr)_minmax(0,1280px)_minmax(1.5rem,1fr)] md:grid-cols-[minmax(2.5rem,1fr)_minmax(0,1280px)_minmax(2.5rem,1fr)] w-full flex-grow pt-6 md:pt-10 pb-32">
        <header className="flex flex-col items-start gap-6 col-start-2">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold ${
              theme === "dark" ? "text-cyan-400" : "text-cyan-500"
            }`}
          >
            Speakers
          </h1>
          <a
            href="/dashboard/speakers_catalog"
            className={`flex items-center justify-between gap-3 w-full sm:w-auto rounded-full pl-4 pr-2 py-2 sm:pl-6 sm:pr-3 sm:py-2.5 shadow-lg transition-transform hover:scale-105
                ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-400"}`}
          >
            <span
              className={`text-md sm:text-lg font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Speaker Catalog
            </span>
            <div className="bg-white rounded-full p-0.5">
              <PlusCircle
                size={28}
                className={`${
                  theme === "dark" ? "text-cyan-500" : "text-cyan-400"
                }`}
              />
            </div>
          </a>
        </header>

        <section className="flex flex-col items-start gap-4 mt-8 col-start-2">
          <button
            className={`rounded-full px-5 py-2 text-md font-bold shadow flex items-center gap-2
                ${
                  theme === "dark"
                    ? "bg-cyan-500/90 text-white"
                    : "bg-cyan-400 text-black"
                }`}
          >
            Your Saved Speakers
            <div
              className={`w-3 h-3 rounded-full ${
                theme === "dark"
                  ? "bg-cyan-200 border-2 border-cyan-800"
                  : "bg-cyan-600 border-2 border-cyan-900"
              }`}
            ></div>
          </button>
          <div className="w-full overflow-x-auto pb-4 -mb-4">
            <div className="flex items-start gap-4 pt-2 w-max">
              {savedSpeakers.map((speaker: SavedSpeaker) => {
                const countryCode = flagEmojiToCountryCode(speaker.flagEmoji);
                return (
                  <div
                    key={speaker.id}
                    className="flex flex-col items-center gap-2 w-24 sm:w-28 flex-shrink-0"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer transition-transform hover:scale-105">
                      {/* Bandera circular de fondo */}
                      <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
                          alt={`${speaker.name}'s country flag`}
                          layout="fill"
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                      {/* Avatar encima */}
                      <Image
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
                        alt={`${speaker.name}'s avatar`}
                        layout="fill"
                        className="rounded-full relative z-10"
                        unoptimized={true}
                      />
                    </div>
                    <span
                      className={`text-md sm:text-lg font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {speaker.name}
                    </span>
                  </div>
                );
              })}
              <div className="flex flex-col items-center gap-2 w-24 sm:w-28 flex-shrink-0">
                <a
                  href="/dashboard/speakers_catalog"
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-colors
                            ${
                              theme === "dark"
                                ? "bg-gray-800/60 hover:bg-gray-700/80"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                >
                  <Plus
                    size={40}
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </a>
                <span
                  className={`text-md sm:text-lg font-semibold ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Add
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-start gap-4 mt-8 col-start-2 w-full">
          <div className="flex items-center gap-2 bg-red-500 rounded-full px-4 py-1.5 shadow-lg">
            <span className="text-md font-bold text-white">Recents</span>
            <RotateCw size={16} className="text-white/80" />
          </div>

          {recentChats.length > 0 ? (
            <div className="w-full flex flex-col gap-3">
              {recentChats.map((chat: RecentChat) => (
                <ChatListItem
                  key={chat.id}
                  {...chat}
                  onChatClick={onChatClick}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={onAddSpeakerClick}
              className={`w-full max-w-md p-0.5 rounded-2xl shadow-lg transition-shadow
                ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-purple-500/50"
                    : "bg-gradient-to-br from-purple-400 to-pink-400 hover:shadow-purple-400/50"
                }`}
            >
              <div
                className={`rounded-[14px] flex items-center gap-4 sm:gap-5 p-3 sm:p-4 ${
                  theme === "dark" ? "bg-[#31115e]" : "bg-purple-100"
                }`}
              >
                <div
                  className={`rounded-full p-2 sm:p-3 shadow-md ${
                    theme === "dark" ? "bg-purple-600" : "bg-purple-500"
                  }`}
                >
                  <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-left">
                  <p
                    className={`text-lg sm:text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-purple-900"
                    }`}
                  >
                    Add a Speaker
                  </p>
                  <p
                    className={`text-sm sm:text-base ${
                      theme === "dark" ? "text-gray-300" : "text-purple-800"
                    }`}
                  >
                    Tap here to pick a personality
                  </p>
                </div>
              </div>
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default SpeakersPageV2;
