import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the session belongs to the user
    const sessionToDelete = await prisma.session.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!sessionToDelete) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Don't allow deleting current session
    if (sessionToDelete.id === session.session?.id) {
      return NextResponse.json(
        { error: "Cannot revoke current session" },
        { status: 400 },
      );
    }

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE session failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
