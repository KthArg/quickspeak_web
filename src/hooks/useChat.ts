import { useState, useEffect } from 'react';
import { chatService, Conversation, ChatMessages } from '@/services';

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const conversationList = await chatService.getConversations();
      setConversations(conversationList);
    } catch (err) {
      setError('Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChatMessages = async (conversationId: string): Promise<ChatMessages | null> => {
    try {
      return await chatService.getChatMessages(conversationId);
    } catch (err) {
      setError('Failed to fetch chat messages');
      console.error('Error fetching chat messages:', err);
      return null;
    }
  };

  const sendMessage = async (messageData: {
    conversationId: string;
    content: string;
    type?: 'text' | 'audio';
  }) => {
    try {
      const response = await chatService.sendMessage(messageData);
      if (response.success) {
        // Optionally refresh conversations to update last message
        await fetchConversations();
        return response;
      }
      throw new Error(response.message || 'Failed to send message');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await chatService.markMessageAsRead(messageId);
      if (response.success) {
        return response;
      }
      throw new Error(response.message || 'Failed to mark message as read');
    } catch (err) {
      setError('Failed to mark message as read');
      console.error('Error marking message as read:', err);
      throw err;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await chatService.deleteConversation(conversationId);
      if (response.success) {
        await fetchConversations(); // Refresh conversations list
        return response;
      }
      throw new Error(response.message || 'Failed to delete conversation');
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    getChatMessages,
    sendMessage,
    markMessageAsRead,
    deleteConversation,
    refreshConversations: fetchConversations,
  };
};