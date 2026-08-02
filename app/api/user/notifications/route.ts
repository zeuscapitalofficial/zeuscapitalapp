import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // If user has no notifications yet, seed default welcome notifications
    if (notifications.length === 0) {
      const seeded = await prisma.notification.createMany({
        data: [
          {
            userId: session.user.id,
            title: "Welcome to Zeus Capital",
            message: "Your account is activated. Explore live market feeds, algorithmic trading signals, and mining packages.",
            type: "INFO",
            isRead: false,
          },
          {
            userId: session.user.id,
            title: "Account Security Recommendation",
            message: "Verify your email and complete KYC identity verification to unlock higher withdrawal limits.",
            type: "SECURITY",
            isRead: false,
          },
        ],
      });

      const updated = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ notifications: updated });
    }

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("GET notifications error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationId } = body;

    if (action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { userId: session.user.id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "markRead" && notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId: session.user.id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST notifications error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await prisma.notification.deleteMany({
        where: { id, userId: session.user.id },
      });
    } else {
      await prisma.notification.deleteMany({
        where: { userId: session.user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE notification error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
