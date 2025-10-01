import { useState, useEffect } from 'react';
import { speakerService, Speaker } from '@/services';

export const useSpeakers = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [savedSpeakers, setSavedSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakersCatalog = async () => {
    try {
      const speakerList = await speakerService.getSpeakersCatalog();
      setSpeakers(speakerList);
    } catch (err) {
      setError('Failed to fetch speakers catalog');
      console.error('Error fetching speakers catalog:', err);
    }
  };

  const fetchSavedSpeakers = async () => {
    try {
      const savedList = await speakerService.getSavedSpeakers();
      setSavedSpeakers(savedList);
    } catch (err) {
      setError('Failed to fetch saved speakers');
      console.error('Error fetching saved speakers:', err);
    }
  };

  const getSpeakerProfile = async (speakerId: string): Promise<Speaker> => {
    try {
      return await speakerService.getSpeakerProfile(speakerId);
    } catch (err) {
      setError('Failed to fetch speaker profile');
      console.error('Error fetching speaker profile:', err);
      throw err;
    }
  };

  const saveSpeaker = async (speakerId: string) => {
    try {
      const response = await speakerService.saveSpeaker(speakerId);
      if (response.success) {
        await fetchSavedSpeakers(); // Refresh saved speakers list
        return response;
      }
      throw new Error(response.message || 'Failed to save speaker');
    } catch (err) {
      setError('Failed to save speaker');
      console.error('Error saving speaker:', err);
      throw err;
    }
  };

  const removeSavedSpeaker = async (speakerId: string) => {
    try {
      const response = await speakerService.removeSavedSpeaker(speakerId);
      if (response.success) {
        await fetchSavedSpeakers(); // Refresh saved speakers list
        return response;
      }
      throw new Error(response.message || 'Failed to remove saved speaker');
    } catch (err) {
      setError('Failed to remove saved speaker');
      console.error('Error removing saved speaker:', err);
      throw err;
    }
  };

  const updateChatColor = async (speakerId: string, color: string) => {
    try {
      const response = await speakerService.updateChatColor(speakerId, color);
      if (response.success) {
        // Update the color locally for immediate UI feedback
        setSavedSpeakers(prev => prev.map(speaker => 
          speaker.id === speakerId ? { ...speaker, color } : speaker
        ));
        return response;
      }
      throw new Error(response.message || 'Failed to update chat color');
    } catch (err) {
      setError('Failed to update chat color');
      console.error('Error updating chat color:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSpeakersCatalog(), fetchSavedSpeakers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    speakers,
    savedSpeakers,
    loading,
    error,
    getSpeakerProfile,
    saveSpeaker,
    removeSavedSpeaker,
    updateChatColor,
    refreshSpeakers: fetchSpeakersCatalog,
    refreshSavedSpeakers: fetchSavedSpeakers,
  };
};