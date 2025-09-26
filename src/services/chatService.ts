import { apiClient } from './api';
import { 
  Conversation, 
  Message,
  ChatMessages,
  ConversationsResponse,
  ApiResponse 
} from './types';

export const chatService = {
  // GET /chat/conversations - Get Conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<ConversationsResponse>('/chat/conversations');
    return response.conversations;
  },

  // GET /chat/conversations/{conversationId}/messages - Get Chat Messages
  async getChatMessages(conversationId: string): Promise<ChatMessages> {
    return await apiClient.get<ChatMessages>(`/chat/conversations/${conversationId}/messages`);
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