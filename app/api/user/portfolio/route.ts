import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [user, items] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true, totalProfit: true },
      }),
      prisma.portfolioItem.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let totalValue = 0;
    let totalCost = 0;

    const formattedItems = items.map((item) => {
      const value = item.quantity * item.currentPrice;
      const cost = item.quantity * item.avgBuyPrice;
      const profitLoss = value - cost;
      const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0;

      totalValue += value;
      totalCost += cost;

      return {
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        avgBuyPrice: item.avgBuyPrice,
        currentPrice: item.currentPrice,
        totalValue: value,
        profitLoss,
        profitLossPercentage,
        adminOverride: item.adminOverride,
        updatedAt: item.updatedAt,
      };
    });

    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    return NextResponse.json({
      balance: user.balance,
      totalPortfolioValue: totalValue,
      totalProfitLoss,
      totalProfitLossPercentage,
      items: formattedItems,
    });
  } catch (error: any) {
    console.error("GET portfolio error:", error);
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

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { symbol, name, category, quantity, price } = body;

    if (!symbol || !name || !quantity || !price || quantity <= 0 || price <= 0) {
      return NextResponse.json({ error: "Invalid purchase details" }, { status: 400 });
    }

    const totalCost = quantity * price;

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < totalCost) {
      return NextResponse.json(
        { error: `Insufficient available balance. You need $${totalCost.toFixed(2)} USD but have $${user.balance.toFixed(2)} USD.` },
        { status: 400 }
      );
    }

    // Deduct user balance & upsert portfolio item in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct balance
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalCost } },
      });

      // 2. Check existing item
      const existing = await tx.portfolioItem.findFirst({
        where: { userId, symbol },
      });

      let portfolioItem;
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        const newTotalCost = existing.quantity * existing.avgBuyPrice + totalCost;
        const newAvgBuyPrice = newTotalCost / newQuantity;

        portfolioItem = await tx.portfolioItem.update({
          where: { id: existing.id },
          data: {
            quantity: newQuantity,
            avgBuyPrice: newAvgBuyPrice,
            currentPrice: price,
          },
        });
      } else {
        portfolioItem = await tx.portfolioItem.create({
          data: {
            userId,
            symbol: symbol.toUpperCase(),
            name,
            category: category || "crypto",
            quantity,
            avgBuyPrice: price,
            currentPrice: price,
          },
        });
      }

      // 3. Log transaction
      await tx.transaction.create({
        data: {
          userId,
          type: "PURCHASE",
          asset: `${name} (${symbol.toUpperCase()})`,
          amount: totalCost,
          status: "COMPLETED",
        },
      });

      return portfolioItem;
    });

    // 4. Send notification
    await createNotification({
      userId,
      title: "Asset Purchase Successful 📈",
      message: `Successfully purchased ${quantity} ${symbol.toUpperCase()} (${name}) for $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD.`,
      type: "SYSTEM",
    });

    return NextResponse.json({
      success: true,
      message: `Purchased ${quantity} ${symbol.toUpperCase()}`,
      item: result,
    });
  } catch (error: any) {
    console.error("POST portfolio purchase error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
