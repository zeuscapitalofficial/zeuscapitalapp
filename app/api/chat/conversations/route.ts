import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/chat/conversations - list all conversations (admin sees all, user sees own)
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isAdmin = session.user.role === "ADMIN";

    const conversations = await prisma.chatConversation.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      orderBy: { lastAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        messages: {
          where: { isRead: false, senderRole: isAdmin ? "USER" : "ADMIN" },
          select: { id: true },
        },
      },
    });

    const result = conversations.map((c) => ({
      id: c.id,
      subject: c.subject,
      isOpen: c.isOpen,
      lastMessage: c.lastMessage,
      lastAt: c.lastAt,
      createdAt: c.createdAt,
      user: c.user,
      unreadCount: c.messages.length,
    }));

    return NextResponse.json({ conversations: result });
  } catch (error) {
    console.error("GET /api/chat/conversations failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
