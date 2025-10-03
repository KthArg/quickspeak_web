"use client";

import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useParams } from "next/navigation";
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

// -----------------------------
// Tipos
// -----------------------------
type Speaker = {
  name: string;
  description: string;
  avatarSeed: string;
  flagUrl: string;
  personality: string[];
  interests: string[];
};

type Message = { id: number; sender: "speaker" | "user"; text: string };

type ChatSessionDTO = {
  speaker: Speaker;
  messages: Message[];
};

type SendMessageRequest = { text: string };

type SendMessageResponse = {
  success: boolean;
  echo?: {
    receivedAtUtc: string;
    sessionId: string;
    yourMessage: string;
  };
  assistantReply?: {
    id: number;
    sender: "speaker" | "user";
    text: string;
  };
};

// -----------------------------
// Theme local- Esto no va en el mock!!!!!
// -----------------------------
const theme = {
  // Dark
  headerBg: "bg-teal-400",
  inputBg: "bg-teal-400",
  speakerBubbleBg: "bg-teal-400",
  userBubbleBg: "bg-sky-500",
  textColor: "text-gray-800",
  gradientFrom: "from-gray-900",
  gradientTo: "to-teal-900",
  // Light
  lightHeaderBg: "bg-teal-400",
  lightInputBg: "bg-teal-400",
  lightSpeakerBubbleBg: "bg-teal-200",
  lightUserBubbleBg: "bg-gray-700",
  lightTextColor: "text-black",
  lightGradientFrom: "from-white",
  lightGradientTo: "to-teal-100",
};

// -----------------------------
// Subcomponentes
// ------------------------------
const SpeakerProfileModal = ({
  speaker,
  onClose,
}: {
  speaker: Speaker;
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
                unoptimized
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
          <div className="w-8 h-8 rounded-full bg-teal-400 border-2 border-white cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-sky-500 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const AnalyzeWordsModal = ({
  message,
  speaker,
  onClose,
}: {
  message: Message;
  speaker: Speaker;
  onClose: () => void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const words = message.text.split(/\s+/);
  const [selectedWords, setSelectedWords] = React.useState<string[]>([]);

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
              unoptimized
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

const ChatHeader = ({
  speaker,
  onAvatarClick,
}: {
  speaker: Speaker;
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
      <div className="flex flex-col items-start">
        <h1 className="text-xl font-bold">{speaker.name}</h1>
        <p className={`text-sm ${isDark ? "opacity-90" : "opacity-70"}`}>
          {speaker.description}
        </p>
      </div>
      <button
        onClick={onAvatarClick}
        className="relative w-14 h-14 rounded-full hover:scale-105 transition-transform"
        aria-label="Open speaker profile"
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
          unoptimized
        />
      </button>
    </header>
  );
};

const ChatMessage = ({
  message,
  speaker,
  onAnalyze,
}: {
  message: Message;
  speaker: Speaker;
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
            unoptimized
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
              title="Analyze words"
            >
              <Book size={20} />
            </button>
            <button className="hover:text-white" title="Play audio">
              <Volume2 size={20} />
            </button>
            <button className="hover:text-white" title="Copy">
              <Copy size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatInputBar = ({
  onSend,
}: {
  onSend: (text: string) => Promise<void> | void;
}) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await onSend(message.trim());
      setMessage(""); // limpiar si todo ok
    } finally {
      setSending(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSend();
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
        disabled={sending}
        title="Bookmark"
      >
        <Bookmark size={32} />
      </button>
      <button
        className={`${
          isDark ? theme.textColor : theme.lightTextColor
        } hover:opacity-80`}
        disabled={sending}
        title="Mic"
      >
        <Mic size={32} />
      </button>
      <div className="flex-grow relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={sending ? "Enviando..." : "Type your message"}
          className={`w-full rounded-lg py-3 pl-4 pr-12 outline-none ${
            isDark
              ? "bg-[#232323] text-white placeholder:text-gray-400"
              : "bg-white text-black placeholder:text-gray-500"
          }`}
          disabled={sending}
        />
      </div>
      <button
        className={`${
          isDark ? theme.textColor : theme.lightTextColor
        } hover:opacity-80 disabled:opacity-50`}
        onClick={handleSend}
        disabled={sending}
        title="Send"
      >
        <Send size={32} />
      </button>
    </footer>
  );
};

// -----------------------------
// Página principal
// -----------------------------
const ChatPage: NextPage = () => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const params = useParams();

  const [speaker, setSpeaker] = React.useState<Speaker | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [analyzingMessage, setAnalyzingMessage] =
    React.useState<Message | null>(null);

  // Obtener los parámetros de la URL
  const speakerId = params.speaker_id as string;
  const chatId = params.chat_id as string;
  const sessionId = chatId; // Usar chatId como sessionId

  // Carga inicial: GET /chat/session/{chatId}
  React.useEffect(() => {
    if (!chatId || !speakerId) {
      setError("Parámetros de chat inválidos");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await fetch(`/api/chat/session/${sessionId}`);
        const data = await response.json();
        setSpeaker(data.speaker);
        setMessages(data.messages);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando chat");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, chatId, speakerId]);

  // Envío: POST /chat/session/{chatId}/message
  const handleSendMessage = async (text: string) => {
    // 1) push del usuario
    const tempId = Date.now();
    const userMsg: Message = { id: tempId, sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const body: SendMessageRequest = { text };
      const response = await fetch(`/api/chat/session/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const resp = await response.json();

      if (resp?.assistantReply) {
        const aiMsg: Message = {
          id: resp.assistantReply.id,
          sender: "speaker",
          text: resp.assistantReply.text,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e: any) {
      // rollback si falla
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert(e?.message ?? "No se pudo enviar el mensaje");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Cargando chat…</div>;
  }

  if (error || !speaker) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error ?? "No se pudo obtener el speaker."}
      </div>
    );
  }

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

      <ChatInputBar onSend={handleSendMessage} />

      {isProfileModalOpen && (
        <SpeakerProfileModal
          speaker={speaker}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
      {analyzingMessage && (
        <AnalyzeWordsModal
          message={analyzingMessage}
          speaker={speaker}
          onClose={() => setAnalyzingMessage(null)}
        />
      )}
    </div>
  );
};

export default ChatPage;
