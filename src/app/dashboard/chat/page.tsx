"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useChat } from "@/hooks/useChat";
import { ChatMessages, Message as ApiMessage, Speaker } from "@/services/types";
import { useSearchParams } from "next/navigation";
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

// Default theme configuration
const defaultTheme = {
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
};

// --- SUB-COMPONENTE: Modal de Perfil del Speaker ---
const SpeakerProfileModal = ({
  speaker,
  theme,
  onClose,
}: {
  speaker: Speaker;
  theme: typeof defaultTheme;
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
                {speaker.description?.split(" ")[0] || speaker.language}{" "}
                <span>🇩🇪</span>
              </p>
            </div>
            <div className="relative w-32 h-32">
              <Image
                src={speaker.avatarUrl}
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
                {speaker.personality?.map((p) => <li key={p}>{p}</li>) || (
                  <li>No personality traits available</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg">Interests</h4>
              <ul className="mt-1 space-y-1 text-md">
                {speaker.interests?.map((i) => <li key={i}>{i}</li>) || (
                  <li>No interests available</li>
                )}
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
  message: ApiMessage;
  speaker: Speaker;
  theme: typeof defaultTheme;
  onClose: () => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const words = message.content.split(/\s+/);
  const [selectedWords, setSelectedWords] = useState<string[]>([
    words[0] || "",
  ]);

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
              src={speaker.avatarUrl}
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
              {speaker.description || `${speaker.language} Speaker`}
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
  speaker: Speaker;
  theme: typeof defaultTheme;
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
          {speaker.description || `${speaker.language} Speaker`}
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
          src={speaker.avatarUrl}
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
  message: ApiMessage;
  speaker: Speaker;
  theme: typeof defaultTheme;
  onAnalyze: (msg: ApiMessage) => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const isUser = message.senderType === "user";
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
            src={speaker.avatarUrl}
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
          <p className="font-semibold">{message.content}</p>
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
const ChatInputBar = ({
  theme,
  onSendMessage,
}: {
  theme: typeof defaultTheme;
  onSendMessage: (message: string) => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          onKeyDown={handleKeyPress}
          placeholder="Type your message"
          className={`w-full rounded-lg py-3 pl-4 pr-12 outline-none ${
            isDark
              ? "bg-[#232323] text-white placeholder:text-gray-400"
              : "bg-white text-black placeholder:text-gray-500"
          }`}
        />
      </div>
      <button
        onClick={handleSend}
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
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const { getChatMessages, sendMessage, loading, error } = useChat();
  const searchParams = useSearchParams();

  // Estados locales
  const [chatData, setChatData] = useState<ChatMessages | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState<ApiMessage | null>(
    null
  );
  const [conversationId, setConversationId] = useState<string>(
    searchParams.get("conversationId") || "default-conversation"
  );

  // Cargar datos del chat al montar el componente
  useEffect(() => {
    const loadChatData = async () => {
      try {
        const data = await getChatMessages(conversationId);
        if (data) {
          setChatData(data);
        }
      } catch (err) {
        console.error("Error loading chat data:", err);
      }
    };

    loadChatData();
  }, [conversationId, getChatMessages]);

  // Función para enviar mensaje
  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage({
        conversationId,
        content,
        type: "text",
      });

      // Recargar mensajes después de enviar
      const updatedData = await getChatMessages(conversationId);
      if (updatedData) {
        setChatData(updatedData);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Mostrar loading o error
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-400"></div>
          <p className="mt-4 text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error || !chatData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">
            {error || "Failed to load chat data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-teal-400 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { speakerInfo, messages } = chatData;

  return (
    <div
      className={`w-full h-screen font-cabin flex flex-col overflow-hidden transition-colors ${
        isDark
          ? `bg-gradient-to-b ${defaultTheme.gradientFrom} ${defaultTheme.gradientTo}`
          : `bg-gradient-to-b ${defaultTheme.lightGradientFrom} ${defaultTheme.lightGradientTo}`
      }`}
    >
      <ChatHeader
        speaker={speakerInfo}
        theme={defaultTheme}
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
                  speaker={speakerInfo}
                  theme={defaultTheme}
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

      <ChatInputBar theme={defaultTheme} onSendMessage={handleSendMessage} />

      {isProfileModalOpen && (
        <SpeakerProfileModal
          speaker={speakerInfo}
          theme={defaultTheme}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
      {analyzingMessage && (
        <AnalyzeWordsModal
          message={analyzingMessage}
          speaker={speakerInfo}
          theme={defaultTheme}
          onClose={() => setAnalyzingMessage(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;
