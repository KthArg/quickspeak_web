'use client';

import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useParams } from 'next/navigation';
import { useTheme } from '@/app/contexts/ThemeContext';
import {
  Menu,
  Book,
  Volume2,
  Copy,
  Bookmark,
  Mic,
  Send,
  X,
} from 'lucide-react';
import { apiClient, type Speaker, type ChatMessage, type SendMessageResponse } from '@/app/lib/api';
import { getVoiceLanguageCode, isVoiceSupported } from '@/app/lib/voiceUtils';
import VoiceRecorder from '@/app/components/VoiceRecorder';
import Image from 'next/image';

type ChatPageParams = {
  speaker_id: string;
  chat_id: string;
};

const themeColors = {
  // Dark mode
  headerBg: 'bg-teal-400',
  inputBg: 'bg-teal-400',
  speakerBubbleBg: 'bg-teal-400',
  userBubbleBg: 'bg-sky-500',
  textColor: 'text-gray-800',
  gradientFrom: 'from-gray-900',
  gradientTo: 'to-teal-900',
  // Light mode equivalents
  lightHeaderBg: 'bg-teal-400',
  lightInputBg: 'bg-teal-400',
  lightSpeakerBubbleBg: 'bg-teal-200',
  lightUserBubbleBg: 'bg-gray-700',
  lightTextColor: 'text-black',
  lightGradientFrom: 'from-white',
  lightGradientTo: 'to-teal-100',
};

