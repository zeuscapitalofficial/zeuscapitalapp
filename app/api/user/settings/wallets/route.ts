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

    const dbMethods = await prisma.paymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const wallets = dbMethods.map((m) => ({
      id: m.id,
      currency: m.type.split("_")[0] || "BTC",
      network: m.type.split("_")[1] || m.type,
      address: m.address,
      label: m.label,
      isDefault: m.isDefault,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({ wallets });
  } catch (error: any) {
    console.error("GET wallets failed:", error);
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

    const body = await request.json();
    const { currency, network, address, label } = body;

    if (!address || !currency) {
      return NextResponse.json(
        { error: "Address and currency are required" },
        { status: 400 }
      );
    }

    const typeStr = `${currency.toUpperCase()}_${(network || currency).toUpperCase()}`;

    const newMethod = await prisma.paymentMethod.create({
      data: {
        userId: session.user.id,
        type: typeStr,
        label: label || `${currency} Wallet`,
        address,
        isDefault: false,
      },
    });

    return NextResponse.json({
      success: true,
      wallet: {
        id: newMethod.id,
        currency,
        network: network || currency,
        address: newMethod.address,
        label: newMethod.label,
        isDefault: newMethod.isDefault,
        createdAt: newMethod.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST wallet failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
