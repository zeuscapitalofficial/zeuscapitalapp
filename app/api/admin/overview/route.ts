import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      verifiedUsers,
      kycStats,
      openChatsCount,
      priceOverridesCount,
      usersAgg,
      recentUsers,
      pendingKycList,
      recentConversations,
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),

      // Verified emails count
      prisma.user.count({ where: { emailVerified: true } }),

      // KYC stats grouped
      prisma.kyc.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Open support conversations
      prisma.chatConversation.count({ where: { isOpen: true } }),

      // Active price overrides
      prisma.priceOverride.count({ where: { isEnabled: true } }),

      // Aggregations on user table for total balance & deposit
      prisma.user.aggregate({
        _sum: {
          balance: true,
          totalDeposit: true,
          totalProfit: true,
        },
      }),

      // Recent registered users (5 latest)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          balance: true,
          totalDeposit: true,
          createdAt: true,
          kyc: { select: { status: true } },
        },
      }),

      // Pending KYC audits queue
      prisma.kyc.findMany({
        where: { status: "PENDING" },
        take: 5,
        orderBy: { submittedAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
      }),

      // Recent conversations
      prisma.chatConversation.findMany({
        take: 5,
        orderBy: { lastAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true, image: true },
          },
        },
      }),
    ]);

    const pendingKycCount =
      kycStats.find((k) => k.status === "PENDING")?._count.status ?? 0;
    const approvedKycCount =
      kycStats.find((k) => k.status === "APPROVED")?._count.status ?? 0;
    const rejectedKycCount =
      kycStats.find((k) => k.status === "REJECTED")?._count.status ?? 0;

    return NextResponse.json({
      metrics: {
        totalUsers,
        verifiedUsers,
        pendingKyc: pendingKycCount,
        approvedKyc: approvedKycCount,
        rejectedKyc: rejectedKycCount,
        openChats: openChatsCount,
        activeOverrides: priceOverridesCount,
        totalBalance: usersAgg._sum.balance ?? 0,
        totalDeposit: usersAgg._sum.totalDeposit ?? 0,
        totalProfit: usersAgg._sum.totalProfit ?? 0,
      },
      recentUsers,
      pendingKycList,
      recentConversations,
    });
  } catch (error: any) {
    console.error("GET /api/admin/overview error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
