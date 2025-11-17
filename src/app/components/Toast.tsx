"use client";

import React, { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const colorMap = {
    success: {
      dark: "bg-green-600/90 border-green-400",
      light: "bg-green-500 border-green-600",
      icon: "text-green-200",
    },
    error: {
      dark: "bg-red-600/90 border-red-400",
      light: "bg-red-500 border-red-600",
      icon: "text-red-200",
    },
    warning: {
      dark: "bg-yellow-600/90 border-yellow-400",
      light: "bg-yellow-500 border-yellow-600",
      icon: "text-yellow-200",
    },
  };

  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border-2 text-white font-cabin animate-fade-in-up
        ${theme === "dark" ? colors.dark : colors.light}
      `}
    >
      <Icon size={24} className={colors.icon} />
      <span className="font-semibold text-base">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed top-0 right-0 z-[9999] p-6 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Hook para usar toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};
