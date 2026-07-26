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

    // Generate referral code from user ID
    const referralCode = `ZC${session.user.id.slice(0, 8).toUpperCase()}`;

    // In production, query actual referral stats from database
    return NextResponse.json({
      stats: {
        code: referralCode,
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        thisMonthEarnings: 0,
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