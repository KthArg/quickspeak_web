// src/app/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apim-quick-speak.azure-api.net";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Claves para almacenar el token JWT y userId en localStorage
const TOKEN_STORAGE_KEY = "authToken";
const USER_ID_STORAGE_KEY = "userId";

type ApiError = {
  success?: boolean;
  message?: string;
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
  const ct = res.headers.get("content-type") || "";
  let data: any = null;

  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch {}
  } else {
    try { const txt = await res.text(); data = txt ? { message: txt } : null; } catch {}
  }

  // Manejar errores de autenticación
  if (res.status === 401 || res.status === 403) {
    // Token expirado o inválido - limpiar y redirigir a login
    tokenManager.removeToken();

    // Solo redirigir si estamos en el navegador
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }

    const msg =
      (data && (data as ApiError).message) ||
      "Sesión expirada. Por favor inicia sesión nuevamente.";
    throw new Error(msg);
  }

  if (!res.ok) {
    const msg = (data as ApiError)?.message || `Error ${res.status} al llamar ${url}`;
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
 * Mapea las rutas del frontend al formato del backend de usuarios a través de APIM
 *
 * Ejemplos:
 * - /user/languages → /users/api/v1/users/{userId}/languages
 * - /user/languages/starting → /users/api/v1/languages/starting
 * - /user/profile/basic → /users/api/v1/users/{userId}/profile
 */
function mapEndpoint(endpoint: string): string {
  const userId = tokenManager.getUserId();

  // Mapeo de rutas públicas de languages (no requieren userId)
  if (endpoint === "/user/languages/starting") {
    return "/users/api/v1/languages/starting";
  }
  if (endpoint === "/user/languages/catalog" || endpoint === "/user/languages/full-catalog") {
    return "/users/api/v1/languages";
  }

  // Mapeo de rutas que requieren userId
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

  // Si no coincide con ningún mapeo, retornar el endpoint original
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
