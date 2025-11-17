import { useEffect, useRef, useState } from 'react';
import { tokenManager } from './api';

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  data: Record<string, any>;
}

export function useWebSocket(onNotification: (payload: NotificationPayload) => void) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const connect = () => {
      const token = tokenManager.getToken();
      if (!token) return;
      // Use wss:// for production, ws:// for local dev
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnected(true);
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const payload: NotificationPayload = JSON.parse(event.data);
          onNotification(payload);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket error:', err);
        setConnected(false);
      };

      wsRef.current.onclose = () => {
        setConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Reconnecting WebSocket...');
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [onNotification]);

  return { connected };
}
