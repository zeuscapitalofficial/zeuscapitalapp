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

    const kyc = await prisma.kyc.findUnique({
      where: { userId: session.user.id },
      select: {
        status: true,
        submittedAt: true,
        rejectionReason: true,
      },
    });

    return NextResponse.json({ kyc });
  } catch (error: any) {
    console.error("GET KYC status failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}