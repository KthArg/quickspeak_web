// src/lib/serviceBus.ts
import { ServiceBusClient } from "@azure/service-bus";

const connStr = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING!;
const queueName = process.env.AZURE_SERVICE_BUS_QUEUE_NAME!;

if (!connStr) throw new Error("AZURE_SERVICE_BUS_CONNECTION_STRING no está definida");
if (!queueName) throw new Error("AZURE_SERVICE_BUS_QUEUE_NAME no está definida");

let sbClient: ServiceBusClient | null = null;
function getClient() {
  if (!sbClient) {
    sbClient = new ServiceBusClient(connStr);
  }
  return sbClient;
}

export type NotificationType =
  | "WORD_SAVED"
  | "WORD_UPDATED"
  | "WORD_FORGOTTEN"
  | "NEW_MESSAGE"
  | "SYSTEM_ALERT"
  | "ACHIEVEMENT"
  | "REMINDER";

export async function publishNotificationMessage(params: {
  type: NotificationType;
  userId: string;
  data?: Record<string, any>;
}) {
  const client = getClient();
  const sender = client.createSender(queueName);

  const message = {
    body: {
      type: params.type,
      userId: params.userId,
      data: params.data ?? {},
    },
    contentType: "application/json",
  };

  try {
    await sender.sendMessages(message);
    return { ok: true };
  } finally {
    await sender.close();
  }
}

// opcional para pruebas/e2e
export async function closeServiceBusClient() {
  if (sbClient) {
    await sbClient.close();
    sbClient = null;
  }
}
