import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return null;
  }
  return session;
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
    const { kycId, status, rejectionReason } = body;

    if (!kycId || !status) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    if (
      status !== "APPROVED" &&
      status !== "REJECTED" &&
      status !== "PENDING"
    ) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const kyc = await prisma.kyc.update({
      where: { id: kycId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
      },
    });

    // Create automatic alert notification for the user
    await createNotification({
      userId: kyc.userId,
      title:
        status === "APPROVED" ? "Identity Verified" : "Verification Rejected",
      message:
        status === "APPROVED"
          ? "Your AML/KYC compliance audit was approved. Account limits have been fully unlocked."
          : `Auditor feedback: ${rejectionReason || "Please verify document parameters and resubmit."}`,
      type: status === "APPROVED" ? "SECURITY" : "WARNING",
    });

    return NextResponse.json({ success: true, kyc });
  } catch (error: any) {
    console.error("KYC review request failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
