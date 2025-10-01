// Types for API responses
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speakers?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'very_hard';
  level?: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  addedAt?: string;
}

export interface UserLanguages {
  nativeLanguage: Language;
  learningLanguages: Language[];
}

export interface Word {
  id: string;
  word: string;
  language: string;
  color: string;
  translated: boolean;
  translations: Translation[];
  createdAt: string;
  lastReviewed?: string;
}

export interface Translation {
  language: string;
  word: string;
  color: string;
}

export interface Speaker {
  id: string;
  name: string;
  description?: string;
  avatarUrl: string;
  flagUrl: string;
  language: string;
  personality?: string[];
  interests?: string[];
  level?: string;
  rating?: number;
  bio?: string;
  totalChats?: number;
  averageResponseTime?: string;
  specialties?: string[];
  availability?: {
    timezone: string;
    status: string;
  };
  savedAt?: string;
  lastChatted?: string;
  color?: string;
}

export interface Conversation {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerAvatar: string;
  flagUrl: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  language: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'speaker';
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'unread';
  type: 'text' | 'audio';
}

// API Response types (what the API actually returns)
export interface ApiChatMessage {
  id: number;
  sender: 'speaker' | 'user';
  text: string;
  ts: string;
}

export interface ApiChatResponse {
  conversationId: string;
  speakerId: string;
  messages: ApiChatMessage[];
}

// Frontend types (what our components expect)
export interface ChatMessages {
  conversationId: string;
  messages: Message[];
  totalMessages: number;
  unreadCount: number;
  speakerInfo: Speaker;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  nativeLanguage: string;
  learningLanguages: string[];
  level: string;
  createdAt: string;
  stats: {
    totalWords: number;
    totalChats: number;
    streakDays: number;
    hoursLearned: number;
  };
}

export interface UserSettings {
  notifications: {
    chatMessages: boolean;
    dailyReminders: boolean;
    weeklyProgress: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowProfileViewing: boolean;
  };
  learning: {
    dailyGoal: number;
    difficultyLevel: string;
    autoTranslate: boolean;
    pronunciationHelp: boolean;
  };
  interface: {
    theme: string;
    language: string;
    fontSize: string;
  };
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LanguagesResponse {
  languages: Language[];
}

export interface WordsResponse {
  words: Word[];
}

export interface SpeakersResponse {
  speakers: Speaker[];
}

export interface SavedSpeakersResponse {
  savedSpeakers: Speaker[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
}