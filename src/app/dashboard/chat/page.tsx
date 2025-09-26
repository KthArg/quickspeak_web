"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  Menu,
  Book,
  Volume2,
  Copy,
  Bookmark,
  Mic,
  Send,
  X,
} from "lucide-react";

// --- DATOS DINÁMICOS DEL CHAT ---
const chatData = {
  speaker: {
    name: "Harper",
    description: "German Speaker",
    avatarSeed: "Harper",
    flagUrl: "https://unpkg.com/circle-flags/flags/de.svg",
    personality: ["😛 Cheeky", "🤓 Nerdy"],
    interests: ["🧛 Vampires", "🦾 Robotics", "🎵 Coldplay"],
  },
  theme: {
    // Dark mode colors
    headerBg: "bg-teal-400",
    inputBg: "bg-teal-400",
    speakerBubbleBg: "bg-teal-400",
    userBubbleBg: "bg-sky-500",
    textColor: "text-gray-800",
    gradientFrom: "from-gray-900",
    gradientTo: "to-teal-900",
    // Light mode colors
    lightHeaderBg: "bg-teal-400",
    lightInputBg: "bg-teal-400",
    lightSpeakerBubbleBg: "bg-teal-200",
    lightUserBubbleBg: "bg-gray-700",
    lightTextColor: "text-black",
    lightGradientFrom: "from-white",
    lightGradientTo: "to-teal-100",
  },
  messages: [
    { id: 1, sender: "speaker", text: "Hallo, wie geht's?" },
    { id: 2, sender: "user", text: "Hallo, mir geht's gut, und door?" },
    {
      id: 3,
      sender: "speaker",
      text: "Mir geht es gut, aber du hast einen kleinen Fehler gemacht, es heißt nicht “door”, sondern “dir”.",
    },
    {
      id: 4,
      sender: "user",
      text: "Danke, danke! Übrigens, magst du Coldplay?",
    },
    { id: 5, sender: "speaker", text: "Ich mag Coldplay nicht besonders, du?" },
  ],
};

type Message = (typeof chatData.messages)[0];

