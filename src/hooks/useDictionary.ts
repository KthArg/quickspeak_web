import { useState, useEffect } from 'react';
import { dictionaryService, Word, Translation } from '@/services';

export const useDictionary = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const userWords = await dictionaryService.getUserWords();
      setWords(userWords);
    } catch (err) {
      setError('Failed to fetch words');
      console.error('Error fetching words:', err);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (wordData: {
    word: string;
    language: string;
    color?: string;
  }) => {
    try {
      const response = await dictionaryService.addWord(wordData);
      if (response.success) {
        await fetchWords(); // Refresh words list
        return response;
      }
      throw new Error(response.message || 'Failed to add word');
    } catch (err) {
      setError('Failed to add word');
      console.error('Error adding word:', err);
      throw err;
    }
  };

  const updateWord = async (
    wordId: string,
    wordData: {
      word?: string;
      language?: string;
      color?: string;
      translated?: boolean;
      translations?: Translation[];
    }
  ) => {
    try {
      const response = await dictionaryService.updateWord(wordId, wordData);
      if (response.success) {
        await fetchWords(); // Refresh words list
        return response;
      }
      throw new Error(response.message || 'Failed to update word');
    } catch (err) {
      setError('Failed to update word');
      console.error('Error updating word:', err);
      throw err;
    }
  };

  const updateWordsInBatch = async (
    updates: Array<{
      id: string;
      word?: string;
      language?: string;
      color?: string;
      translated?: boolean;
      translations?: Translation[];
    }>
  ) => {
    try {
      const response = await dictionaryService.updateWordsInBatch(updates);
      if (response.success) {
        await fetchWords(); // Refresh words list
        return response;
      }
      throw new Error(response.message || 'Failed to update words');
    } catch (err) {
      setError('Failed to update words');
      console.error('Error updating words:', err);
      throw err;
    }
  };

  const deleteWord = async (wordId: string) => {
    try {
      const response = await dictionaryService.deleteWord(wordId);
      if (response.success) {
        await fetchWords(); // Refresh words list
        return response;
      }
      throw new Error(response.message || 'Failed to delete word');
    } catch (err) {
      setError('Failed to delete word');
      console.error('Error deleting word:', err);
      throw err;
    }
  };

  const translateWord = async (translateData: {
    word: string;
    fromLanguage: string;
    toLanguage: string;
  }) => {
    try {
      const response = await dictionaryService.translateWord(translateData);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to translate word');
    } catch (err) {
      setError('Failed to translate word');
      console.error('Error translating word:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return {
    words,
    loading,
    error,
    addWord,
    updateWord,
    updateWordsInBatch,
    deleteWord,
    translateWord,
    refreshWords: fetchWords,
  };
};