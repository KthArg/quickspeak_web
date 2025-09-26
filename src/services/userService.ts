import { apiClient } from './api';
import { 
  UserProfile, 
  UserSettings,
  ApiResponse 
} from './types';

export const userService = {
  // GET /user/profile - Get User Profile
  async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get<{ user: UserProfile }>('/user/profile');
    return response.user;
  },

  // PUT /user/profile - Update User Profile
  async updateUserProfile(profileData: {
    name?: string;
    avatar?: string;
    nativeLanguage?: string;
    learningLanguages?: string[];
    level?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return await apiClient.put<ApiResponse<UserProfile>>('/user/profile', profileData);
  },

  // GET /user/settings - Get User Settings
  async getUserSettings(): Promise<UserSettings> {
    const response = await apiClient.get<{ settings: UserSettings }>('/user/settings');
    return response.settings;
  },

  // PUT /user/settings - Update User Settings
  async updateUserSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings & { updatedAt: string }>> {
    return await apiClient.put<ApiResponse<UserSettings & { updatedAt: string }>>('/user/settings', settings);
  },
};