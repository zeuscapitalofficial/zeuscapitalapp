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

    // Fetch user details with referrer and referrals count
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        referralCode: true,
        bonusRewards: true,
        referredBy: {
          select: {
            id: true,
            name: true,
            email: true,
            referralCode: true,
          },
        },
        referrals: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let referralCode = user.referralCode;

    // Generate unique referral code if user doesn't have one yet
    if (!referralCode) {
      referralCode = `zc-${userId.slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode },
      });
    }

    const earned = user.bonusRewards ?? 0;
    const referredCount = user.referrals.length;

    return NextResponse.json({
      referralCode,
      referredCount,
      earned,
      referredBy: user.referredBy,
      referrals: user.referrals,
    });
  } catch (error: any) {
    console.error("GET user referrals failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
