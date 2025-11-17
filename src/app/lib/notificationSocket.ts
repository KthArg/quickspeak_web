// src/app/lib/notificationSocket.ts

let socket: WebSocket | null = null;
let reconnectTimer: any = null;
let reconnectAttempts = 0;
let manuallyClosed = false;

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function getWsBase() {
  // Usa wss en prod, ws en local
  const env = process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL;
  if (env) return env;
  const isLocal =
    typeof window !== "undefined" &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1");
  return isLocal ? "ws://localhost:8001" : `wss://${location.host}`;
}

function scheduleReconnect(connectFn: () => void) {
  // backoff exponencial con jitter y máximo 15s
  const base = Math.min(15000, 1000 * Math.pow(2, reconnectAttempts));
  const jitter = Math.floor(Math.random() * 400); // 0–400ms
  const delay = base + jitter;
  console.log("🔁 Reintentando conectar WS en", Math.round(delay / 1000), "s…");
  clearReconnectTimer();
  reconnectTimer = setTimeout(connectFn, delay);
  reconnectAttempts++;
}

export function connectNotificationSocket(
  token: string,
  onMessage: (data: any) => void
) {
  if (!token) {
    console.error("❌ No se puede conectar al WS: token vacío");
    return;
  }

  // Evitar conexiones duplicadas si ya está abierta
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("ℹ️ WS ya estaba conectado, no se abre uno nuevo.");
    return;
  }

  manuallyClosed = false;
  const base = getWsBase();
  const wsUrl = `${base}/ws/notifications?token=${token}`;

  // Si hay un socket en estado intermedio, lo cerramos antes
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    console.log("🔁 Cerrando WS anterior antes de abrir uno nuevo…");
    try { socket.close(); } catch {}
    socket = null;
  }

  clearReconnectTimer();
  const ws = new WebSocket(wsUrl);
  socket = ws;

  ws.onopen = () => {
    console.log("✅ WS notifications connected:", wsUrl);
    reconnectAttempts = 0; // resetea el backoff
    clearReconnectTimer();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("❌ Error parsing WS message", err);
    }
  };

  ws.onclose = (ev) => {
    console.log(
      `⚠️ WS notifications closed code=${ev.code} reason=${ev.reason || "sin razón"}`
    );
    clearReconnectTimer();
    if (manuallyClosed) return; // no reconectar si fue cierre manual

    // Reintentar SOLO si el cierre fue anormal (1006/1011/etc.)
    const abnormal = ev.code === 1006 || ev.code === 1011 || ev.code === 1012 || ev.code === 1013;
    if (abnormal) {
      scheduleReconnect(() => connectNotificationSocket(token, onMessage));
    }
  };

  ws.onerror = (_err) => {
    // En onerror muchos navegadores no dan detalles; evitamos spam
    console.warn("⚠️ WS notifications error (posible reload o cold start del backend)");
  };

  // ➕ Reintento al recuperar red o volver a la pestaña
  const onOnline = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      scheduleReconnect(() => connectNotificationSocket(token, onMessage));
    }
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") onOnline();
  };

  window.addEventListener("online", onOnline);
  document.addEventListener("visibilitychange", onVisible);

  // Limpieza de estos listeners si desconectas luego
}

export function disconnectNotificationSocket() {
  manuallyClosed = true;
  clearReconnectTimer();
  if (socket) {
    try { socket.close(1000, "manual"); } catch {}
    socket = null;
  }
}
