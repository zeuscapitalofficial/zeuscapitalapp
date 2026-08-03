import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      // Return all portfolio items across users
      const items = await prisma.portfolioItem.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json({ items });
    }

    const items = await prisma.portfolioItem.findMany({
      where: { userId: targetUserId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("GET admin portfolio error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { itemId, userId, symbol, name, category, quantity, avgBuyPrice, currentPrice } = body;

    if (itemId) {
      // Update existing item override
      const updated = await prisma.portfolioItem.update({
        where: { id: itemId },
        data: {
          quantity: quantity !== undefined ? parseFloat(quantity) : undefined,
          avgBuyPrice: avgBuyPrice !== undefined ? parseFloat(avgBuyPrice) : undefined,
          currentPrice: currentPrice !== undefined ? parseFloat(currentPrice) : undefined,
          adminOverride: true,
        },
      });

      return NextResponse.json({ success: true, item: updated });
    }

    if (!userId || !symbol || !name || quantity === undefined || currentPrice === undefined) {
      return NextResponse.json({ error: "Missing required asset details" }, { status: 400 });
    }

    // Create new item directly for user
    const created = await prisma.portfolioItem.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        name,
        category: category || "crypto",
        quantity: parseFloat(quantity),
        avgBuyPrice: parseFloat(avgBuyPrice || currentPrice),
        currentPrice: parseFloat(currentPrice),
        adminOverride: true,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    console.error("POST admin portfolio error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
