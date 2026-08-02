import prisma from "@/lib/prisma";
import { getSocket } from "@/lib/socket";

export type NotificationType =
  | "INFO"
  | "WARNING"
  | "SECURITY"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "SYSTEM"
  | "REWARDS";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

/**
 * Dispatch an automated notification to a user or all users ("ALL")
 */
export async function createNotification({
  userId,
  title,
  message,
  type = "INFO",
}: CreateNotificationParams) {
  return dispatchNotification({ userId, title, message, type });
}

export async function dispatchNotification({
  userId,
  title,
  message,
  type = "INFO",
}: CreateNotificationParams) {
  try {
    if (userId === "ALL") {
      const users = await prisma.user.findMany({ select: { id: true } });
      const notificationsData = users.map((u) => ({
        userId: u.id,
        title,
        message,
        type,
      }));

      await prisma.notification.createMany({
        data: notificationsData,
      });

      // Relay via socket server
      try {
        const socket = getSocket();
        socket.emit("dispatch-notification", {
          userId: "ALL",
          notification: { title, message, type, createdAt: new Date().toISOString() },
          type,
        });
      } catch {}
      return;
    }

    // Single User Notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // Relay via socket server
    try {
      const socket = getSocket();
      socket.emit("dispatch-notification", {
        userId,
        notification,
        type,
      });
    } catch {}

    return notification;
  } catch (error) {
    console.error("Failed to dispatch notification:", error);
  }
}
