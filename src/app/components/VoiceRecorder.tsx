'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

// Supported languages for voice recognition
const SUPPORTED_LANGUAGES = {
  english: 'en-US',
  spanish: 'es-ES'
} as const;

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  targetLanguage: SupportedLanguage;
  onError?: (error: string) => void;
}

export default function VoiceRecorder({ onTranscript, targetLanguage, onError }: VoiceRecorderProps) {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    const hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(hasSupport);

    if (!hasSupport) {
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = SUPPORTED_LANGUAGES[targetLanguage];

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(`Recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [targetLanguage, onError, onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isSupported) {
    return null; // Hide component if not supported
  }

  return (
    <button
      onClick={toggleRecording}
      disabled={isRecording}
      className={`
        relative p-3 rounded-full transition-all duration-300
        ${isRecording
          ? 'bg-red-500 animate-pulse'
          : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
        }
        ${isRecording ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isRecording ? 'Listening...' : 'Click to speak'}
    >
      {isRecording ? <MicOff className="text-white" /> : <Mic />}
      {isRecording && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30"></span>
      )}
    </button>
  );
}
