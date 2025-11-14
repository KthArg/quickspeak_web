// app/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apim-quick-speak.azure-api.net";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

type ApiError = {
  success?: boolean;
  message?: string;
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
  
  // Revisar la suscripción para comprar su es igual a la subscription key de APIM
  if (API_KEY) {
    headers["Ocp-Apim-Subscription-Key"] = API_KEY;
  }
  
  // JWT token desde localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
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
};
