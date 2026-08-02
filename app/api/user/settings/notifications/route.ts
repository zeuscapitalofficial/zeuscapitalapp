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

    // Default emailEnabled to false for all accounts as per policy
    return NextResponse.json({
      preferences: {
        emailEnabled: false,
        pushEnabled: true,
        securityAlerts: true,
        transactionAlerts: true,
        miningAlerts: true,
        depositAlerts: true,
        withdrawalAlerts: true,
        referralAlerts: true,
        marketingEmails: false,
        doNotDisturb: false,
        dndStart: "22:00",
        dndEnd: "08:00",
      },
    });
  } catch (error: any) {
    console.error("GET notifications failed:", error);
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
    return NextResponse.json({ success: true, preferences: body });
  } catch (error: any) {
    console.error("POST notifications failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
