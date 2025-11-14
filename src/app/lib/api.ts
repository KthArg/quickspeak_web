// app/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apim-quick-speak.azure-api.net";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Clave para almacenar el token JWT en localStorage
const TOKEN_STORAGE_KEY = "authToken";

type ApiError = {
  success?: boolean;
  message?: string;
};

/**
 * Manejo de tokens JWT en localStorage
 */
export const tokenManager = {
  /**
   * Guarda el token JWT en localStorage
   */
  saveToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
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
   * Elimina el token JWT de localStorage
   */
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
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
  const contentType = res.headers.get("content-type") || "";
  let data: any = null;

  // Intenta parsear JSON si viene
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      // ignora parse error y sigue con texto plano si aplica
    }
  } else {
    // Como fallback intenta texto
    try {
      const txt = await res.text();
      data = txt ? { message: txt } : null;
    } catch {
      // nada
    }
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
    const msg =
      (data && (data as ApiError).message) ||
      `Error ${res.status} al llamar ${url}`;
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

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res, url);
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res, url);
  },

  async patch<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res, url);
  },
};
