import { apiClient } from './api';
import { 
  Speaker, 
  SpeakersResponse,
  SavedSpeakersResponse,
  ApiResponse 
} from './types';

export const speakerService = {
  // GET /speakers/catalog - Get Speakers Catalog
  async getSpeakersCatalog(): Promise<Speaker[]> {
    const response = await apiClient.get<SpeakersResponse>('/speakers/catalog');
    return response.speakers;
  },

  // GET /speakers/saved - Get Saved Speakers
  async getSavedSpeakers(): Promise<Speaker[]> {
    const response = await apiClient.get<SavedSpeakersResponse>('/speakers/saved');
    return response.savedSpeakers;
  },

  // GET /speakers/{speakerId}/profile - Get Speaker Profile
  async getSpeakerProfile(speakerId: string): Promise<Speaker> {
    const response = await apiClient.get<{ speaker: Speaker }>(`/speakers/${speakerId}/profile`);
    return response.speaker;
  },

  // POST /speakers/save/{speakerId} - Save Speaker
  async saveSpeaker(speakerId: string): Promise<ApiResponse<Speaker>> {
    return await apiClient.post<ApiResponse<Speaker>>(`/speakers/save/${speakerId}`);
  },

  // DELETE /speakers/saved/{speakerId} - Remove Saved Speaker
  async removeSavedSpeaker(speakerId: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<ApiResponse<{ success: boolean }>>(`/speakers/saved/${speakerId}`);
  },

  // PUT /speakers/saved/{speakerId}/color - Update Chat Color
  async updateChatColor(speakerId: string, color: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.post<ApiResponse<{ success: boolean }>>(`/speakers/saved/${speakerId}/color`, { color });
  },
};