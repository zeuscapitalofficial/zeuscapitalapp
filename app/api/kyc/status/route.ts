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
    const kyc = await prisma.kyc.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return NextResponse.json({ status: "NONE" });
    }

    return NextResponse.json({
      status: kyc.status,
      rejectionReason: kyc.rejectionReason,
      submittedAt: kyc.submittedAt,
    });
  } catch (error: any) {
    console.error("KYC status query error:", error);
    return NextResponse.json(
      { error: "Failed to query verification status" },
      { status: 500 },
    );
  }
}
