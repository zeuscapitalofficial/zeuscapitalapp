import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const overrides = await prisma.priceOverride.findMany();
    return NextResponse.json(overrides);
  } catch (error: any) {
    console.error("GET overrides failed:", error);
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
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { coinId, priceUsd, isEnabled } = body;

    if (!coinId) {
      return NextResponse.json(
        { error: "Missing coinId parameter" },
        { status: 400 },
      );
    }

    const updatedOverride = await prisma.priceOverride.upsert({
      where: { coinId },
      update: {
        priceUsd: priceUsd !== undefined ? parseFloat(priceUsd) : undefined,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
      },
      create: {
        coinId,
        priceUsd: priceUsd !== undefined ? parseFloat(priceUsd) : 0,
        isEnabled: isEnabled !== undefined ? isEnabled : false,
      },
    });

    return NextResponse.json({ success: true, override: updatedOverride });
  } catch (error: any) {
    console.error("POST override failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
