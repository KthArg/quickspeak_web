"use client";

import React, { useState, useEffect } from "react";
import LeftSidebar from "../components/leftSideBar";
import { useTheme } from "../contexts/ThemeContext";
import { Menu, X } from "lucide-react";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "../lib/notificationSocket";
import { tokenManager } from '../lib/api';
import ProtectedRoute from '../components/ProtectedRoute';

// --- SUB-COMPONENTE: Modal de Confirmación de Logout (con Light Mode) ---
const LogoutConfirmationModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative w-full max-w-sm flex flex-col items-center gap-6 p-8 rounded-2xl shadow-2xl
                ${
                  theme === "dark"
                    ? "bg-[#232323] border-2 border-cyan-400/50"
                    : "bg-white"
                }`}
      >
        <button
          onClick={onCancel}
          className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 border-2 rounded-full text-sm font-semibold transition-colors
                        ${
                          theme === "dark"
                            ? "border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                            : "border-gray-400 text-gray-600 hover:bg-gray-100"
                        }`}
        >
          <X size={16} /> Close
        </button>

        <div className="text-center mt-8">
          <h2
            className={`text-3xl font-bold
                        ${theme === "dark" ? "text-cyan-400" : "text-[#073b4c]"}`}
          >
            Confirm Logout
          </h2>
          <p
            className={`mt-2
                        ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Are you sure you wish to log out of your account?
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full rounded-lg py-3 font-bold text-lg text-white transition-colors
                            ${
                              theme === "dark"
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-[#444] hover:bg-gray-600"
                            }`}
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className={`w-full rounded-lg py-3 font-bold text-lg transition-colors
                                ${
                                  theme === "dark"
                                    ? "bg-cyan-400 text-black hover:bg-cyan-300"
                                    : "bg-[#073b4c] text-white hover:bg-opacity-90"
                                }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme } = useTheme();

  // - Conexión al WebSocket de notificaciones
  // - lee el token de localStorage (lo guardamos en el login)
  useEffect(() => {
    // === 1) Leer env, token y userId ===
    const apiBase = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

    console.log("[notif] env apiBase =", apiBase);
    console.log("[notif] token exists? ", !!token);
    console.log("[notif] userId =", userId);

    // === 2) Conectar WS si hay token ===
    if (token) {
      connectNotificationSocket(token, (data) => {
        console.log("🔔 Notificación recibida (WS):", data);
        const titulo = data.title ?? "Notificación";
        const mensaje = data.message ?? "";
        alert(`${titulo}\n${mensaje}`);
      });
    } else {
      console.warn("[notif] No hay token -> no conecto WS");
    }

    // === 3) Prefetch del historial desde el backend de notificaciones ===
    async function prefetchNotis() {
      if (!apiBase) {
        console.warn(
          "[notif] NEXT_PUBLIC_NOTIFICATION_API_URL no está definida"
        );
        return;
      }
      if (!token || !userId) {
        console.warn(
          "[notif] Falta token o userId -> no hago fetch de historial"
        );
        return;
      }

      const url = `${apiBase}/notifications/user/${userId}`;
      console.log("[notif] Fetching historial:", url);

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("[notif] Error HTTP", res.status, text);
          return;
        }
        const notis = await res.json();
        console.log("📦 Notificaciones iniciales:", notis);
      } catch (err) {
        console.error("[notif] Error de red/JS al pedir historial:", err);
      }
    }

    // cleanup cuando se sale del dashboard
    return () => {
      disconnectNotificationSocket();
    };
  }, []);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);

    // Limpiar credenciales del navegador
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      // Usar también tokenManager para limpieza adicional
      tokenManager.removeToken();
    }

    console.log("Token JWT eliminado - Sesión cerrada");
    // Redirigir al inicio
    window.location.href = "/";
  };

  return (
    <ProtectedRoute>
      <div
        className={`flex h-screen w-full ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#232323] to-[#2c006e]"
            : "bg-gray-50"
        }`}
      >
        {/* Sidebar desktop */}
        <div className="hidden md:flex flex-shrink-0">
          <LeftSidebar onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Header mobile */}
          <header
            className={`md:hidden flex items-center justify-between p-4 shadow-md flex-shrink-0 ${
              theme === "dark" ? "bg-[#232323]" : "bg-white border-b"
            }`}
          >
            <h1
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Quick Speak
            </h1>
            <button
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
            >
              <Menu size={28} />
            </button>
          </header>

          {/* Main */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}
    </ProtectedRoute>
  );
}
