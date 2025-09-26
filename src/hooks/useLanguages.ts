import { useState, useEffect } from 'react';
import { languageService, Language, UserLanguages } from '@/services';

export const useLanguages = () => {
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [userLanguages, setUserLanguages] = useState<UserLanguages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableLanguages = async () => {
    try {
      const languages = await languageService.getAvailableLanguages();
      setAvailableLanguages(languages);
    } catch (err) {
      setError('Failed to fetch available languages');
      console.error('Error fetching available languages:', err);
    }
  };

  const fetchUserLanguages = async () => {
    try {
      const languages = await languageService.getUserLanguages();
      setUserLanguages(languages);
    } catch (err) {
      setError('Failed to fetch user languages');
      console.error('Error fetching user languages:', err);
    }
  };

  const addLanguage = async (languageData: {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    level?: string;
  }) => {
    try {
      const response = await languageService.addLearningLanguage(languageData);
      if (response.success) {
        // Refresh user languages after adding
        await fetchUserLanguages();
        return response;
      }
      throw new Error(response.message || 'Failed to add language');
    } catch (err) {
      setError('Failed to add language');
      console.error('Error adding language:', err);
      throw err;
    }
  };

  const removeLanguage = async (languageCode: string) => {
    try {
      const response = await languageService.removeLearningLanguage(languageCode);
      if (response.success) {
        // Refresh user languages after removing
        await fetchUserLanguages();
        return response;
      }
      throw new Error(response.message || 'Failed to remove language');
    } catch (err) {
      setError('Failed to remove language');
      console.error('Error removing language:', err);
      throw err;
    }
  };

  const setNativeLanguage = async (languageCode: string) => {
    try {
      const response = await languageService.setNativeLanguage(languageCode);
      if (response.success) {
        // Refresh user languages after setting native language
        await fetchUserLanguages();
        return response;
      }
      throw new Error(response.message || 'Failed to set native language');
    } catch (err) {
      setError('Failed to set native language');
      console.error('Error setting native language:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAvailableLanguages(), fetchUserLanguages()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    availableLanguages,
    userLanguages,
    loading,
    error,
    addLanguage,
    removeLanguage,
    setNativeLanguage,
    refreshUserLanguages: fetchUserLanguages,
    refreshAvailableLanguages: fetchAvailableLanguages,
  };
};