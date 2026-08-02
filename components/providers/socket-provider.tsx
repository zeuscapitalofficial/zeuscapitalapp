"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSession } from "@/lib/auth-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAuthenticated: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const socketBaseUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();

  useEffect(() => {
    if (!socketBaseUrl) {
      setIsConnected(false);
      setIsAuthenticated(false);
      setSocket(null);
      return;
    }

    // Single global Socket.IO connection instance
    const socketInstance = io(socketBaseUrl, {
      path: "/api/socket",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      if (userId) {
        socketInstance.emit("authenticate", { userId });
      }
    });

    socketInstance.on("auth-success", () => {
      setIsAuthenticated(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [socketBaseUrl]);

  // Emit authenticate when session loads/changes
  useEffect(() => {
    if (socket && isConnected && userId) {
      socket.emit("authenticate", { userId });
    }
  }, [socket, isConnected, userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isAuthenticated }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
