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

    // Check for monthly recurring Stamp Duty ($15) & Taxation ($25) debits
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existingStampDuty = await prisma.transaction.findFirst({
      where: {
        userId,
        type: "STAMP_DUTY",
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const existingTax = await prisma.transaction.findFirst({
      where: {
        userId,
        type: "TAXATION",
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    if (!existingStampDuty) {
      await prisma.transaction.create({
        data: {
          userId,
          type: "STAMP_DUTY",
          asset: "Regulatory Stamp Duty Fee",
          amount: 15.0,
          status: "COMPLETED",
          txHash: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: 15.0 } },
      });
    }

    if (!existingTax) {
      await prisma.transaction.create({
        data: {
          userId,
          type: "TAXATION",
          asset: "Monthly Capital Tax Levy",
          amount: 25.0,
          status: "COMPLETED",
          txHash: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: 25.0 } },
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 40,
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("GET user transactions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { type, asset, amount, txHash, address, customStatus } = body;

    if (!type || !asset || !amount) {
      return NextResponse.json(
        { error: "Missing required transaction fields" },
        { status: 400 }
      );
    }

    const txTypeUpper = type.toUpperCase();
    // Log DEPOSIT and WITHDRAWAL as PENDING by default unless customStatus provided
    const status = customStatus || (txTypeUpper === "PURCHASE" ? "COMPLETED" : "PENDING");

    const newTx = await prisma.transaction.create({
      data: {
        userId,
        type: txTypeUpper,
        asset,
        amount: Number(amount),
        txHash: txHash || null,
        address: address || null,
        status,
      },
    });

    // Note: Package and Signal purchases do NOT deduct from the user's available balance;
    // Users make fresh deposit payments for package/signal purchases.

    return NextResponse.json(newTx, { status: 201 });
  } catch (error: any) {
    console.error("POST user transaction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
