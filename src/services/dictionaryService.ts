import { apiClient } from './api';
import { 
  Word, 
  WordsResponse,
  ApiResponse,
  Translation 
} from './types';

export const dictionaryService = {
  // GET /dictionary/words - Get User Words
  async getUserWords(): Promise<Word[]> {
    const response = await apiClient.get<WordsResponse>('/dictionary/words');
    return response.words;
  },

  // POST /dictionary/words - Add New Word
  async addWord(wordData: {
    word: string;
    language: string;
    color?: string;
  }): Promise<ApiResponse<Word>> {
    return await apiClient.post<ApiResponse<Word>>('/dictionary/words', wordData);
  },

  // PUT /dictionary/words/{wordId} - Update Word
  async updateWord(
    wordId: string, 
    wordData: {
      word?: string;
      language?: string;
      color?: string;
      translated?: boolean;
      translations?: Translation[];
    }
  ): Promise<ApiResponse<Word>> {
    return await apiClient.put<ApiResponse<Word>>(`/dictionary/words/${wordId}`, wordData);
  },

  // PUT /dictionary/words/batch-update - Update Multiple Words
  async updateWordsInBatch(
    updates: Array<{
      id: string;
      word?: string;
      language?: string;
      color?: string;
      translated?: boolean;
      translations?: Translation[];
    }>
  ): Promise<ApiResponse<{
    updatedWords: Word[];
    totalUpdated: number;
  }>> {
    return await apiClient.put<ApiResponse<{
      updatedWords: Word[];
      totalUpdated: number;
    }>>('/dictionary/words/batch-update', { updates });
  },

  // DELETE /dictionary/words/{wordId} - Delete Word
  async deleteWord(wordId: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<ApiResponse<{ success: boolean }>>(`/dictionary/words/${wordId}`);
  },

  // POST /dictionary/translate - Translate Word
  async translateWord(translateData: {
    word: string;
    fromLanguage: string;
    toLanguage: string;
  }): Promise<ApiResponse<{
    originalWord: string;
    translatedWord: string;
    fromLanguage: string;
    toLanguage: string;
    pronunciation?: string;
    partOfSpeech?: string;
    examples?: Array<{
      original: string;
      translated: string;
    }>;
    synonyms?: string[];
    difficulty?: string;
    frequency?: string;
  }>> {
    return await apiClient.post<ApiResponse<{
      originalWord: string;
      translatedWord: string;
      fromLanguage: string;
      toLanguage: string;
      pronunciation?: string;
      partOfSpeech?: string;
      examples?: Array<{
        original: string;
        translated: string;
      }>;
      synonyms?: string[];
      difficulty?: string;
      frequency?: string;
    }>>('/dictionary/translate', translateData);
  },
};