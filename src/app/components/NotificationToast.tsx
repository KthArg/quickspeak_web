'use client';

import { useState, useCallback } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useWebSocket, type NotificationPayload } from '@/app/lib/websocket';
import { X } from 'lucide-react';

interface NotificationToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function NotificationToast({ position = 'top-right' }: NotificationToastProps) {
  const { theme } = useTheme();
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [visible, setVisible] = useState(false);

  const handleNotification = useCallback((payload: NotificationPayload) => {
    setNotification(payload);
    setVisible(true);
    // Auto-hide after 5 seconds
    setTimeout(() => setVisible(false), 5000);
  }, []);

  const { connected } = useWebSocket(handleNotification);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (!visible || !notification) return null;

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full p-4 rounded-2xl shadow-2xl transform transition-all ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${theme === 'dark' ? 'bg-[#232323] border border-cyan-400/50' : 'bg-white border border-gray-200'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
          theme === 'dark' ? 'bg-cyan-400' : 'bg-teal-400'
        }`} />
        <div className="flex-grow min-w-0">
          <h3 className={`font-bold text-lg truncate ${
            theme === 'dark' ? 'text-cyan-400' : 'text-teal-600'
          }`}>
            {notification.title}
          </h3>
          <p className={`text-sm break-words ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {notification.message}
          </p>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {new Date(notification.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 p-1 rounded-full transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
              : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
          }`}
        >
          <X size={16} />
        </button>
      </div>
      {/* Connection indicator */}
      <div className={`mt-2 flex items-center gap-2 text-xs ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        {connected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