const ChatPage: NextPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams<ChatPageParams>();
  const sessionId = params.chat_id;
  const speakerId = params.speaker_id;

  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [analyzingMessage, setAnalyzingMessage] = useState<ChatMessage | null>(null);

  // Load chat session
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(`/conversation/chat/session/${sessionId}`);
        if (!isMounted) return;
        setSpeaker(data.speaker);
        setMessages(data.messages || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load chat');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    setMessageInput('');

    try {
      const response = await apiClient.post<SendMessageResponse>(
        `/conversation/chat/session/${sessionId}/message`,
        { text: userMessage.text }
      );

      if (response.assistantReply) {
        setMessages((prev) => [...prev, response.assistantReply!]);
      }
    } catch (err: any) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-teal-900' : 'bg-gradient-to-b from-white to-teal-100'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (error || !speaker) {
    return (
      <div className={`w-full h-screen flex items-center justify-center ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-teal-900' : 'bg-gradient-to-b from-white to-teal-100'
      }`}>
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || 'Speaker not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen font-cabin flex flex-col overflow-hidden transition-colors ${
      isDark
        ? `bg-gradient-to-b ${themeColors.gradientFrom} ${themeColors.gradientTo}`
        : `bg-gradient-to-b ${themeColors.lightGradientFrom} ${themeColors.lightGradientTo}`
    }`}>
      {/* Chat Header */}
      <header className={`flex m-4 rounded-3xl items-center justify-between p-4 shadow-lg z-20 flex-shrink-0 ${themeColors.headerBg} ${themeColors.textColor}`}>
        <div className="flex flex-col items-start">
          <h1 className="text-xl font-bold">{speaker.name}</h1>
          <p className={`text-sm ${isDark ? 'opacity-90' : 'opacity-70'}`}>
            {speaker.description}
          </p>
        </div>
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="relative w-14 h-14 rounded-full hover:scale-105 transition-transform"
        >
          <Image
            src={speaker.flagUrl}
            alt={`${speaker.name}'s flag`}
            fill
            className="rounded-full object-cover"
          />
          <Image
            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
            alt={`Avatar of ${speaker.name}`}
            fill
            className="rounded-full"
            unoptimized
          />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-grow flex flex-col-reverse p-4 sm:p-6 gap-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex items-start gap-3 w-full ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {msg.sender === 'speaker' && (
                <div className="relative w-12 h-12 rounded-full flex-shrink-0 mt-2">
                  <Image
                    src={speaker.flagUrl}
                    alt={`${speaker.name}'s flag`}
                    fill
                    className="rounded-full object-cover"
                  />
                  <Image
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
                    alt={`Avatar of ${speaker.name}`}
                    fill
                    className="rounded-full"
                    unoptimized
                  />
                </div>
              )}
              <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? isDark
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-700 text-white'
                    : isDark
                    ? 'bg-teal-400 text-gray-800'
                    : 'bg-teal-200 text-black'
                }`}>
                  <p className="font-semibold">{msg.text}</p>
                </div>
                {msg.sender === 'speaker' && (
                  <div className={`flex items-center gap-3 mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <button onClick={() => setAnalyzingMessage(msg)} title="Analyze words">
                      <Book size={20} className="hover:text-white" />
                    </button>
                    <button title="Play audio">
                      <Volume2 size={20} className="hover:text-white" />
                    </button>
                    <button title="Copy">
                      <Copy size={20} className="hover:text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Bar */}
      <footer className={`flex m-4 rounded-3xl items-center gap-2 sm:gap-4 p-3 shadow-lg z-20 flex-shrink-0 ${themeColors.inputBg}`}>
        <button className={`${isDark ? themeColors.textColor : themeColors.lightTextColor} hover:opacity-80`} title="Bookmark">
          <Bookmark size={32} />
        </button>

        {/* Voice Recorder - Only show for English/Spanish speakers */}
        {speaker && isVoiceSupported(speaker.language) && (
          <VoiceRecorder
            targetLanguage={speaker.language.toLowerCase() as 'english' | 'spanish'}
            onTranscript={(text) => {
              setMessageInput(prev => prev ? `${prev} ${text}` : text);
            }}
            onError={(error) => {
              console.error('Voice error:', error);
              // You can show a toast notification here
            }}
          />
        )}

        <div className="flex-grow relative">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sending ? 'Sending...' : 'Type your message or use voice'}
            className={`w-full rounded-lg py-3 pl-4 pr-12 outline-none ${
              isDark
                ? 'bg-[#232323] text-white placeholder:text-gray-400'
                : 'bg-white text-black placeholder:text-gray-500'
            }`}
            disabled={sending}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={sending || !messageInput.trim()}
          className={`${isDark ? themeColors.textColor : themeColors.lightTextColor} hover:opacity-80 disabled:opacity-50`}
          title="Send"
        >
          <Send size={32} />
        </button>
      </footer>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div
          onClick={() => setIsProfileModalOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs flex flex-col items-center"
          >
            <div
              className={`w-full text-white font-bold rounded-t-3xl py-2 text-center text-lg ${isDark ? 'bg-red-500' : 'bg-[#ef476f]'}`}
            >
              {speaker.name}
            </div>
            <div
              className={`w-full rounded-b-3xl p-6 flex flex-col items-center gap-6 ${isDark ? 'bg-[#232323]' : 'bg-white'}`}
            >
              <div className="relative w-32 h-32 rounded-full">
                <Image
                  src={speaker.flagUrl}
                  alt={`${speaker.name}'s flag`}
                  fill
                  className="rounded-full object-cover"
                />
                <Image
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${speaker.avatarSeed}`}
                  alt={`Avatar of ${speaker.name}`}
                  fill
                  className="rounded-full"
                  unoptimized
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">{speaker.name}</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {speaker.language} Speaker
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1">Personality</h4>
                    <div className="flex flex-wrap gap-1">
                      {speaker.personality.map((p) => (
                        <span key={p} className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {speaker.interests.map((i) => (
                        <span key={i} className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className={`w-full rounded-full py-2 font-bold ${isDark ? 'bg-red-500 text-white' : 'bg-[#ef476f] text-white'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal - placeholder for future implementation */}
      {analyzingMessage && (
        <div
          onClick={() => setAnalyzingMessage(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className={`relative p-6 rounded-3xl max-w-sm w-full ${isDark ? 'bg-[#232323] text-white' : 'bg-white text-black'}`}>
            <h3 className="text-xl font-bold mb-4">Word Analysis</h3>
            <p className="mb-4">Message: "{analyzingMessage.text}"</p>
            <button
              onClick={() => setAnalyzingMessage(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;