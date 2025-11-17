// src/app/lib/notification_publisher.ts
// Publica DIRECTO a Azure Service Bus usando WebSockets (puerto 443) en Node.

import { ServiceBusClient, ServiceBusSender } from "@azure/service-bus";
import { WebSocket } from "ws";

export type NotificationType =
  | "NEW_MESSAGE"
  | "WORD_SAVED"
  | "WORD_UPDATED"
  | "WORD_FORGOTTEN"
  | string;

export interface NotificationPayload {
  type: NotificationType;
  userId: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
}

let _sbc: ServiceBusClient | null = null;
let _sender: ServiceBusSender | null = null;

function need(name: string, v?: string): string {
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

async function getSender(): Promise<ServiceBusSender> {
  if (_sender) return _sender;

  const connStr = need(
    "AZURE_SERVICE_BUS_CONNECTION_STRING",
    process.env.AZURE_SERVICE_BUS_CONNECTION_STRING
  );
  const queueName = need(
    "AZURE_SERVICE_BUS_QUEUE_NAME",
    process.env.AZURE_SERVICE_BUS_QUEUE_NAME
  );

  if (!_sbc) {
    _sbc = new ServiceBusClient(connStr, {
      webSocketOptions: { webSocket: WebSocket as any }, // usa WS 443
    });
  }
  _sender = _sbc.createSender(queueName);
  return _sender;
}

export async function publishNotification(payload: NotificationPayload) {
  const sender = await getSender();

  const message = {
    body: JSON.stringify(payload),
    contentType: "application/json",
    subject: payload.type,
    applicationProperties: {
      userId: payload.userId,
      type: payload.type,
    },
  };

  await sender.sendMessages(message);
}

// opcional para pruebas/cierre
export async function closePublisher() {
  try { await _sender?.close(); } catch {}
  _sender = null;
  try { await _sbc?.close(); } catch {}
  _sbc = null;
}
