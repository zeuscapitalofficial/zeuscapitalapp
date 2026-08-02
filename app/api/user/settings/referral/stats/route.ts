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

    let dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        referralCode: true,
        bonusRewards: true,
        _count: {
          select: { referrals: true },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure user has a valid referralCode in DB
    let code = dbUser.referralCode;
    if (!code) {
      code = `zc-${session.user.id.slice(0, 6)}`;
      dbUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
        select: {
          id: true,
          referralCode: true,
          bonusRewards: true,
          _count: {
            select: { referrals: true },
          },
        },
      });
    }

    const totalReferrals = dbUser._count.referrals;
    const totalEarnings = dbUser.bonusRewards ?? 0;

    return NextResponse.json({
      stats: {
        code,
        totalReferrals,
        activeReferrals: totalReferrals,
        totalEarnings,
        pendingEarnings: 0,
        thisMonthEarnings: totalEarnings,
      },
    });
  } catch (error: any) {
    console.error("GET referral stats failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
