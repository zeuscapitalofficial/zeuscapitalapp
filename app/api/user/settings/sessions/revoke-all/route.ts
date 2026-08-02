import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all sessions except current
    const currentSessionId = session.session?.id;
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        NOT: { id: currentSessionId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST revoke-all sessions failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
