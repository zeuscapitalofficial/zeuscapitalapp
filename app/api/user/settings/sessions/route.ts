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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const sessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    // Mark current session
    const currentSessionId = session.session?.id;
    const sessionsWithCurrent = sessions.map(s => ({
      ...s,
      current: s.id === currentSessionId,
    }));

    return NextResponse.json({ sessions: sessionsWithCurrent });
  } catch (error: any) {
    console.error("GET sessions failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}