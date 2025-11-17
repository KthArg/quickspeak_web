// src/app/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apim-quick-speak.azure-api.net';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Claves para almacenar el token JWT y userId en localStorage
const TOKEN_STORAGE_KEY = 'authToken';
const USER_ID_STORAGE_KEY = 'userId';

type ApiError = {
  success?: boolean;
  message?: string;
  error?: string;
};

/**
 * Manejo de tokens JWT y userId en localStorage
 */
export const tokenManager = {
  /**
   * Guarda el token JWT y userId en localStorage
   */
  saveToken: (token: string, userId?: number): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (userId !== undefined) {
        localStorage.setItem(USER_ID_STORAGE_KEY, userId.toString());
      }
    }
  },

  /**
   * Obtiene el token JWT desde localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  },

  /**
   * Obtiene el userId desde localStorage
   */
  getUserId: (): number | null => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  },

  /**
   * Elimina el token JWT y userId de localStorage
   */
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    }
  },

  /**
   * Verifica si existe un token
   */
  hasToken: (): boolean => {
    return tokenManager.getToken() !== null;
  },
};

async function handleResponse<T>(res: Response, url: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      // Ignore parsing error
    }
  } else {
    try {
      const txt = await res.text();
      data = txt ? { message: txt } : null;
    } catch {
      // Ignore
    }
  }

  // Handle certificate errors
  if (res.status === 401 && res.headers.get('www-authenticate')?.includes('certificate')) {
    tokenManager.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?error=certificate';
    }
    throw new Error('Client certificate required. Please contact administrator.');
  }

  // Handle authentication errors globally
  if (res.status === 401 || res.status === 403) {
    tokenManager.removeToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    const msg = (data as ApiError)?.message || 'Session expired. Please login again.';
    throw new Error(msg);
  }

  if (!res.ok) {
    const msg = (data as ApiError)?.message || `Error ${res.status} calling ${url}`;
    throw new Error(msg);
  }
  return data as T;
}

function buildHeaders(extra?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extra || {}),
  };

  // Agregar API Key si está configurada
  if (API_KEY) {
    headers["Ocp-Apim-Subscription-Key"] = API_KEY;
  }

  // Agregar JWT token si existe en localStorage
  const token = tokenManager.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Maps frontend routes to backend API endpoints through APIM
 *
 * Examples:
 * - /conversation/speakers/catalog → /conversation/speakers/catalog
 * - /conversation/chat/session/{sessionId}/message → /conversation/chat/session/{sessionId}/message
 * - /conversation/dictionary/words → /conversation/dictionary/words
 */
function mapEndpoint(endpoint: string): string {
  // Conversation Service endpoints (already prefixed with /conversation/)
  if (endpoint.startsWith('/conversation/')) {
    return endpoint;
  }

  const userId = tokenManager.getUserId();

  // User Service endpoints
  // Public routes for languages (no userId required)
  if (endpoint === "/user/languages/starting") {
    return "/users/api/v1/languages/starting";
  }
  if (endpoint === "/user/languages/catalog" || endpoint === "/user/languages/full-catalog") {
    return "/users/api/v1/languages";
  }

  // Routes that require userId
  if (userId) {
    // /user/languages → /users/api/v1/users/{userId}/languages
    if (endpoint === "/user/languages") {
      return `/users/api/v1/users/${userId}/languages`;
    }

    // /user/languages/{languageId}/make-native → /users/api/v1/users/{userId}/languages/{languageId}/native
    if (endpoint.match(/^\/user\/languages\/(\d+)\/make-native$/)) {
      const languageId = endpoint.match(/\/user\/languages\/(\d+)\/make-native$/)?.[1];
      return `/users/api/v1/users/${userId}/languages/${languageId}/native`;
    }

    // /user/languages/{languageId} → /users/api/v1/users/{userId}/languages/{languageId}
    if (endpoint.match(/^\/user\/languages\/\d+$/)) {
      const languageId = endpoint.match(/\/user\/languages\/(\d+)$/)?.[1];
      return `/users/api/v1/users/${userId}/languages/${languageId}`;
    }

    // /user/profile/basic → /users/api/v1/users/{userId}
    if (endpoint === "/user/profile/basic") {
      return `/users/api/v1/users/${userId}`;
    }
  }

  // If no mapping matches, return the original endpoint
  return endpoint;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const mappedEndpoint = mapEndpoint(endpoint);
    const url = `${API_BASE_URL}${mappedEndpoint}`;
    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res, url);
  },
  async post<T>(endpoint: string, body: any): Promise<T> {
    const mappedEndpoint = mapEndpoint(endpoint);
    const url = `${API_BASE_URL}${mappedEndpoint}`;
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const mappedEndpoint = mapEndpoint(endpoint);
    const url = `${API_BASE_URL}${mappedEndpoint}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const mappedEndpoint = mapEndpoint(endpoint);
    const url = `${API_BASE_URL}${mappedEndpoint}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res, url);
  },

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const mappedEndpoint = mapEndpoint(endpoint);
    const url = `${API_BASE_URL}${mappedEndpoint}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },
};

// Type definitions for Conversation Service

export interface Speaker {
  id: string;
  name: string;
  language: string;
  flagEmoji: string;
  avatarSeed: string;
  personality: string[];
  interests: string[];
  color: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'speaker';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  speaker: Speaker;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  text: string;
}

export interface SendMessageResponse {
  success: boolean;
  echo?: {
    receivedAtUtc: string;
    sessionId: string;
    yourMessage: string;
  };
  assistantReply?: ChatMessage;
}

export interface RecentChat {
  id: string;
  speakerId: string;
  chatId: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  color: string;
  avatarSeed: string;
  flagEmoji: string;
}

export interface DictionaryItem {
  id: string;
  language: string;
  wordCount: number;
  flagUrl: string;
}

export interface Word {
  id: number;
  word: string;
  color: string;
  translated: boolean;
  translations: Array<{
    language: string;
    word: string;
    color: string;
  }>;
}

export interface NotificationPayload {
  type: 'WORD_SAVED' | 'NEW_MESSAGE' | 'WORD_FORGOTTEN';
  userId: string;
  data: Record<string, any>;
}

export interface SavedSpeaker {
  id: string;
  name: string;
  avatarSeed: string;
  flagEmoji: string;
}
