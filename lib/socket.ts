import { io, type Socket } from "socket.io-client";

declare global {
  var __globalSocket: Socket | undefined;
}

export function getSocket(): Socket {
  if (!globalThis.__globalSocket) {
    globalThis.__globalSocket = io({
      path: "/api/socket",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });
  }
  return globalThis.__globalSocket;
}
