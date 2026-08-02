import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Middleware security check for Admin privilege
async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const adminSession = await checkAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized access: admin level required" },
        { status: 401 },
      );
    }

    const users = await prisma.user.findMany({
      include: {
        kyc: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET users list failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminSession = await checkAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized access: admin level required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { userId, role, balance, totalProfit, bonusRewards, totalDeposit } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const updateData: Record<string, any> = {};

    if (role) {
      if (role !== "USER" && role !== "ADMIN") {
        return NextResponse.json(
          { error: "Invalid role specified" },
          { status: 400 },
        );
      }
      updateData.role = role;
    }

    if (typeof balance === "number") updateData.balance = balance;
    if (typeof totalProfit === "number") updateData.totalProfit = totalProfit;
    if (typeof bonusRewards === "number") updateData.bonusRewards = bonusRewards;
    if (typeof totalDeposit === "number") updateData.totalDeposit = totalDeposit;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("POST modify user failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
