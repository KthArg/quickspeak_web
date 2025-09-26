import { useState, useEffect } from 'react';
import { userService, UserProfile, UserSettings } from '@/services';

export const useUser = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await userService.getUserProfile();
      setProfile(userProfile);
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const userSettings = await userService.getUserSettings();
      setSettings(userSettings);
    } catch (err) {
      setError('Failed to fetch user settings');
      console.error('Error fetching user settings:', err);
    }
  };

  const updateProfile = async (profileData: {
    name?: string;
    avatar?: string;
    nativeLanguage?: string;
    learningLanguages?: string[];
    level?: string;
  }) => {
    try {
      const response = await userService.updateUserProfile(profileData);
      if (response.success) {
        await fetchUserProfile(); // Refresh profile data
        return response;
      }
      throw new Error(response.message || 'Failed to update profile');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const updateSettings = async (settingsData: Partial<UserSettings>) => {
    try {
      const response = await userService.updateUserSettings(settingsData);
      if (response.success) {
        await fetchUserSettings(); // Refresh settings data
        return response;
      }
      throw new Error(response.message || 'Failed to update settings');
    } catch (err) {
      setError('Failed to update settings');
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUserProfile(), fetchUserSettings()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    profile,
    settings,
    loading,
    error,
    updateProfile,
    updateSettings,
    refreshProfile: fetchUserProfile,
    refreshSettings: fetchUserSettings,
  };
};