import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { referralCode, email } = body;

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 });
    }

    const cleanCode = referralCode.trim();

    // Try session-based auth first, fall back to email lookup for fresh signups
    let userId: string | null = null;

    const session = await auth.api.getSession({
      headers: await headers(),
    }).catch(() => null);

    if (session?.user?.id) {
      userId = session.user.id;
    } else if (email) {
      // Fresh signup — session cookie may not be set yet
      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        select: { id: true },
      });
      userId = user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Find sponsor by referral code
    const sponsor = await prisma.user.findFirst({
      where: {
        referralCode: {
          equals: cleanCode,
          mode: "insensitive",
        },
      },
    });

    if (!sponsor) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Cannot refer yourself
    if (sponsor.id === userId) {
      return NextResponse.json({ error: "Cannot use your own referral code" }, { status: 400 });
    }

    // Check if user has already been referred
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredById: true, name: true },
    });

    if (currentUser?.referredById) {
      return NextResponse.json({ message: "Referral already processed" });
    }

    // 1. Link referee to sponsor + $25 welcome bonus
    await prisma.user.update({
      where: { id: userId },
      data: {
        referredById: sponsor.id,
        bonusRewards: { increment: 25.0 },
      },
    });

    // 2. Credit sponsor $100 referral reward
    await prisma.user.update({
      where: { id: sponsor.id },
      data: {
        bonusRewards: { increment: 100.0 },
      },
    });

    // 3. Notify sponsor
    await createNotification({
      userId: sponsor.id,
      title: "Referral Bonus Received! 🎉",
      message: `${currentUser?.name || "A new trader"} registered using your referral code (${cleanCode})! $100.00 USD bonus has been added to your balance.`,
      type: "REWARDS",
    });

    // 4. Notify referee
    await createNotification({
      userId,
      title: "Welcome Referral Bonus! 🎁",
      message: `Welcome to Zeus Capital! $25.00 USD referral bonus has been added to your reward balance.`,
      type: "REWARDS",
    });

    return NextResponse.json({
      success: true,
      sponsorName: sponsor.name,
      bonusAdded: 25.0,
    });
  } catch (error: any) {
    console.error("POST claim referral code failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
