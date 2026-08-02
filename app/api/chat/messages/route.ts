import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/chat/messages?conversationId=xxx&after=<iso-date>
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const after = searchParams.get("after"); // ISO date for polling

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    // Verify the user owns this conversation (or is admin)
    const conversation = await prisma.chatConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });

    if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin && conversation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        conversationId,
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark admin messages as read for the user (and vice-versa)
    if (messages.length > 0) {
      await prisma.chatMessage.updateMany({
        where: {
          conversationId,
          senderRole: isAdmin ? "USER" : "ADMIN",
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/chat/messages failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/chat/messages
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { content, conversationId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "content required" }, { status: 400 });
    }

    const isAdmin = session.user.role === "ADMIN";

    let convId = conversationId as string | undefined;

    if (!convId) {
      // User starting a new conversation – create one
      if (isAdmin) {
        return NextResponse.json({ error: "Admin must specify conversationId" }, { status: 400 });
      }
      const conv = await prisma.chatConversation.create({
        data: {
          userId: session.user.id,
          subject: "Support Request",
          lastMessage: content.trim(),
          lastAt: new Date(),
        },
      });
      convId = conv.id;
    } else {
      // Verify access
      const conv = await prisma.chatConversation.findUnique({
        where: { id: convId },
        select: { userId: true },
      });
      if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (!isAdmin && conv.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const message = await prisma.chatMessage.create({
      data: {
        conversationId: convId,
        senderId: session.user.id,
        senderRole: isAdmin ? "ADMIN" : "USER",
        content: content.trim(),
      },
    });

    // Update conversation snapshot
    await prisma.chatConversation.update({
      where: { id: convId },
      data: {
        lastMessage: content.trim(),
        lastAt: new Date(),
      },
    });

    return NextResponse.json({ message, conversationId: convId });
  } catch (error) {
    console.error("POST /api/chat/messages failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
