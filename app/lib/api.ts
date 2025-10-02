const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apiprojectmanagement.azure-api.net";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      headers["Ocp-Apim-Subscription-Key"] = API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al llamar ${url}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      headers["Ocp-Apim-Subscription-Key"] = API_KEY;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al llamar ${url}`);
    }

    return response.json();
  },
};
