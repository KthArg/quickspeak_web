// src/app/api/chat/session/[sessionId]/message/route.ts
export const runtime = "nodejs";

import { apiClient } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const NOTIF_API_BASE =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_URL ||
  "https://quickspeak-notification-service.azurewebsites.net";

const NOTIF_JWT_SECRET =
  process.env.NOTIFICATION_JWT_SECRET || "hola123";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // 1) Igual que antes: leer sessionId y body
    const { sessionId } = await params;
    const body = await request.json();

    // 2) Llamada REAL a tu backend (APIM)
    const data = await apiClient.post(
      `/conversation/chat/session/${sessionId}/message`,
      body
    );

    // ---------- NOTIFICACIÓN: NEW_MESSAGE ----------
    // ¿A quién notificamos? (usa el que ya venías pasando)
    const recipientId: string =
      body.recipientUserId || body.toUserId || "123";

    // Firmamos un JWT para notification-service
    const notifToken = jwt.sign(
      { sub: recipientId, email: "notif-placeholder@example.com" },
      NOTIF_JWT_SECRET,
      { algorithm: "HS256" }
    );

    // Payload que va a tu notification-service
    const payload = {
      type: "NEW_MESSAGE",
      userId: recipientId,
      data: {
        sessionId,
        text: body.text ?? "",
      },
    };

    // Llamada HTTP al microservicio en Azure:
    const resp = await fetch(`${NOTIF_API_BASE}/notifications/dev-send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${notifToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error(
        "Error llamando a /notifications/dev-send:",
        resp.status,
        await resp.text()
      );
      // No rompemos el 200 del core
    }
    // ---------- FIN NOTIFICACIÓN ----------

    // 3) Devolvemos al frontend lo mismo que antes
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Error en POST /api/chat/session/[sessionId]/message:",
      error
    );
    return NextResponse.json(
      { error: error?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
