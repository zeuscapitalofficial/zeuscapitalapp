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

    const userId = session.user.id;

    // Fetch user with KYC relation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        kyc: {
          select: {
            status: true,
            submittedAt: true,
            rejectionReason: true,
            country: true,
            nationality: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      image: user.image,
      balance: user.balance ?? 0,
      totalProfit: user.totalProfit ?? 0,
      totalDeposit: user.totalDeposit ?? 0,
      bonusRewards: user.bonusRewards ?? 0,
      createdAt: user.createdAt,
      referralCode: user.referralCode || `zc-${user.id.slice(0, 6)}`,
      kycStatus: user.kyc?.status || "NONE",
      kyc: user.kyc,
    });
  } catch (error: any) {
    console.error("GET user summary failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