// --- SUB-COMPONENTE: Modal de Perfil del Speaker ---
const SpeakerProfileModal = ({
  speaker,
  theme,
  onClose,
}: {
  speaker: typeof chatData.speaker;
  theme: typeof chatData.theme;
  onClose: () => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col ${
          isDark ? theme.speakerBubbleBg : theme.lightSpeakerBubbleBg
        } w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl pb-2`}
      >
        <div
          className={`flex ${
            isDark ? theme.speakerBubbleBg : theme.lightSpeakerBubbleBg
          }`}
        >
          <div
            className={`w-2/5 flex-shrink-0 flex flex-col justify-between items-center mb-4 p-4 pb-0 ${
              isDark ? "bg-teal-300/80" : "bg-white"
            } shadow-2xl rounded-3xl`}
          >
            <div
              className={`text-center ${
                isDark ? "text-gray-800" : "text-black"
              }`}
            >
              <h3 className="text-2xl font-bold">{speaker.name}</h3>
              <p className="flex items-center justify-center gap-1 font-semibold">
                {speaker.description.split(" ")[0]} <span>🇩🇪</span>
              </p>
            </div>
            <div className="relative w-32 h-32">
              <Image
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
                alt={`Avatar of ${speaker.name}`}
                layout="fill"
                unoptimized={true}
              />
            </div>
          </div>
          <div
            className={`w-3/5 p-4 flex flex-col gap-4 ${
              isDark ? theme.textColor : theme.lightTextColor
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
            <button
              onClick={onClose}
              className={`mt-auto self-start flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-sm font-semibold ${
                isDark
                  ? "border-gray-800/50 hover:bg-gray-800/20"
                  : "border-gray-400 hover:bg-gray-200"
              }`}
            >
              <X size={16} /> Close
            </button>
          </div>
        </div>
        <div
          className={`p-2 flex justify-around rounded-3xl mx-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-teal-400 border-2 border-white cursor-pointer"></div>
          <div className="w-8 h-8 rounded-full bg-sky-500 cursor-pointer"></div>
          <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer"></div>
          <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: Modal para Analizar Palabras ---
const AnalyzeWordsModal = ({
  message,
  speaker,
  theme,
  onClose,
}: {
  message: Message;
  speaker: typeof chatData.speaker;
  theme: typeof chatData.theme;
  onClose: () => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const words = message.text.split(/\s+/);
  const [selectedWords, setSelectedWords] = useState<string[]>(["heißt"]);

  const toggleWordSelection = (word: string) =>
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm rounded-3xl ${
          isDark ? "bg-[#232323]" : "bg-white"
        } shadow-lg flex flex-col`}
      >
        <div
          className={`${
            isDark ? theme.speakerBubbleBg : theme.lightSpeakerBubbleBg
          } ${
            isDark ? "text-white" : "text-black"
          } rounded-t-3xl p-4 flex flex-col items-center gap-2`}
        >
          <div className="relative w-16 h-16 rounded-full">
            <Image
              src={speaker.flagUrl}
              alt={`${speaker.name}'s flag`}
              layout="fill"
              className="rounded-full object-cover"
            />
            <Image
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
              alt={`Avatar of ${speaker.name}`}
              layout="fill"
              className="rounded-full"
              unoptimized={true}
            />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold">{speaker.name}</h3>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {speaker.description}
            </p>
          </div>
        </div>
        <div className="p-4 flex flex-wrap justify-center gap-2">
          {words.map((word, index) => (
            <button
              key={`${word}-${index}`}
              onClick={() => toggleWordSelection(word)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                selectedWords.includes(word)
                  ? "bg-white text-sky-600 border-4 border-sky-400"
                  : `${
                      isDark
                        ? theme.speakerBubbleBg
                        : theme.lightSpeakerBubbleBg
                    } ${isDark ? "text-gray-800" : "text-black"}`
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full bg-white text-sky-600 border-4 border-sky-400 rounded-full py-2 font-bold text-lg">
            Ask About Selected Words
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`flex-1 border-2 rounded-full py-2 font-bold ${
                isDark
                  ? "bg-gray-800 text-sky-400 border-sky-400"
                  : "border-cyan-500 text-cyan-600"
              }`}
            >
              Close
            </button>
            <button
              className={`flex-1 border-2 rounded-full py-2 font-bold ${
                isDark
                  ? "bg-sky-400 text-gray-800 border-sky-400"
                  : "bg-cyan-500 text-white border-cyan-500"
              }`}
            >
              Save to Dictionary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: Encabezado del Chat ---
const ChatHeader = ({
  speaker,
  theme,
  onAvatarClick,
}: {
  speaker: typeof chatData.speaker;
  theme: typeof chatData.theme;
  onAvatarClick: () => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  return (
    <header
      className={`flex m-4 rounded-3xl items-center justify-between p-4 shadow-lg z-20 flex-shrink-0 ${
        isDark ? theme.headerBg : theme.lightHeaderBg
      } ${isDark ? theme.textColor : theme.lightTextColor}`}
    >
      <button className="hover:opacity-80">
        <Menu size={32} />
      </button>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold">{speaker.name}</h1>
        <p className={`text-sm ${isDark ? "opacity-90" : "opacity-70"}`}>
          {speaker.description}
        </p>
      </div>
      <button
        onClick={onAvatarClick}
        className="relative w-14 h-14 rounded-full hover:scale-105 transition-transform"
      >
        <Image
          src={speaker.flagUrl}
          alt={`${speaker.name}'s flag`}
          layout="fill"
          className="rounded-full object-cover"
        />
        <Image
          src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
          alt={`Avatar of ${speaker.name}`}
          layout="fill"
          className="rounded-full"
          unoptimized={true}
        />
      </button>
    </header>
  );
};

// --- SUB-COMPONENTE: Burbuja de Mensaje ---
const ChatMessage = ({
  message,
  speaker,
  theme,
  onAnalyze,
}: {
  message: Message;
  speaker: typeof chatData.speaker;
  theme: typeof chatData.theme;
  onAnalyze: (msg: Message) => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const isUser = message.sender === "user";
  return (
    <div
      className={`flex items-start gap-3 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="relative w-12 h-12 rounded-full flex-shrink-0 mt-2">
          <Image
            src={speaker.flagUrl}
            alt={`${speaker.name}'s flag`}
            layout="fill"
            className="rounded-full object-cover"
          />
          <Image
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
            alt={`Avatar of ${speaker.name}`}
            layout="fill"
            className="rounded-full"
            unoptimized={true}
          />
        </div>
      )}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
            isUser
              ? isDark
                ? theme.userBubbleBg + " text-white"
                : theme.lightUserBubbleBg + " text-white"
              : isDark
              ? theme.speakerBubbleBg + " " + theme.textColor
              : theme.lightSpeakerBubbleBg + " " + theme.lightTextColor
          }`}
        >
          <p className="font-semibold">{message.text}</p>
        </div>
        {!isUser && (
          <div
            className={`flex items-center gap-3 mt-2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <button
              onClick={() => onAnalyze(message)}
              className="hover:text-white"
            >
              <Book size={20} />
            </button>
            <button className="hover:text-white">
              <Volume2 size={20} />
            </button>
            <button className="hover:text-white">
              <Copy size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTE: Barra de Entrada de Texto ---
const ChatInputBar = ({ theme }: { theme: typeof chatData.theme }) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [message, setMessage] = useState("");
  return (
    <footer
      className={`flex m-4 rounded-3xl items-center gap-2 sm:gap-4 p-3 shadow-lg z-20 flex-shrink-0 ${
        isDark ? theme.inputBg : theme.lightInputBg
      }`}
    >
      <button
        className={`${
          isDark ? theme.textColor : theme.lightTextColor
        } hover:opacity-80`}
      >
        <Bookmark size={32} />
      </button>
      <button
        className={`${
          isDark ? theme.textColor : theme.lightTextColor
        } hover:opacity-80`}
      >
        <Mic size={32} />
      </button>
      <div className="flex-grow relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className={`w-full rounded-lg py-3 pl-4 pr-12 outline-none ${
            isDark
              ? "bg-[#232323] text-white placeholder:text-gray-400"
              : "bg-white text-black placeholder:text-gray-500"
          }`}
        />
      </div>
      <button
        className={`${
          isDark ? theme.textColor : theme.lightTextColor
        } hover:opacity-80`}
      >
        <Send size={32} />
      </button>
    </footer>
  );
};

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
const ChatPage: NextPage = () => {
  const { speaker, theme, messages } = chatData;
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState<Message | null>(
    null
  );

  return (
    <div
      className={`w-full h-screen font-cabin flex flex-col overflow-hidden transition-colors ${
        isDark
          ? `bg-gradient-to-b ${theme.gradientFrom} ${theme.gradientTo}`
          : `bg-gradient-to-b ${theme.lightGradientFrom} ${theme.lightGradientTo}`
      }`}
    >
      <ChatHeader
        speaker={speaker}
        theme={theme}
        onAvatarClick={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-grow flex flex-col-reverse p-4 sm:p-6 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {messages
            .slice()
            .reverse()
            .map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ChatMessage
                  message={msg}
                  speaker={speaker}
                  theme={theme}
                  onAnalyze={setAnalyzingMessage}
                />
                {index === messages.length - 1 && (
                  <div className="text-center my-4">
                    <span
                      className={`font-bold text-sm ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Today
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </main>

      <ChatInputBar theme={theme} />

      {isProfileModalOpen && (
        <SpeakerProfileModal
          speaker={speaker}
          theme={theme}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
      {analyzingMessage && (
        <AnalyzeWordsModal
          message={analyzingMessage}
          speaker={speaker}
          theme={theme}
          onClose={() => setAnalyzingMessage(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;
