import { apiClient } from './api';
import { 
  Language, 
  UserLanguages, 
  LanguagesResponse,
  ApiResponse 
} from './types';

export const languageService = {
  // GET /languages/available - Get Available Languages
  async getAvailableLanguages(): Promise<Language[]> {
    const response = await apiClient.get<LanguagesResponse>('/languages/available');
    return response.languages;
  },

  // GET /languages/user-languages - Get User Languages
  async getUserLanguages(): Promise<UserLanguages> {
    return await apiClient.get<UserLanguages>('/languages/user-languages');
  },

  // POST /languages/add - Add Learning Language
  async addLearningLanguage(languageData: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    level?: string;
  }): Promise<ApiResponse<Language>> {
    return await apiClient.post<ApiResponse<Language>>('/languages/add', languageData);
  },

  // DELETE /native-languages/{languageCode} - Remove Learning Language
  async removeLearningLanguage(languageCode: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<ApiResponse<{ success: boolean }>>(`/native-languages/${languageCode}`);
  },

  // PATCH /languages/native/{languageCode} - Set Native Language
  async setNativeLanguage(languageCode: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.request<ApiResponse<{ success: boolean }>>(`/languages/native/${languageCode}`, {
      method: 'PATCH',
      body: JSON.stringify({})
    });
  },
};