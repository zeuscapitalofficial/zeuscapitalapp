import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (body.confirm !== "DELETE") {
      return NextResponse.json(
        { error: "Invalid confirmation" },
        { status: 400 },
      );
    }

    // In production, you would:
    // 1. Cancel all active mining plans
    // 2. Process any pending withdrawals
    // 3. Archive transaction history
    // 4. Remove wallet addresses and payment methods
    // 5. Delete or anonymize personal data
    // 6. Revoke all sessions
    // 7. Mark user as deleted (soft delete) or hard delete after 30 days

    // For now, just revoke all sessions
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });

    // Mark user as deleted (soft delete)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        email: `deleted_${Date.now()}_${session.user.email}`,
        name: "Deleted User",
        emailVerified: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE account failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
