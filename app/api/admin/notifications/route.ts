import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { dispatchNotification } from "@/lib/notifications";

async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
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
      return NextResponse.json(
        { error: "Unauthorized access: admin level required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { userId, title, message, type } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    await dispatchNotification({
      userId,
      title,
      message,
      type: type || "INFO",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST admin dispatch notification failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
