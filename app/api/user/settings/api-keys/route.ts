import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsed: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, apiKeys });
  } catch (error: any) {
    console.error("GET API keys failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
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
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 },
      );
    }

    // Generate API key: zc_live_<random>
    const key = `zc_live_${crypto.randomBytes(24).toString("hex")}`;
    const prefix = key.substring(0, 12); // zc_live_xxxx
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        keyHash,
        prefix,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
      },
    });

    // Return the full key only once
    return NextResponse.json({ success: true, apiKey: { ...apiKey, key } });
  } catch (error: any) {
    console.error("POST create API key failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
