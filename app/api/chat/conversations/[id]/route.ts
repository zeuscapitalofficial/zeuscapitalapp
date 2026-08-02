import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { isOpen } = body as { isOpen?: boolean };

    if (typeof isOpen !== "boolean") {
      return NextResponse.json({ error: "isOpen (boolean) is required" }, { status: 400 });
    }

    const conversation = await prisma.chatConversation.update({
      where: { id },
      data: { isOpen },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("PATCH /api/chat/conversations/[id] failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
