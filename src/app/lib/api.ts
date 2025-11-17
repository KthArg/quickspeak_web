// src/app/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apiprojectmanagement.azure-api.net";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

type ApiError = { success?: boolean; message?: string };

async function handleResponse<T>(res: Response, url: string): Promise<T> {
  const ct = res.headers.get("content-type") || "";
  let data: any = null;

  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch {}
  } else {
    try { const txt = await res.text(); data = txt ? { message: txt } : null; } catch {}
  }

  if (!res.ok) {
    const msg = (data as ApiError)?.message || `Error ${res.status} al llamar ${url}`;
    throw new Error(msg);
  }
  return data as T;
}

function buildHeaders(extra?: Record<string,string>) {
  const h: Record<string,string> = { "Content-Type": "application/json", ...(extra||{}) };
  if (API_KEY) h["Ocp-Apim-Subscription-Key"] = API_KEY;
  return h;
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const res = await fetch(url, { method: "GET", headers: buildHeaders() });
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
};
