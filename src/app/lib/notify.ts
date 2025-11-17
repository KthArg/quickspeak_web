// src/app/lib/notify.ts
import jwt from "jsonwebtoken";

const NOTIF_SECRET = process.env.NOTIFICATION_JWT_SECRET || "hola123";
const NOTIF_API = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || "http://localhost:8001";

/**
 * Publica una notificación al notification-service.
 * Por ahora usamos /notifications/test que llama process_notification directo.
 * Si luego expones /notifications/enqueue (Service Bus real), cambias la URL aquí.
 */
export async function publishNotification(type: string, userId: string, data: any = {}) {
  const serviceJwt = jwt.sign(
    { sub: userId, email: "system@quickspeak" },
    NOTIF_SECRET,
    { algorithm: "HS256" }
  );

  const res = await fetch(`${NOTIF_API}/notifications/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceJwt}`, // por si algún endpoint valida JWT
    },
    body: JSON.stringify({ type, userId, data }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Fallo al publicar notificación: ${res.status} ${txt}`);
  }
}
