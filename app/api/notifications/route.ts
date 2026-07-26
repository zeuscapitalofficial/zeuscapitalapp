import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return session?.user || null;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("GET notifications failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id } = body;

    if (id) {
      // Mark specific notification as read
      await prisma.notification.updateMany({
        where: { id, userId: user.id },
        data: { isRead: true }
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST read notifications failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
