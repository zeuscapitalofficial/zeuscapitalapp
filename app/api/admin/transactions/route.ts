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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("GET admin transactions error:", error);
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "transactionId and status are required" },
        { status: 400 }
      );
    }

    const tx = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (tx.status === status) {
      return NextResponse.json(tx);
    }

    // Update status
    const updatedTx = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });

    // If approving deposit or withdrawal
    if (status === "COMPLETED" && tx.status !== "COMPLETED") {
      if (tx.type === "DEPOSIT") {
        await prisma.user.update({
          where: { id: tx.userId },
          data: {
            balance: { increment: tx.amount },
            totalDeposit: { increment: tx.amount },
          },
        });

        await prisma.notification.create({
          data: {
            userId: tx.userId,
            title: "Deposit Approved",
            message: `Your deposit of $${tx.amount.toLocaleString()} (${tx.asset}) has been approved and credited to your available balance.`,
            type: "DEPOSIT",
          },
        });
      } else if (tx.type === "WITHDRAWAL") {
        await prisma.user.update({
          where: { id: tx.userId },
          data: {
            balance: { decrement: tx.amount },
          },
        });

        await prisma.notification.create({
          data: {
            userId: tx.userId,
            title: "Withdrawal Approved",
            message: `Your withdrawal request of $${tx.amount.toLocaleString()} (${tx.asset}) has been approved and sent to your wallet.`,
            type: "WITHDRAWAL",
          },
        });
      }
    } else if (status === "REJECTED" && tx.status !== "REJECTED") {
      await prisma.notification.create({
        data: {
          userId: tx.userId,
          title: "Transaction Declined",
          message: `Your ${tx.type.toLowerCase()} request of $${tx.amount.toLocaleString()} (${tx.asset}) was declined by administration.`,
          type: "WARNING",
        },
      });
    }

    return NextResponse.json(updatedTx);
  } catch (error: any) {
    console.error("POST admin transactions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
