import "dotenv/config";
import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./lib/prisma.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? (dev ? "localhost" : "0.0.0.0");
const port = Number(process.env.PORT ?? 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    await handle(req, res, parsedUrl);
  });

  const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean) ?? ["*"];

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
    pingTimeout: 60000,
    pingInterval: 25000,
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ── Authentication ──
    socket.on("authenticate", async ({ userId }: { userId: string }) => {
      if (!userId || typeof userId !== "string") {
        socket.emit("auth-error", { message: "Invalid userId provided" });
        return;
      }
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, name: true },
        });
        if (!user) {
          socket.emit("auth-error", { message: "User not found" });
          return;
        }
        socket.data.userId = user.id;
        socket.data.role = user.role;
        socket.data.userName = user.name;

        // Join user specific room
        socket.join(`user:${user.id}`);
        if (user.role === "ADMIN") {
          socket.join("admins");
        }

        socket.emit("auth-success");
      } catch (err) {
        console.error("[Socket] Auth query error:", err);
      }
    });

    // ── Relay Real-Time System & User Notifications ──
    socket.on("dispatch-notification", ({ userId, notification, type }) => {
      if (userId === "ALL") {
        io.emit("notification:new", notification);
      } else if (userId) {
        io.to(`user:${userId}`).emit("notification:new", notification);
      }

      if (type === "SYSTEM") {
        io.to("admins").emit("admin:system-alert", notification);
      }
    });

    // ── Join a conversation room ──
    socket.on("join-conversation", async (conversationId: string) => {
      if (!socket.data.userId) return;
      const conv = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
        select: { userId: true },
      });
      if (!conv) {
        socket.emit("join-error", { message: "Access denied" });
        return;
      }
      if (socket.data.role === "ADMIN" || conv.userId === socket.data.userId) {
        socket.join(`conv:${conversationId}`);
        console.log(`[Socket] ${socket.id} joined conv:${conversationId}`);
      } else {
        socket.emit("join-error", { message: "Access denied" });
      }
    });

    // ── Join admin room (admin clients only) ──
    socket.on("join-admin", () => {
      if (!socket.data.userId) return;
      socket.join("admins");
      console.log(`[Socket] ${socket.id} joined admin room`);
    });

    // ── Send message ──
    socket.on(
      "send-message",
      async (data: {
        conversationId?: string;
        userId: string;
        senderRole: "USER" | "ADMIN";
        content: string;
        senderName: string;
      }) => {
        if (!socket.data.userId) return;
        try {
          const { conversationId, userId, senderRole, content, senderName } = data;

          if (!content?.trim() || !userId) return;

          let convId = conversationId;

          // Create conversation on first user message
          if (!convId && senderRole === "USER") {
            const conv = await prisma.chatConversation.create({
              data: {
                userId,
                subject: "Support Request",
                lastMessage: content.trim(),
                lastAt: new Date(),
              },
            });
            convId = conv.id;

            socket.emit("conversation-created", { conversationId: convId });

            io.to("admins").emit("new-conversation", {
              id: convId,
              userId,
              senderName,
              lastMessage: content.trim(),
              lastAt: new Date().toISOString(),
            });
          }

          if (!convId) return;

          // Persist to DB
          const message = await prisma.chatMessage.create({
            data: {
              conversationId: convId,
              senderId: userId,
              senderRole,
              content: content.trim(),
            },
          });

          await prisma.chatConversation.update({
            where: { id: convId },
            data: { lastMessage: content.trim(), lastAt: new Date() },
          });

          const payload = {
            id: message.id,
            conversationId: convId,
            senderId: message.senderId,
            senderRole: message.senderRole,
            senderName,
            content: message.content,
            isRead: message.isRead,
            createdAt: message.createdAt.toISOString(),
          };

          socket.join(`conv:${convId}`);
          io.to(`conv:${convId}`).emit("new-message", payload);

          io.to("admins").emit("message-in-conversation", {
            conversationId: convId,
            message: payload,
          });
        } catch (err) {
          console.error("[Socket] send-message error:", err);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    socket.on("typing-start", ({ conversationId }: { conversationId: string }) => {
      if (!socket.data.userId) return;
      socket.to(`conv:${conversationId}`).emit("user-typing", {
        conversationId,
        userId: socket.data.userId,
        userName: socket.data.userName ?? "Support",
      });
    });

    socket.on("typing-stop", ({ conversationId }: { conversationId: string }) => {
      if (!socket.data.userId) return;
      socket.to(`conv:${conversationId}`).emit("user-stopped-typing", {
        conversationId,
        userId: socket.data.userId,
      });
    });

    socket.on("mark-read", async ({ conversationId, messageIds }: { conversationId: string; messageIds: string[] }) => {
      if (!socket.data.userId) return;
      await prisma.chatMessage.updateMany({
        where: { id: { in: messageIds }, conversationId },
        data: { isRead: true },
      });
      io.to(`conv:${conversationId}`).emit("messages-read", {
        conversationId,
        readBy: socket.data.userId,
        messageIds,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
