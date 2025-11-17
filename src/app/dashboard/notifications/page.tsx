// src/app/dashboard/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/app/lib/notificationSocket";

interface Notification {
  PartitionKey: string;
  RowKey: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  data?: string; // viene como JSON string desde el backend
  ts?: number;          // timestamp numérico para ordenar
  displayDate?: string; // fecha formateada para mostrar
}

// =====================
// Helpers de fecha
// =====================

function sanitizeTimestamp(raw: string): string {
  // Formatos típicos:
  // 2025-11-16T00:57:55.414223
  // 2025-11-16T00:57:55.414223Z
  // 2025-11-16T00:57:55.414223+00:00
  const match =
    raw.match(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(Z|[+\-]\d{2}:\d{2})?$/
    );

  if (!match) {
    return raw;
  }

  const base = match[1];       // YYYY-MM-DDTHH:MM:SS
  const frac = match[2] || ""; // .414223
  let tz = match[3];           // Z o +00:00 o undefined
  if (!tz) {
    tz = "Z";
  }

  let trimmedFrac = "";
  if (frac) {
    trimmedFrac = frac.slice(0, 4);
  }

  return base + trimmedFrac + tz;
}


function parseDateFromBackend(raw?: string): Date | null {
  if (!raw) return null;
  const sanitized = sanitizeTimestamp(raw);
  const d = new Date(sanitized);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function buildDisplayDate(raw?: string): { ts: number; display: string } {
  const d = parseDateFromBackend(raw);
  if (!d) {
    return {
      ts: 0,
      display: raw ?? "",
    };
  }

  return {
    ts: d.getTime(),
    display: d.toLocaleString("es-CR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// Normalizar una notificación cualquiera para que tenga ts + displayDate
function normalizeNotification(n: Notification): Notification {
  const { ts, display } = buildDisplayDate(n.createdAt);
  return {
    ...n,
    ts,
    displayDate: display,
  };
}

export default function NotificationsPage() {
  const [notis, setNotis] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // 1) Cargar desde el REST
  // =========================
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const storedUserId =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const userId = storedUserId || "123";

    if (!token) {
      setLoading(false);
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
    if (!apiBase) {
      console.error("NEXT_PUBLIC_NOTIFICATION_API_URL no está definida");
      setLoading(false);
      return;
    }

    fetch(`${apiBase}/notifications/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data: Notification[]) => {
        const normalized = data.map((n) => normalizeNotification(n));
        const sorted = normalized.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
        setNotis(sorted);
      })
      .catch((err) => {
        console.error("Error cargando notificaciones:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // =====================================
  // 2) Escuchar las nuevas por WebSocket
  // =====================================
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const storedUserId =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const userId = storedUserId || "123";

    if (!token) {
      console.warn(
        "[notifications/page] No hay token, no me conecto al WS de notificaciones"
      );
      return;
    }

    connectNotificationSocket(token, (data: any) => {
      console.log(
        "🔔 Notificación recibida (WS) en /dashboard/notifications:",
        data
      );

      const base: Notification = {
        PartitionKey: data.userId ?? userId,
        RowKey: data.id ?? crypto.randomUUID(),
        title: data.title,
        message: data.message,
        read: false,
        createdAt: data.createdAt ?? new Date().toISOString(),
        data: data.data ? JSON.stringify(data.data) : undefined,
      };

      const nueva = normalizeNotification(base);

      setNotis((prev) => {
        const next = [nueva, ...prev];
        return next.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
      });
    });

    return () => {
      disconnectNotificationSocket();
    };
  }, []);

  // =========================
  // 3) Marcar como leída
  // =========================
  const markAsRead = async (rowKey: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const apiBase = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL;
    if (!token || !apiBase) return;

    const res = await fetch(
      `${apiBase}/notifications/mark-read/${rowKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setNotis((prev) =>
        prev.map((n) =>
          n.RowKey === rowKey ? { ...n, read: true } : n
        )
      );
    } else {
      console.warn("No se pudo marcar como leída en el backend");
    }
  };

  if (loading) {
    return <p>Cargando notificaciones...</p>;
  }

  const sortedNotis = [...notis].sort(
    (a, b) => (b.ts ?? 0) - (a.ts ?? 0)
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Notificaciones</h1>

      {sortedNotis.length === 0 ? (
        <p>No hay notificaciones.</p>
      ) : (
        <ul className="space-y-2">
          {sortedNotis.map((n) => {
            let parsedData: any = null;
            if (n.data) {
              try {
                parsedData = JSON.parse(n.data);
              } catch {
                // ignorar error de parseo
              }
            }

            return (
              <li
                key={n.RowKey}
                className="border rounded p-3 flex items-center justify-between gap-3"
                style={{ opacity: n.read ? 0.5 : 1 }}
              >
                <div>
                  <p className="font-semibold">
                    {n.title ?? "Notificación"}
                  </p>
                  <p>{n.message ?? "(sin mensaje)"}</p>

                  {parsedData?.word && (
                    <p className="text-sm text-gray-500">
                      Palabra: <b>{parsedData.word}</b>
                    </p>
                  )}

                  {n.displayDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {n.displayDate}
                    </p>
                  )}
                </div>

                {!n.read && (
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => markAsRead(n.RowKey)}
                  >
                    Marcar leída
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
