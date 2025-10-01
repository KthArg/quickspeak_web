import { apiClient } from './api';
import { 
  Conversation, 
  Message,
  ChatMessages,
  ConversationsResponse,
  ApiResponse,
  ApiChatResponse,
  ApiChatMessage,
  Speaker
} from './types';

// Mock speaker data based on speakerId
const getMockSpeaker = (speakerId: string): Speaker => {
  const speakerData: Record<string, Speaker> = {
    'harper-de': {
      id: 'harper-de',
      name: 'Harper',
      description: 'German Speaker',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Harper',
      flagUrl: 'https://unpkg.com/circle-flags/flags/de.svg',
      language: 'German',
      personality: ['😛 Cheeky', '🤓 Nerdy'],
      interests: ['🧛 Vampires', '🦾 Robotics', '🎵 Coldplay'],
      level: 'native',
      rating: 4.8,
      totalChats: 150,
      averageResponseTime: '2 min'
    }
  };

  return speakerData[speakerId] || {
    id: speakerId,
    name: 'Unknown Speaker',
    description: 'Language Speaker',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=default',
    flagUrl: 'https://unpkg.com/circle-flags/flags/un.svg',
    language: 'Unknown',
    personality: [],
    interests: []
  };
};

// Adapter to transform API response to frontend format
const adaptApiResponseToFrontend = (apiResponse: ApiChatResponse): ChatMessages => {
  const adaptedMessages: Message[] = apiResponse.messages.map((apiMsg: ApiChatMessage) => ({
    id: apiMsg.id.toString(),
    conversationId: apiResponse.conversationId,
    senderId: apiMsg.sender === 'user' ? 'current-user' : apiResponse.speakerId,
    senderType: apiMsg.sender as 'user' | 'speaker',
    senderName: apiMsg.sender === 'speaker' ? getMockSpeaker(apiResponse.speakerId).name : undefined,
    senderAvatar: apiMsg.sender === 'speaker' ? getMockSpeaker(apiResponse.speakerId).avatarUrl : undefined,
    content: apiMsg.text,
    timestamp: apiMsg.ts,
    status: 'read' as const,
    type: 'text' as const
  }));

  return {
    conversationId: apiResponse.conversationId,
    messages: adaptedMessages,
    totalMessages: adaptedMessages.length,
    unreadCount: 0,
    speakerInfo: getMockSpeaker(apiResponse.speakerId)
  };
};

export const chatService = {
  // GET /chat/conversations - Get Conversations
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await apiClient.get<ConversationsResponse>('/chat/conversations');
      return response.conversations || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  // GET /chat/messages - Get Chat Messages
  async getChatMessages(conversationId?: string): Promise<ChatMessages> {
    const endpoint = conversationId ? `/chat/messages?conversationId=${conversationId}` : '/chat/messages';
    const apiResponse = await apiClient.get<ApiChatResponse>(endpoint);
    return adaptApiResponseToFrontend(apiResponse);
  },

  // POST /chat/messages - Send Message
  async sendMessage(messageData: {
    conversationId: string;
    content: string;
    type?: 'text' | 'audio';
  }): Promise<ApiResponse<{
    message: Message;
    response?: Message;
  }>> {
    return await apiClient.post<ApiResponse<{
      message: Message;
      response?: Message;
    }>>('/chat/messages', messageData);
  },

  // PUT /chat/messages/{messageId}/read - Mark Message as Read
  async markMessageAsRead(messageId: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.put<ApiResponse<{ success: boolean }>>(`/chat/messages/${messageId}/read`);
  },

  // DELETE /chat/conversations/{conversationId} - Delete Conversation
  async deleteConversation(conversationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<ApiResponse<{ success: boolean }>>(`/chat/conversations/${conversationId}`);
  },
};