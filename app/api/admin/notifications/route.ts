import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function POST(request: Request) {
  try {
    const adminSession = await checkAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized access: admin level required" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, title, message, type } = body;

    if (!title || !message || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (userId === "ALL") {
      // Broadcast to all users in the database
      const users = await prisma.user.findMany({ select: { id: true } });
      
      const createData = users.map((u) => ({
        userId: u.id,
        title,
        message,
        type
      }));

      await prisma.notification.createMany({
        data: createData
      });

      return NextResponse.json({ success: true, count: users.length });
    } else {
      // Send alert to a specific user
      if (!userId) {
        return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
      }

      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type
        }
      });

      return NextResponse.json({ success: true, notification });
    }
  } catch (error: any) {
    console.error("POST admin dispatch notification failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
